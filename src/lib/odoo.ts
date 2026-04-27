/**
 * Odoo Service Layer for TechRover Automated Appraisal Process
 * This module provides a robust service pattern for connecting to Odoo and fetching data
 * while maintaining security through server-side operations.
 */

import xmlrpc from 'xmlrpc';
import { env } from 'process';

// Define TypeScript interfaces for Odoo data models
export interface OdooEmployee {
  id: number;
  name: string;
  email?: string;
  work_email?: string;
  work_phone?: string;
  department_id?: [number, string];
  job_id?: [number, string];
  manager_id?: [number, string];
  active?: boolean;
}

export interface OdooAppraisal {
  id: number;
  name: string;
  employee_id: [number, string];
  date_start: string;
  date_end: string;
  state: 'draft' | 'confirm' | 'done';
  overall_appraisal?: string;
  goals_evaluation?: string;
  evaluation_note?: string;
  manager_id?: [number, string];
  review_date?: string;
}

export interface OdooProject {
  id: number;
  name: string;
  date_start?: string;
  date?: string;
  user_id?: [number, string];
  partner_id?: [number, string];
  stage_id?: [number, string];
  progress?: number;
  task_count?: number;
  completed_task_count?: number;
}

export interface OdooTimesheet {
  id: number;
  name: string;
  date: string;
  unit_amount: number;
  project_id?: [number, string];
  task_id?: [number, string];
  employee_id?: [number, string];
  account_id?: [number, string];
}

// Configuration interface
interface OdooConfig {
  url: string;
  db: string;
  username: string;
  password: string;
}

// Service class for Odoo operations
export class OdooService {
  private client: xmlrpc.Client;
  private config: OdooConfig;
  private uid: number | null = null;

  constructor() {
    this.config = {
      url: env.ODOO_URL || 'http://localhost:8069',
      db: env.ODOO_DB_NAME || 'techrover_db',
      username: env.ODOO_USERNAME || 'admin',
      password: env.ODOO_PASSWORD || 'admin'
    };

    this.client = xmlrpc.createClient({
      host: new URL(this.config.url).hostname,
      port: new URL(this.config.url).port || 8069,
      path: '/xmlrpc/2/common',
      https: new URL(this.config.url).protocol === 'https:'
    });
  }

  /**
   * Authenticate with Odoo and get user ID
   */
  async authenticate(): Promise<number> {
    if (this.uid !== null) {
      return this.uid;
    }

    try {
      const uid = await new Promise<number>((resolve, reject) => {
        this.client.methodCall('authenticate', [
          this.config.db,
          this.config.username,
          this.config.password,
          {}
        ], (err: any, result: any) => {
          if (err) {
            reject(new Error(`Odoo authentication failed: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });

      this.uid = uid;
      return uid;
    } catch (error) {
      throw new Error(`Failed to authenticate with Odoo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generic method to search and read Odoo records
   * @param model The Odoo model name (e.g., 'hr.employee', 'project.project')
   * @param domain Search domain filters
   * @param fields List of fields to fetch
   * @param limit Maximum number of records to return
   * @param offset Offset for pagination
   * @returns Array of records
   */
  async searchRead(
    model: string,
    domain: any[] = [],
    fields: string[] = [],
    limit: number = 100,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const uid = await this.authenticate();
      
      // Create the client for the object method calls
      const objectClient = xmlrpc.createClient({
        host: new URL(this.config.url).hostname,
        port: new URL(this.config.url).port || 8069,
        path: '/xmlrpc/2/object',
        https: new URL(this.config.url).protocol === 'https:'
      });

      // Prepare the search and read parameters
      const params = [
        this.config.db,
        uid,
        this.config.password,
        model,
        'search_read',
        domain,
        {
          fields: fields,
          limit: limit,
          offset: offset
        }
      ];

      return await new Promise<any[]>((resolve, reject) => {
        objectClient.methodCall('execute_kw', params, (err: any, result: any) => {
          if (err) {
            reject(new Error(`Odoo searchRead failed for model ${model}: ${err.message}`));
          } else {
            resolve(result);
          }
        });
      });

    } catch (error) {
      throw new Error(`Failed to fetch data from Odoo model ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get employee data with appraisal information
   * @param employeeId Specific employee ID or null for all employees
   * @returns Employee data with appraisal metrics
   */
  async getEmployees(employeeId: number | null = null): Promise<OdooEmployee[]> {
    const domain: any[] = employeeId ? [['id', '=', employeeId]] : [];
    
    const fields = [
      'name',
      'email',
      'work_email',
      'work_phone',
      'department_id',
      'job_id',
      'manager_id',
      'active'
    ];

    try {
      const employees = await this.searchRead('hr.employee', domain, fields);
      
      // Map to our interface and add appraisal counts
      return employees.map((emp: any) => ({
        id: emp.id,
        name: emp.name || '',
        email: emp.email,
        work_email: emp.work_email,
        work_phone: emp.work_phone,
        department_id: emp.department_id,
        job_id: emp.job_id,
        manager_id: emp.manager_id,
        active: emp.active
      }));
    } catch (error) {
      throw new Error(`Failed to fetch employees from Odoo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get appraisal data for an employee
   * @param employeeId The employee ID
   * @returns Appraisal records
   */
  async getEmployeeAppraisals(employeeId: number): Promise<OdooAppraisal[]> {
    const domain = [['employee_id', '=', employeeId]];
    
    const fields = [
      'name',
      'date_start',
      'date_end',
      'state',
      'overall_appraisal',
      'goals_evaluation',
      'evaluation_note',
      'review_date'
    ];

    try {
      return await this.searchRead('hr.appraisal', domain, fields);
    } catch (error) {
      throw new Error(`Failed to fetch appraisals for employee ${employeeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get project data for an employee
   * @param employeeId The employee ID
   * @returns Project records
   */
  async getEmployeeProjects(employeeId: number): Promise<OdooProject[]> {
    const domain = [['user_id', '=', employeeId]];
    
    const fields = [
      'name',
      'date_start',
      'date',
      'stage_id',
      'progress',
      'task_count',
      'completed_task_count'
    ];

    try {
      return await this.searchRead('project.project', domain, fields);
    } catch (error) {
      throw new Error(`Failed to fetch projects for employee ${employeeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get timesheet data for an employee
   * @param employeeId The employee ID
   * @returns Timesheet records
   */
  async getEmployeeTimesheets(employeeId: number): Promise<OdooTimesheet[]> {
    const domain = [['employee_id', '=', employeeId]];
    
    const fields = [
      'name',
      'date',
      'unit_amount',
      'project_id',
      'task_id'
    ];

    try {
      return await this.searchRead('account.analytic.line', domain, fields);
    } catch (error) {
      throw new Error(`Failed to fetch timesheets for employee ${employeeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get dashboard summary data
   * @returns Summary statistics for the dashboard
   */
  async getDashboardSummary(): Promise<{
    totalEmployees: number;
    totalAppraisals: number;
    pendingAppraisals: number;
    lastSync: string;
  }> {
    try {
      // Get employee count
      const employees = await this.searchRead('hr.employee', [], ['id'], 1, 0);
      const totalEmployees = employees.length;

      // Get appraisal count
      const appraisals = await this.searchRead('hr.appraisal', [], ['id'], 1, 0);
      const totalAppraisals = appraisals.length;

      // Get pending appraisals (state = 'draft' or 'confirm')
      const pendingDomain = [
        ['state', 'in', ['draft', 'confirm']]
      ];
      const pendingAppraisals = await this.searchRead('hr.appraisal', pendingDomain, ['id'], 1, 0);
      const pendingCount = pendingAppraisals.length;

      return {
        totalEmployees,
        totalAppraisals,
        pendingAppraisals: pendingCount,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard summary from Odoo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance for easy use
export const odooService = new OdooService();
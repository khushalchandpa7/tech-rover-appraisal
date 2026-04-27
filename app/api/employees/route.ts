/**
 * Next.js API Route for fetching employee data from Odoo
 * This route is server-side only and securely connects to Odoo
 * using the Odoo service layer.
 */

import { NextResponse } from 'next/server';
import { odooService, OdooEmployee } from '@/lib/odoo';

export async function GET() {
  try {
    // Fetch employees from Odoo
    const employees: OdooEmployee[] = await odooService.getEmployees();
    
    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch employee data from Odoo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST handler for fetching specific employee
export async function POST(request: Request) {
  try {
    const { employeeId } = await request.json();
    
    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Employee ID is required'
        },
        { status: 400 }
      );
    }
    
    // Fetch specific employee from Odoo
    const employees: OdooEmployee[] = await odooService.getEmployees(employeeId);
    
    return NextResponse.json({
      success: true,
      data: employees[0] || null,
      count: employees.length
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch employee data from Odoo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
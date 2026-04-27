/**
 * Dashboard Page for TechRover Automated Appraisal Process
 * This page displays a summary overview of appraisal statuses and employee data
 */

import { Suspense } from 'react';
import { odooService } from '@/lib/odoo';
import EmployeeCard from '@/components/employee-card';
import DashboardSkeleton from '@/components/dashboard-skeleton';
import Sidebar from '@/components/sidebar';

export default async function DashboardPage() {
  // Fetch dashboard data
  const summary = await odooService.getDashboardSummary();
  
  // Fetch employees for display
  const employees = await odooService.getEmployees();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">TechRover Appraisal Dashboard</h1>
            <p className="mt-1 text-gray-600">Employee performance and appraisal overview</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Employees</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalEmployees}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Appraisals</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{summary.totalAppraisals}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{summary.pendingAppraisals}</p>
            </div>
          </div>

          {/* Recent Employees Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Employees</h2>
            </div>
            
            <div className="p-6">
              {employees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map(employee => (
                    <Suspense key={employee.id} fallback={<DashboardSkeleton />}>
                      <EmployeeCard employee={employee} />
                    </Suspense>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No employees found
                </div>
              )}
            </div>
          </div>
        </main>
      </main>
    </div>
  );
}
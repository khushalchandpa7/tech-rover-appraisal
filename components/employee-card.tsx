/**
 * Employee Card Component for TechRover Appraisal Dashboard
 * Displays individual employee information in a clean, card-based format
 */

import { OdooEmployee } from '@/lib/odoo';

interface EmployeeCardProps {
  employee: OdooEmployee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
            {employee.email && (
              <p className="text-sm text-gray-600">{employee.email}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {employee.department_id && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-24">Department:</span>
              <span className="font-medium">{employee.department_id[1]}</span>
            </div>
          )}
          
          {employee.job_id && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-24">Job:</span>
              <span className="font-medium">{employee.job_id[1]}</span>
            </div>
          )}
          
          {employee.work_phone && (
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-24">Phone:</span>
              <span className="font-medium">{employee.work_phone}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employee.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
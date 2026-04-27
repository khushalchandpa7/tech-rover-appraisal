/**
 * Sidebar Navigation Component
 * Provides navigation links for the TechRover Appraisal System
 */

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">TechRover</h1>
        <p className="text-gray-400 text-sm">Appraisal System</p>
      </div>
      
      <nav className="mt-6">
        <a 
          href="/" 
          className="flex items-center px-6 py-3 text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="ml-3">Dashboard</span>
        </a>
        
        <a 
          href="/appraisals" 
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <span className="ml-3">Appraisals</span>
        </a>
        
        <a 
          href="/employees" 
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <span className="ml-3">Employees</span>
        </a>
        
        <a 
          href="/projects" 
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <span className="ml-3">Projects</span>
        </a>
        
        <a 
          href="/reports" 
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <span className="ml-3">Reports</span>
        </a>
      </nav>
    </div>
  );
}
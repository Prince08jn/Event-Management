
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Welcome to the SuperAdmin Panel</h3>
        <p className="mt-2 text-sm text-gray-500">
          Select a table from the sidebar to view, edit, or delete records.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold">Database Connection</h4>
          <p className="text-blue-100 mt-2">Connected to Supabase</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold">Quick Actions</h4>
          <p className="text-purple-100 mt-2">Manage Users and Events easily</p>
        </div>
      </div>
    </div>
  );
}

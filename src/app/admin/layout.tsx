
import Link from 'next/link';
import { adminConfig } from '@/lib/admin-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { isUserAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !isUserAdmin(session.user.email)) {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Glassmorphism hint */}
      <aside className="w-64 bg-[#0f172a] text-white shadow-2xl overflow-y-auto border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
            rkade
          </h1>
          <p className="text-gray-400 text-xs font-medium tracking-wider uppercase mt-1">Super Admin</p>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <Link 
            href="/admin" 
            className="group flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-all duration-200 ease-in-out backdrop-blur-sm"
          >
            <span className="font-medium group-hover:text-white transition-colors">Dashboard</span>
          </Link>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              Database
            </p>
          </div>

          {Object.values(adminConfig).map((table) => (
            <Link
              key={table.name}
              href={`/admin/${table.name}`}
              className="group flex items-center px-4 py-2.5 text-gray-400 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white rounded-xl transition-all duration-200 border border-transparent hover:border-white/5"
            >
              <span className="capitalize text-sm font-medium">{table.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Overview
            </h2>
            <div className="flex items-center space-x-4">
               <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white">
                 SA
               </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

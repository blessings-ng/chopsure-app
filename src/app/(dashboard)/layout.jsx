import SideBar from "@/components/dashboard/SideBar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050505] transition-colors duration-500 selection:bg-[#FF6B00] selection:text-white">
      
      <SideBar />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen w-full transition-all duration-500">
        
        <Header />

        <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-4 overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  );
}
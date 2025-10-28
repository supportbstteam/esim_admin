
import '../app/globals.css'
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/providers/ThemeProvider";
import ReduxProvider from "@/providers/ReduxProvider";

export default function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    // <ReduxProvider>
    //   <ThemeProvider>
    //   </ThemeProvider>
    // </ReduxProvider>
    <div className="flex w-full h-full">
      {/* Sidebar with CSS animation */}
      <aside className="flex-shrink-0 animate-fade-slide-in-left">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar with CSS animation */}
        <header className="flex-shrink-0 animate-fade-slide-in-down">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto scrollbar-hide">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

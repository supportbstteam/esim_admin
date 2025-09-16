import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <div className="ssds min-h-screen flex items-center justify-center animated-gradient">
          <div className="w-full max-w-md p-8 bg-gradient-to-r from-emerald-500 to-emerald-900 dark:bg-gray-900 rounded-2xl shadow-lg">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
}

import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
              eSIM Admin Login
            </h1>
            {children}
          </div>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
}

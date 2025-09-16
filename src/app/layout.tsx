import "@/app/globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ClientLayoutWrapper from "@/layouts/ClientLayoutWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 w-screen h-screen overflow-hidden transition-colors duration-300">
        {/* Providers wrap EVERYTHING */}
        <ReduxProvider>
          <ThemeProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

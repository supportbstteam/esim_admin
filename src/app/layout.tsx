import "@/app/globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ClientLayoutWrapper from "@/layouts/ClientLayoutWrapper";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 text-gray-900  dark:text-gray-100 w-screen h-screen overflow-hidden transition-colors duration-300 ${poppins.className}`}>
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

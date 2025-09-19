import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <div className="ssds bg-[#e1e1e1] min-h-screen flex items-center justify-center ">
          <div className="w-full  p-8">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </ReduxProvider>
  );
}

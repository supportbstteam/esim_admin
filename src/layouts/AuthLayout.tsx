import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // <ReduxProvider>
    //   <ThemeProvider>
    //   </ThemeProvider>
    // </ReduxProvider>
    <div className="ssds bg-[#fff] min-h-screen flex items-center justify-center ">
      <div className="w-full  p-8">
        {children}
      </div>
    </div>
  );
}

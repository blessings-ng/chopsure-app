import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; // <-- Add this

export const metadata = {
  title: "ChopSure | Secure Your Food Budget",
  description: "Automate your feeding and lock your budget.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning> 
      {/* FIXED: Removed bg-slate-50 and dark:bg-[#050505] */}
      <body className="text-slate-900 dark:text-white selection:bg-[#FF6B00] selection:text-white transition-colors duration-500 bg-transparent">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </body>
    </html>
  );

}
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { DesignerProvider } from "@/components/context/designer-context";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "WabForms",
  description: "Form builder",
};

const thicccboi = localFont({
  src: [
    {
      path: "../public/fonts/THICCCBOI-Regular.ttf",
      weight: "400",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={thicccboi.className}>
          <NextTopLoader />
          <DesignerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="page-form-theme"
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </DesignerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

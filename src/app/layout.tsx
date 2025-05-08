import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
    title: "Вступники НУХТ",
    description: "Модуль формування контрактів для вступників НУХТ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk" suppressHydrationWarning>
            <body>
                <SessionProvider>

                <ThemeProvider
                    attribute="class"
                    enableSystem
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}

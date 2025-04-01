import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback="Завантаження...">
                    {children}
            </Suspense>

    );
}

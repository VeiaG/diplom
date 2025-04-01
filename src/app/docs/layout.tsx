import type React from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <SidebarProvider>
                <DocsSidebar />
                <SidebarInset>
                    <div className="container max-w-4xl py-8 md:py-10 mx-auto">
                        <div className="prose max-w-none dark:prose-invert">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}

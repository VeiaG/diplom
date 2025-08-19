import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="fixed text-sm font-mono z-[999] right-0 bottom-0 px-1 py-0.5 bg-background">
        {
          process.env.NEXT_PUBLIC_RELEASE_TAG || "unknown"
        }
      </div>
      <div className='container mx-auto '>
        {children}
      </div>
        
    </SidebarProvider>
  )
}

import { AppSidebar } from '../AppSidebar'
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full">
        <AppSidebar />
        <main className="flex-1 p-4">
          <p>Content area - sidebar navigation active</p>
        </main>
      </div>
    </SidebarProvider>
  )
}
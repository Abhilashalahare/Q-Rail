import { Factory, FileText, QrCode } from "lucide-react"
import { useLocation } from "wouter"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const vendorMenuItems = [
  {
    title: "Dashboard",
    url: "/vendor",
    icon: Factory,
  },
  {
    title: "Manufacturing Records",
    url: "/vendor/records",
    icon: FileText,
  },
]

export function VendorSidebar() {
  const [location] = useLocation()

  return (
    <Sidebar data-testid="sidebar-vendor">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
            <Factory className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">Vendor Portal</p>
            <p className="text-xs text-muted-foreground">Railway QR System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vendor Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {vendorMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={location === item.url}>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default VendorSidebar
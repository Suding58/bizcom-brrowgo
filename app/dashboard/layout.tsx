"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { menuItems as initialMenuItems } from "@/config/list-menu"; // Import the menu items
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentPath = usePathname(); // Get the current path
  const [isOpen, setIsOpen] = useState(false); // State สำหรับควบคุมการเปิด/ปิดของ Sheet
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const toggleSheet = () => {
    setIsOpen((prev) => !prev); // สลับสถานะ
  };

  const closeSheet = () => {
    setIsOpen(false); // ปิด Sheet
  };

  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        const resp = await axios.get("/api/notifications");
        const result = resp.data;
        const { borrowCount, returnCount } = result.data;

        setMenuItems((prevItems) =>
          prevItems.map((item) => {
            if (item.href === "/borrowing") {
              return { ...item, notifications: borrowCount };
            }
            if (item.href === "/returning") {
              return { ...item, notifications: returnCount };
            }
            return item;
          })
        );
      } catch (error) {
        console.error("Error fetching notification counts:", error);
      }
    };

    fetchNotificationCounts();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image
              src="/logo/bizcom-logo.jpg"
              alt="Bizcom Logo"
              width={32}
              height={32}
              className="h-full transition-all group-hover:scale-110"
            />
            <span className="sr-only">Bizcom</span>
          </Link>
          <TooltipProvider>
            {menuItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard${item.href}`}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                      currentPath === `/dashboard${item.href}`
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.srLabel}</span>
                    {item.notifications > 0 && (
                      <Badge
                        className="absolute top-0 right-0 left-3 flex h-4 w-4 items-center justify-center rounded-full text-xs"
                        variant="destructive"
                      >
                        {item.notifications}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="sm:hidden"
                onClick={toggleSheet}
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                  onClick={closeSheet} // ปิดเมนูเมื่อคลิก
                >
                  <Image
                    src="/logo/bizcom-logo.jpg" // Path to the image in the public folder
                    alt="Bizcom Logo"
                    width={32} // Set the width of the image
                    height={32} // Set the height of the image
                    className="h-full w-full transition-all group-hover:scale-110" // Class for styling
                  />
                  <span className="sr-only">Bizcom</span>
                </Link>
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={`/dashboard${item.href}`}
                    className={`flex items-center gap-4 px-2.5 ${
                      currentPath === `/dashboard${item.href}`
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={closeSheet} // ปิดเมนูเมื่อคลิก
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          {/* <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/logo/bizcom-logo.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>ADMIN</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>ตั้งค่า</DropdownMenuItem>
              <DropdownMenuItem>ช่วยเหลือ</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

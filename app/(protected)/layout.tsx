import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ AUTH CHECK
  const session: any = await auth();

  // if (!session || !session.user || !session.user.email) {
  //     redirect("/");
  // }

  return (
    <SidebarProvider>
      {/* <AppSidebar user={session.user} /> */}

      <AppSidebar
        user={
          session?.user ?? {
            name: "Demo User",
            email: "demo@example.com",
            image: "",
            role: "ADMIN",
          }
        }
      />
      <SidebarInset>
        {/* ✅ TOP HEADER */}
        <div className="sticky top-0 z-50 bg-white">
          <SiteHeader />
        </div>

        {/* ✅ MAIN CONTENT */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

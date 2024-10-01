import Sidebar from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <Sidebar />
      {/* RIGHT */}
      <div className="w-full overflow-y-scroll flex flex-col px-4 py-6 md:px-10 md:py-8 ">
        {children}
      </div>
    </div>
  );
}

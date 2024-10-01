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
      <div className="w-full overflow-y-scroll flex flex-col items-center px-4 py-6 md:px-10 md:py-8">
        <div className="max-w-[1060px] pb-12 sm:pb-0">{children}</div>
      </div>
    </div>
  );
}

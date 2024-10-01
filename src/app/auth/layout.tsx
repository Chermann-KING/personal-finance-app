import Illustration from "@/ui/IllustrationAuth";

export default function SingnISingOutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-beige-100">
      {/* LEFT */}
      <Illustration />
      {/* RIGHT */}
      <main className="w-full overflow-y-scroll flex flex-col justify-center px-4 py-6 md:px-10 md:py-8">
        {children}
      </main>
    </div>
  );
}

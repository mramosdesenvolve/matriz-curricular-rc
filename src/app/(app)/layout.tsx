import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/shell/Header";
import { ShellNav } from "@/components/shell/ShellNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />
      <Suspense fallback={null}>
        <ShellNav perfil={session.user.perfil} />
      </Suspense>
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-7 pb-16 pt-6">{children}</main>
    </div>
  );
}

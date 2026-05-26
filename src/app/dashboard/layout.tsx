import { auth } from "@/auth";
import { DashboardSessionProvider } from "./session-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <DashboardSessionProvider
      user={{
        name: session?.user?.name ?? null,
        email: session?.user?.email ?? null,
        image: session?.user?.image ?? null,
      }}
    >
      {children}
    </DashboardSessionProvider>
  );
}
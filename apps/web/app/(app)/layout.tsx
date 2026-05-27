import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ROUTES } from "@/lib/constants";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect(ROUTES.signIn);
  return <>{children}</>;
}

import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/UserButton";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}
function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl py-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={200} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandaloneLayout;

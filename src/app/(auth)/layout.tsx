"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { children: React.ReactNode };

function Layout({ children }: Props) {
  const pathname = usePathname();

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" alt="logo" width={200} height={56} />
          <Button variant="secondary" asChild>
            <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
              {pathname === "/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}

export default Layout;

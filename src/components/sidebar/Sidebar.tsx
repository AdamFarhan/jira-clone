import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DottedSeparator } from "../dotted-separator";
import { SidebarNavigation } from "./SidebarNavigation";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { ProjectList } from "../projects/ProjectList";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={200} height={56} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <SidebarNavigation />
      <DottedSeparator className="my-4" />
      <ProjectList />
    </aside>
  );
};

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api/useJoinWorkspace";
import { useInviteCode } from "../hooks/useInviteCode";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { WorkspaceAvatar } from "./WorkspaceAvatar";

interface Props {
  initialValues: {
    name: string;
    imageUrl?: string;
  };
}

export const JoinWorkspaceForm = ({ initialValues }: Props) => {
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();

  const onJoin = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7 flex gap-4 flex-row">
        <WorkspaceAvatar
          image={initialValues.imageUrl}
          name={initialValues.name}
          className="size-[72px]"
        />
        <span>
          <CardTitle className="text-xl font-bold">
            Join {initialValues.name}
          </CardTitle>
          <CardDescription>
            You&apos;ve been invited to join{" "}
            <strong>{initialValues.name}</strong>
          </CardDescription>
        </span>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="secondary"
            type="button"
            size="lg"
            asChild
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size="lg"
            type="button"
            onClick={onJoin}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

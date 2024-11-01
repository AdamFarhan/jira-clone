"use client";
import { Fragment } from "react";
import { ArrowLeft, MoreVertical, UserX } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { MemberAvatar } from "@/features/members/components/MemberAvatar";
import { Separator } from "@/components/ui/separator";
import { useDeleteMember } from "@/features/members/api/useDeleteMember";
import { useUpdateMember } from "@/features/members/api/useUpdateMember";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/useConfirm";

import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { Workspace } from "../types";
import { useGetWorkspaces } from "../api/useGetWorkspaces";

type Props = {
  workspace: Workspace;
};
export const MembersList = ({ workspace }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Remove Member",
    message: "This member will be removed from the workspace",
    variant: "destructive",
  });

  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      param: { memberId },
      json: { role },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const isPending = isUpdating || isDeleting;
  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">
          {workspace.name} Members
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium capitalize">
                  {member.name} - {member.role.toLowerCase()}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVertical className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  {member.role === MemberRole.MEMBER && (
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.ADMIN)
                      }
                      disabled={isPending}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                  )}
                  {member.role === MemberRole.ADMIN && (
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.MEMBER)
                      }
                      disabled={isPending}
                    >
                      Set as Member
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-medium text-amber-700 capitalize"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isPending}
                  >
                    <UserX />
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-4" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

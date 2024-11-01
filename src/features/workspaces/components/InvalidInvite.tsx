"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const InvalidInvite = () => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7 flex gap-4 flex-row">
        <span>
          <CardTitle className="text-xl font-bold">
            Invalid invite code
          </CardTitle>
          <CardDescription>
            The code you are trying to provide does not match the invite code of
            the workspace you're trying to join.
          </CardDescription>
        </span>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-end gap-2">
          <Button className="w-full lg:w-fit" type="button" size="lg" asChild>
            <Link href="/">
              <ArrowLeft />
              Go Back
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

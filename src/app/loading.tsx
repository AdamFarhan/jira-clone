"use client";
import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPage;

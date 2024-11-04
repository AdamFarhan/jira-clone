"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "./CreateProjectForm";
import { useCreateProjectModal } from "../hooks/useCreateProjectModal";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};

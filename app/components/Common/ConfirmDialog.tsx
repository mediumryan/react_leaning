// shadcn/ui
import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
// icons
import { Ban, Info, TriangleAlert } from "lucide-react";

interface CommonAlertProps {
  buttonLabel?: React.ReactNode;
  triggerVariant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  triggerDisabled?: boolean;
  title?: string;
  titleWithIcon?: "default" | "info" | "warning" | "error";
  description?: string;
  cancleButtonLabel?: string;
  confirmButtonLabel?: string;
  onConfirm?: () => void;
}

export function CommonAlert({
  buttonLabel = "",
  triggerVariant = "default",
  triggerDisabled = false,
  title = "",
  titleWithIcon = "default",
  description = "",
  cancleButtonLabel = "Cancel",
  confirmButtonLabel = "Continue",
  onConfirm,
  triggerSize = "default",
}: CommonAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          disabled={triggerDisabled}
          size={triggerSize}
        >
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {titleWithIcon === "info" ? (
              <Info className="inline mr-2 mb-1 text-blue-500" />
            ) : titleWithIcon === "warning" ? (
              <TriangleAlert className="inline mr-2 mb-1 text-yellow-500" />
            ) : titleWithIcon === "error" ? (
              <Ban className="inline mr-2 mb-1 text-red-500" />
            ) : null}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancleButtonLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm ?? onConfirm}>
            {confirmButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

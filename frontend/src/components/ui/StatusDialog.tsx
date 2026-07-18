import React from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

type Status = "success" | "error" | "warning";

export interface StatusDialogProps {
  open: boolean;
  onClose: () => void;
  status: Status;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const config: Record<Status, { Icon: typeof CheckCircle2; color: string; ring: string }> = {
  success: { Icon: CheckCircle2, color: "text-success", ring: "bg-success/15" },
  error: { Icon: XCircle, color: "text-error", ring: "bg-error/15" },
  warning: { Icon: AlertTriangle, color: "text-warning", ring: "bg-warning/15" },
};

/**
 * Success / Error / Warning confirmation dialog built on Modal.
 */
const StatusDialog: React.FC<StatusDialogProps> = ({
  open,
  onClose,
  status,
  title,
  message,
  actionLabel = "Got it",
  onAction,
}) => {
  const { Icon, color, ring } = config[status];
  return (
    <Modal open={open} onClose={onClose} size="sm" hideClose>
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${ring}`}>
          <Icon className={`h-9 w-9 ${color}`} />
        </div>
        <h3 className="font-heading text-xl font-bold text-white">{title}</h3>
        {message && <p className="mt-2 text-sm text-cpm-muted">{message}</p>}
        <Button
          className="mt-6"
          fullWidth
          variant={status === "error" ? "danger" : "primary"}
          onClick={() => {
            onAction?.();
            onClose();
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default StatusDialog;

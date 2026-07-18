import React from "react";
import { Bell } from "lucide-react";
import { cn } from "../../lib/cn";

export interface NotificationBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  icon?: React.ReactNode;
  /** Pulse the indicator dot */
  pulse?: boolean;
}

/**
 * Icon button with an unread count badge (caps at 99+).
 */
const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  icon,
  pulse = true,
  className,
  ...props
}) => {
  const display = count > 99 ? "99+" : String(count);
  return (
    <button
      className={cn(
        "relative rounded-lg border border-cpm-border bg-white/5 p-2 text-cpm-muted transition-colors hover:border-gold hover:text-gold",
        className
      )}
      aria-label={count > 0 ? `${count} notifications` : "Notifications"}
      {...props}
    >
      {icon ?? <Bell className="h-5 w-5" />}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-cinemaRed px-1 text-[10px] font-bold text-white">
          {display}
        </span>
      )}
      {count > 0 && pulse && (
        <span className="absolute -right-1 -top-1 h-[18px] w-[18px] animate-ping rounded-full bg-cinemaRed/60" />
      )}
    </button>
  );
};

export default NotificationBadge;

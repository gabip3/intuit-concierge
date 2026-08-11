/**
 * Phosphor Icons "call-bell" (Regular weight, viewBox 0 0 256 256) — MIT.
 * https://phosphor-icons.com
 *
 * The AHC concierge bell. `variant="gradient"` renders the brand ahcGreen
 * gradient (teal #26C4D8 → green #6FC94D); `variant="current"` inherits
 * text color like a Lucide icon.
 */

const PHOSPHOR_CALL_BELL_PATH =
  "M24,184H232a8,8,0,0,0,0-16h-8V152a96.12,96.12,0,0,0-88-95.66V40h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V56.34A96.12,96.12,0,0,0,32,152v16H24a8,8,0,0,0,0,16Zm24-32a80,80,0,0,1,160,0v16H48Zm192,56a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H232A8,8,0,0,1,240,208Z";

interface CallBellIconProps {
  className?: string;
  variant?: "gradient" | "current";
  /** Unique id suffix when several gradient bells render on one page. */
  gradientId?: string;
}

export function CallBellIcon({
  className,
  variant = "gradient",
  gradientId = "ahcGreen-bell",
}: CallBellIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#26C4D8" />
            <stop offset="100%" stopColor="#6FC94D" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={variant === "gradient" ? `url(#${gradientId})` : "currentColor"}
        d={PHOSPHOR_CALL_BELL_PATH}
      />
    </svg>
  );
}

export { PHOSPHOR_CALL_BELL_PATH };

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-display font-semibold tracking-wide transition-all duration-200 ease-[var(--ease-instrument)] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-mineral-400 text-carbon-950 shadow-[0_0_0_1px_rgba(138,245,198,0.4),0_10px_30px_-10px_rgba(34,201,138,0.7)] hover:bg-mineral-300 hover:shadow-[0_0_0_1px_rgba(189,251,224,0.6),0_14px_40px_-10px_rgba(34,201,138,0.85)]",
  secondary:
    "bg-granite-800 text-chalk-50 ring-1 ring-inset ring-granite-600/70 hover:bg-granite-700 hover:ring-granite-500",
  outline:
    "bg-transparent text-mineral-300 ring-1 ring-inset ring-mineral-500/50 hover:bg-mineral-500/10 hover:ring-mineral-400",
  ghost: "bg-transparent text-granite-200 hover:bg-granite-800/70 hover:text-chalk-50",
  danger:
    "bg-jasper-500/10 text-jasper-300 ring-1 ring-inset ring-jasper-500/40 hover:bg-jasper-500/20 hover:ring-jasper-400",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-lg px-3.5 text-[13px]",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-13 rounded-xl px-6 text-[15px]",
  xl: "h-16 rounded-2xl px-8 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
};

export function Button({
  variant,
  size,
  className,
  icon,
  trailingIcon,
  loading,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {trailingIcon}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function ButtonLink({ variant, size, className, icon, trailingIcon, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {icon}
      {children}
      {trailingIcon}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
    />
  );
}

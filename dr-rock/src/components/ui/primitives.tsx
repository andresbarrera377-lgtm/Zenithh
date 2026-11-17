import type { ComponentProps, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("panel relative", className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono flex items-center gap-2 text-mineral-400", className)}>
      <span className="h-px w-5 bg-mineral-500/60" aria-hidden />
      {children}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl space-y-3">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-chalk-50 md:text-4xl">{title}</h1>
        {description && <p className="text-[15px] leading-relaxed text-granite-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

type Tone = "mineral" | "ochre" | "jasper" | "azurite" | "granite";

const toneClasses: Record<Tone, string> = {
  mineral: "bg-mineral-500/12 text-mineral-300 ring-mineral-500/35",
  ochre: "bg-ochre-500/12 text-ochre-300 ring-ochre-500/35",
  jasper: "bg-jasper-500/12 text-jasper-300 ring-jasper-500/35",
  azurite: "bg-azurite-500/12 text-azurite-300 ring-azurite-500/35",
  granite: "bg-granite-700/50 text-granite-200 ring-granite-500/40",
};

export function Badge({
  tone = "granite",
  children,
  className,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

const noticeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const noticeTone = {
  info: "border-azurite-500/30 bg-azurite-500/[0.07] text-azurite-300",
  success: "border-mineral-500/30 bg-mineral-500/[0.07] text-mineral-300",
  warning: "border-ochre-500/30 bg-ochre-500/[0.07] text-ochre-300",
  error: "border-jasper-500/35 bg-jasper-500/[0.08] text-jasper-300",
};

export function Notice({
  kind = "info",
  title,
  children,
  className,
  action,
}: {
  kind?: keyof typeof noticeIcons;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  const Icon = noticeIcons[kind];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-2xl border p-4 text-sm", noticeTone[kind], className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-semibold text-chalk-50">{title}</p>}
        {children && <div className="leading-relaxed text-granite-200">{children}</div>}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-granite-600/60 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-granite-800 text-mineral-400 ring-1 ring-granite-600/60">
          {icon}
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-chalk-50">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-granite-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function KeyValue({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <dt className="label-mono text-granite-400">{label}</dt>
      <dd className="text-[15px] leading-snug text-chalk-100">{value}</dd>
    </div>
  );
}

export function Meter({
  value,
  tone = "mineral",
  className,
  label,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  label?: string;
}) {
  const fill: Record<Tone, string> = {
    mineral: "from-mineral-600 to-mineral-300",
    ochre: "from-ochre-500 to-ochre-300",
    jasper: "from-jasper-500 to-jasper-300",
    azurite: "from-azurite-500 to-azurite-300",
    granite: "from-granite-500 to-granite-300",
  };
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-granite-800", className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-700", fill[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export type { Tone };

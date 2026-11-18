"use client";

import { Camera, ChevronDown, ImageUp, Lightbulb, Microscope, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { useAiStatus } from "@/components/app-shell/AiStatus";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Notice, Panel } from "@/components/ui/primitives";
import { ACCEPTED_IMAGE_INPUT, ImageProcessingError, processImageFile, type ProcessedImage } from "@/lib/image/process-image";
import { useScanSession } from "@/lib/scan/session";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { CameraCapture, isLiveCameraSupported } from "./CameraCapture";

export function ScanPanel() {
  const router = useRouter();
  const session = useScanSession();
  const aiStatus = useAiStatus();
  const uploadRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const t = useMessages("scan");
  const common = useMessages("common");

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const processed = await processImageFile(file);
      session.setImage(processed);
    } catch (e) {
      setError(e instanceof ImageProcessingError ? t.imageErrors[e.code] : t.imageError);
    } finally {
      setProcessing(false);
    }
  }

  function handleCaptured(image: ProcessedImage) {
    setCameraOpen(false);
    setError(null);
    session.setImage(image);
  }

  function takePhoto() {
    setError(null);
    if (isLiveCameraSupported()) setCameraOpen(true);
    else nativeCameraRef.current?.click();
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function analyze() {
    session.startAnalysis();
    router.push("/app/analysis");
  }

  const hasImage = Boolean(session.image && session.imageUrl);

  return (
    <div className="space-y-6">
      {/* Hidden inputs: gallery/file picker and native camera capture (mobile fallback). */}
      <input
        ref={uploadRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={nativeCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          setCameraOpen(false);
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {session.status === "analyzing" && (
        <Notice
          kind="info"
          title={t.inProgressTitle}
          action={
            <ButtonLink href="/app/analysis" size="sm">
              {t.viewProgress}
            </ButtonLink>
          }
        >
          {t.inProgressText}
        </Notice>
      )}
      {session.status === "done" && session.result && (
        <Notice
          kind="success"
          title={t.readyTitle}
          action={
            <ButtonLink href="/app/results" size="sm">
              {t.viewResults}
            </ButtonLink>
          }
        >
          {session.result.analysis.identification.rockName}
          {session.savedId ? t.savedSuffix : t.notSavedSuffix}
        </Notice>
      )}
      {aiStatus === "not-configured" && (
        <Notice kind="error" title={t.notConfiguredTitle}>
          {t.notConfiguredText}
        </Notice>
      )}
      {aiStatus === "offline" && (
        <Notice kind="warning" title={t.offlineTitle}>
          {t.offlineText}
        </Notice>
      )}
      {error && <Notice kind="error" title={t.imageProblem}>{error}</Notice>}

      {!hasImage ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] border border-dashed p-4 transition-colors sm:p-6",
            dragging ? "border-mineral-400 bg-mineral-500/5" : "border-granite-600/70",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-fade" aria-hidden />
          <div className="relative grid gap-4 sm:grid-cols-2">
            <CaptureTile
              icon={<Camera className="h-7 w-7" />}
              title={t.takePhoto}
              description={t.takePhotoText}
              onClick={takePhoto}
              primary
              disabled={processing}
            />
            <CaptureTile
              icon={<ImageUp className="h-7 w-7" />}
              title={t.upload}
              description={t.uploadText}
              onClick={() => uploadRef.current?.click()}
              disabled={processing}
            />
          </div>
          <p className="relative mt-5 text-center text-xs text-granite-400">
            {processing ? t.preparing : t.formats}
          </p>
        </div>
      ) : (
        <SpecimenPreview
          imageUrl={session.imageUrl!}
          image={session.image!}
          onRetake={takePhoto}
          onReplace={() => uploadRef.current?.click()}
          onClear={session.clearImage}
          processing={processing}
        />
      )}

      {hasImage && (
        <>
          <FieldContextForm />
          <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom)+var(--host-badge-h))] z-30 -mx-4 bg-gradient-to-t from-carbon-950 via-carbon-950/95 to-transparent px-4 pb-3 pt-8 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:bg-none lg:p-0">
            <Button
              size="xl"
              className="w-full"
              onClick={analyze}
              disabled={aiStatus === "not-configured" || aiStatus === "offline" || session.status === "analyzing"}
              icon={<Microscope className="h-5 w-5" />}
            >
              {session.status === "analyzing" ? t.analyzing : session.status === "done" ? t.analyzeAgain : t.analyze}
            </Button>
          </div>
        </>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2 text-chalk-50">
            <Lightbulb className="h-4 w-4 text-ochre-400" />
            <h2 className="font-display text-sm font-semibold">{t.tipsTitle}</h2>
          </div>
          <ul className="space-y-2 text-sm text-granite-300">
            {t.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mineral-400" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2 text-chalk-50">
            <ShieldCheck className="h-4 w-4 text-mineral-400" />
            <h2 className="font-display text-sm font-semibold">{t.privacyTitle}</h2>
          </div>
          <p className="text-sm leading-relaxed text-granite-300">
            {t.privacyText} {common.disclaimer}
          </p>
        </Panel>
      </div>

      {cameraOpen && (
        <CameraCapture
          onCapture={handleCaptured}
          onClose={() => setCameraOpen(false)}
          onUseNativeCamera={() => nativeCameraRef.current?.click()}
        />
      )}
    </div>
  );
}

function CaptureTile({
  icon,
  title,
  description,
  onClick,
  primary,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 text-left ring-1 ring-inset transition-all duration-300 disabled:opacity-50 sm:min-h-56 sm:flex-col sm:items-start sm:justify-between sm:gap-6 sm:p-6",
        primary
          ? "bg-gradient-to-br from-mineral-500/20 via-mineral-600/10 to-transparent ring-mineral-500/40 hover:ring-mineral-400"
          : "bg-granite-900/80 ring-granite-600/60 hover:ring-granite-400",
      )}
    >
      <span
        className={cn(
          "grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
          primary ? "bg-mineral-400 text-carbon-950" : "bg-granite-700 text-chalk-50",
        )}
      >
        {icon}
      </span>
      <span className="space-y-1.5">
        <span className="block font-display text-lg font-semibold uppercase tracking-wide text-chalk-50 sm:text-xl">{title}</span>
        <span className="block text-sm text-granite-300">{description}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500",
          primary ? "bg-mineral-400/20 group-hover:opacity-100" : "bg-granite-400/10",
        )}
      />
    </button>
  );
}

function SpecimenPreview({
  imageUrl,
  image,
  onRetake,
  onReplace,
  onClear,
  processing,
}: {
  imageUrl: string;
  image: ProcessedImage;
  onRetake: () => void;
  onReplace: () => void;
  onClear: () => void;
  processing: boolean;
}) {
  const t = useMessages("scan");
  return (
    <Panel className="overflow-hidden p-0">
      <div className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="relative aspect-[4/3] bg-carbon-900">
          <Image src={imageUrl} alt={t.selected} fill unoptimized className="object-contain" sizes="(min-width: 768px) 60vw, 100vw" />
          <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-mineral-400/30" aria-hidden />
          <span className="label-mono absolute left-4 top-4 rounded-full bg-carbon-950/70 px-3 py-1 text-mineral-300 backdrop-blur">
            {t.ready}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-6 p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-mineral-300">
              <Sparkles className="h-4 w-4" />
              <p className="font-display font-semibold">{t.prepared}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <dt className="text-granite-400">{t.resolution}</dt>
                <dd className="mt-1 text-chalk-100">
                  {image.width} × {image.height}
                </dd>
              </div>
              <div>
                <dt className="text-granite-400">{t.size}</dt>
                <dd className="mt-1 text-chalk-100">{Math.round(image.blob.size / 1024)} KB</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-granite-400">{t.metadata}</dt>
                <dd className="mt-1 text-chalk-100">{t.metadataRemoved}</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={onRetake} disabled={processing} icon={<Camera className="h-4 w-4" />}>
              {t.retake}
            </Button>
            <Button variant="secondary" size="sm" onClick={onReplace} disabled={processing} icon={<ImageUp className="h-4 w-4" />}>
              {t.replace}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear} disabled={processing} icon={<RotateCcw className="h-4 w-4" />}>
              {t.startOver}
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function FieldContextForm() {
  const { context, setContext } = useScanSession();
  const filled = Object.values(context).some((v) => v && v.trim());
  const t = useMessages("scan");
  return (
    <details className="group panel overflow-hidden" open={filled || undefined}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
        <div>
          <p className="font-display font-semibold text-chalk-50">{t.notesTitle} <span className="font-normal text-granite-400">{t.optional}</span></p>
          <p className="mt-0.5 text-sm text-granite-400">{t.notesText}</p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-granite-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid gap-4 border-t hairline p-5 sm:grid-cols-2">
        <Field
          label={t.whereFound}
          placeholder={t.wherePlaceholder}
          maxLength={120}
          value={context.location ?? ""}
          onChange={(location) => setContext({ ...context, location })}
        />
        <Field
          label={t.approxSize}
          placeholder={t.sizePlaceholder}
          maxLength={60}
          value={context.size ?? ""}
          onChange={(size) => setContext({ ...context, size })}
        />
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-granite-200">{t.observations}</span>
          <textarea
            rows={3}
            maxLength={500}
            value={context.notes ?? ""}
            onChange={(e) => setContext({ ...context, notes: e.target.value })}
            placeholder={t.observationsPlaceholder}
            className="w-full resize-none rounded-xl border-0 bg-carbon-900 px-4 py-3 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:ring-2 focus:ring-mineral-400 focus:outline-none"
          />
        </label>
      </div>
    </details>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-granite-200">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-11 w-full rounded-xl border-0 bg-carbon-900 px-4 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:ring-2 focus:ring-mineral-400 focus:outline-none"
      />
    </label>
  );
}

"use client";

import {
  Camera,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Gauge,
  ImageUp,
  Lightbulb,
  Microscope,
  Plus,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { useAiStatus } from "@/components/app-shell/AiStatus";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Notice, Panel } from "@/components/ui/primitives";
import { MAX_PHOTOS, PHOTO_ROLES, type PhotoRole } from "@/lib/analysis/photos";
import { FIELD_TEST_OPTIONS, type FieldTestKey, type FieldTests } from "@/lib/analysis/schema";
import { ACCEPTED_IMAGE_INPUT, ImageProcessingError, processImageFile, type ProcessedImage } from "@/lib/image/process-image";
import { useMessages } from "@/lib/i18n/client";
import { assessPrecision, countTests } from "@/lib/scan/precision";
import { buildUpload, useScanSession, type ScanPhoto } from "@/lib/scan/session";
import { cn } from "@/lib/utils";
import { CameraCapture, isLiveCameraSupported } from "./CameraCapture";

export function ScanPanel() {
  const router = useRouter();
  const session = useScanSession();
  const aiStatus = useAiStatus();
  const uploadRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  /** Slot the next picked file goes to (null = fill free slots in order). */
  const pickRoleRef = useRef<PhotoRole | null>(null);
  const [camera, setCamera] = useState<{ role: PhotoRole; sequence: boolean } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const t = useMessages("scan");
  const c = useMessages("capture");
  const common = useMessages("common");

  const freeRoles = PHOTO_ROLES.filter((r) => !session.photos.some((p) => p.role === r));

  async function handleFiles(list: FileList | File[] | null | undefined, role: PhotoRole | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    setError(null);
    setProcessing(true);
    try {
      // A specific slot takes one file; otherwise fill the free slots in order.
      const take = role ? files.slice(0, 1) : files.slice(0, Math.max(1, freeRoles.length));
      for (const [i, file] of take.entries()) {
        const processed = await processImageFile(file);
        session.addPhoto(processed, role ?? freeRoles[i]);
      }
    } catch (e) {
      setError(e instanceof ImageProcessingError ? t.imageErrors[e.code] : t.imageError);
    } finally {
      setProcessing(false);
    }
  }

  function openPicker(role: PhotoRole | null) {
    pickRoleRef.current = role;
    uploadRef.current?.click();
  }

  /** Opens the camera for one slot, or for every free slot in turn (sequence). */
  function openCamera(role: PhotoRole | null) {
    setError(null);
    const target = role ?? freeRoles[0] ?? "overview";
    if (isLiveCameraSupported()) setCamera({ role: target, sequence: role === null });
    else {
      pickRoleRef.current = target;
      nativeCameraRef.current?.click();
    }
  }

  function handleCaptured(image: ProcessedImage) {
    if (!camera) return;
    setError(null);
    session.addPhoto(image, camera.role);
    const remaining = freeRoles.filter((r) => r !== camera.role);
    if (camera.sequence && remaining.length > 0) setCamera({ role: remaining[0], sequence: true });
    else setCamera(null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files, null);
  }

  function analyze() {
    session.startAnalysis();
    router.push("/app/analysis");
  }

  const hasPhotos = session.photos.length > 0;
  const uploadCount = buildUpload(session.photos).length;

  return (
    <div className="space-y-6">
      {/* Hidden inputs: gallery/file picker (several files allowed) and native camera capture. */}
      <input
        ref={uploadRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          handleFiles(e.target.files, pickRoleRef.current);
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
          setCamera(null);
          handleFiles(e.target.files, pickRoleRef.current);
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

      {!hasPhotos ? (
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
              onClick={() => openCamera(null)}
              primary
              disabled={processing}
            />
            <CaptureTile
              icon={<ImageUp className="h-7 w-7" />}
              title={t.upload}
              description={t.uploadText}
              onClick={() => openPicker(null)}
              disabled={processing}
            />
          </div>
          <p className="relative mt-5 text-center text-xs text-granite-400">{processing ? t.preparing : t.formats}</p>
        </div>
      ) : (
        <PhotoSlots
          photos={session.photos}
          processing={processing}
          onCamera={openCamera}
          onGallery={openPicker}
          onRemove={session.removePhoto}
          onClear={session.clearImage}
        />
      )}

      {hasPhotos && (
        <>
          <PrecisionMeter />
          <FieldTestsForm />
          <FieldNotesForm />
          <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom)+var(--host-badge-h))] z-30 -mx-4 bg-gradient-to-t from-carbon-950 via-carbon-950/95 to-transparent px-4 pb-3 pt-8 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:bg-none lg:p-0">
            <Button
              size="xl"
              className="w-full"
              onClick={analyze}
              disabled={aiStatus === "not-configured" || aiStatus === "offline" || session.status === "analyzing" || processing}
              icon={<Microscope className="h-5 w-5" />}
            >
              {session.status === "analyzing"
                ? t.analyzing
                : session.status === "done"
                  ? t.analyzeAgain
                  : c.analyzeCount(session.photos.length)}
            </Button>
            <p className="mt-2 text-center text-xs text-granite-400">{c.timeNote}</p>
            {uploadCount > session.photos.length && <p className="mt-1 text-center text-[11px] text-granite-500">{c.autoDetail}</p>}
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

      {camera && (
        <CameraCapture
          shot={{
            index: session.photos.length + 1,
            max: MAX_PHOTOS,
            title: c.slots[camera.role].title,
            hint: c.slots[camera.role].hint,
          }}
          canFinish={session.photos.length > 0}
          onCapture={handleCaptured}
          onClose={() => setCamera(null)}
          onUseNativeCamera={() => {
            pickRoleRef.current = camera.role;
            nativeCameraRef.current?.click();
          }}
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
  icon: ReactNode;
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

const QUALITY_TONE = {
  good: "bg-mineral-400/90 text-carbon-950",
  fair: "bg-ochre-400/90 text-carbon-950",
  poor: "bg-jasper-500/90 text-chalk-50",
} as const;

function PhotoSlots({
  photos,
  processing,
  onCamera,
  onGallery,
  onRemove,
  onClear,
}: {
  photos: ScanPhoto[];
  processing: boolean;
  onCamera: (role: PhotoRole | null) => void;
  onGallery: (role: PhotoRole | null) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const c = useMessages("capture");
  const t = useMessages("scan");
  const warnings = photos.flatMap((p) => p.image.quality.warnings.map((w) => ({ role: p.role, warning: w })));

  return (
    <Panel className="space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold text-chalk-50">{c.photosTitle}</h2>
          <p className="mt-0.5 text-sm text-granite-400">{c.photosText}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={processing} icon={<RotateCcw className="h-4 w-4" />}>
          {t.startOver}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {PHOTO_ROLES.map((role) => {
          const photo = photos.find((p) => p.role === role);
          const slot = c.slots[role];
          if (!photo) {
            return (
              <div
                key={role}
                className="flex aspect-[3/4] flex-col justify-between rounded-2xl border border-dashed border-granite-600/80 bg-carbon-900/50 p-2.5 sm:aspect-[4/3] sm:p-3"
              >
                <div>
                  <p className="flex items-center gap-1 text-xs font-semibold text-chalk-100 sm:text-sm">
                    <Plus className="h-3.5 w-3.5 text-mineral-400" /> {slot.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-granite-400 sm:text-xs">{slot.hint}</p>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onCamera(role)}
                    disabled={processing}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-mineral-400 text-xs font-semibold text-carbon-950 disabled:opacity-50"
                  >
                    <Camera className="h-3.5 w-3.5" /> {c.camera}
                  </button>
                  <button
                    type="button"
                    onClick={() => onGallery(role)}
                    disabled={processing}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-granite-800 text-xs font-medium text-chalk-100 ring-1 ring-inset ring-granite-600/70 disabled:opacity-50"
                  >
                    <ImageUp className="h-3.5 w-3.5" /> {c.gallery}
                  </button>
                </div>
              </div>
            );
          }
          return (
            <figure key={role} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-carbon-900 ring-1 ring-granite-700 sm:aspect-[4/3]">
              <Image src={photo.url} alt={c.photoAlt(slot.title)} fill unoptimized className="object-cover" sizes="(min-width: 640px) 30vw, 33vw" />
              <span className={cn("absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold", QUALITY_TONE[photo.image.quality.score])}>
                {c.quality[photo.image.quality.score]}
              </span>
              <button
                type="button"
                onClick={() => onRemove(photo.id)}
                disabled={processing}
                aria-label={`${c.remove}: ${slot.title}`}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-carbon-950/75 text-chalk-50 ring-1 ring-granite-600/60 backdrop-blur"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-950/95 to-transparent p-2 pt-6">
                <p className="text-[11px] font-semibold text-chalk-50 sm:text-xs">{slot.title}</p>
                <p className="font-mono text-[10px] text-granite-400">
                  {photo.image.width}×{photo.image.height}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-1.5 rounded-xl bg-ochre-500/5 p-3 ring-1 ring-ochre-500/25">
          {warnings.map(({ role, warning }) => (
            <li key={`${role}-${warning}`} className="flex gap-2 text-xs leading-relaxed text-granite-200">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre-300" />
              <span>
                <strong className="text-chalk-50">{c.slots[role].title}:</strong> {c.warnings[warning]}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-center gap-1.5 font-mono text-[10px] text-granite-500">
        <ShieldCheck className="h-3 w-3" /> {t.metadata}: {t.metadataRemoved}
      </p>
    </Panel>
  );
}

const LEVEL_STYLE = {
  basic: { bar: "w-1/3 bg-ochre-400", text: "text-ochre-300" },
  good: { bar: "w-2/3 bg-mineral-400", text: "text-mineral-300" },
  great: { bar: "w-full bg-mineral-300", text: "text-mineral-200" },
} as const;

function PrecisionMeter() {
  const { photos, context } = useScanSession();
  const c = useMessages("capture");
  const { level, tips } = assessPrecision({ photos: photos.map((p) => ({ role: p.role, quality: p.image.quality })), context });
  const style = LEVEL_STYLE[level];
  return (
    <Panel className="space-y-3 p-4 sm:p-5" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-display font-semibold text-chalk-50">
          <Gauge className="h-4 w-4 text-mineral-400" /> {c.meter.title}
        </p>
        <span className={cn("font-mono text-sm font-semibold", style.text)}>{c.meter.levels[level]}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-granite-800" role="presentation">
        <div className={cn("h-full rounded-full transition-all duration-500", style.bar)} />
      </div>
      {tips.length > 0 ? (
        <ul className="space-y-1 text-sm text-granite-300">
          {tips.map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <Plus className="h-3.5 w-3.5 shrink-0 text-mineral-400" /> {c.meter.tips[tip]}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-sm text-mineral-200">
          <CheckCircle2 className="h-4 w-4" /> {c.meter.allDone}
        </p>
      )}
    </Panel>
  );
}

const CHOICE_TESTS = Object.keys(FIELD_TEST_OPTIONS) as FieldTestKey[];

function FieldTestsForm() {
  const { context, setContext } = useScanSession();
  const c = useMessages("capture");
  const tests: FieldTests = context.tests ?? {};
  const done = countTests(context);

  function setTest(patch: Partial<FieldTests>) {
    const next = { ...tests, ...patch };
    setContext({ ...context, tests: next });
  }

  return (
    <details className="group panel overflow-hidden" open={done > 0 || undefined}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
        <div>
          <p className="flex flex-wrap items-center gap-x-2 font-display font-semibold text-chalk-50">
            <FlaskConical className="h-4 w-4 text-mineral-400" /> {c.tests.title}
            <span className="whitespace-nowrap font-mono text-xs font-normal text-granite-400">· {c.tests.count(done)}</span>
          </p>
          <p className="mt-0.5 text-sm text-granite-400">{c.tests.subtitle}</p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-granite-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-5 border-t hairline p-5">
        {CHOICE_TESTS.map((key) => {
          const test = c.tests[key];
          const value = tests[key];
          return (
            <fieldset key={key} className="space-y-2">
              <legend className="text-sm font-medium text-chalk-100">{test.label}</legend>
              <p className="text-xs text-granite-400">{test.help}</p>
              <div className="flex flex-wrap gap-2">
                <Choice active={!value} onClick={() => setTest({ [key]: undefined })}>
                  {c.tests.notTested}
                </Choice>
                {FIELD_TEST_OPTIONS[key].map((option) => (
                  <Choice key={option} active={value === option} onClick={() => setTest({ [key]: option })}>
                    {(test.options as Record<string, string>)[option]}
                  </Choice>
                ))}
              </div>
            </fieldset>
          );
        })}
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-chalk-100">{c.tests.streak.label}</span>
          <span className="block text-xs text-granite-400">{c.tests.streak.help}</span>
          <input
            value={tests.streak ?? ""}
            onChange={(e) => setTest({ streak: e.target.value })}
            placeholder={c.tests.streak.placeholder}
            maxLength={40}
            className="h-11 w-full rounded-xl border-0 bg-carbon-900 px-4 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:ring-2 focus:ring-mineral-400 focus:outline-none"
          />
        </label>
        <p className="flex gap-2 text-xs text-granite-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> {c.tests.safety}
        </p>
      </div>
    </details>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-9 rounded-full px-3.5 py-1.5 text-sm ring-1 ring-inset transition-colors",
        active ? "bg-mineral-400 font-semibold text-carbon-950 ring-mineral-300" : "bg-granite-900 text-granite-200 ring-granite-600/70 hover:text-chalk-50",
      )}
    >
      {children}
    </button>
  );
}

function FieldNotesForm() {
  const { context, setContext } = useScanSession();
  const filled = [context.location, context.size, context.notes].some((v) => v && v.trim());
  const t = useMessages("scan");
  return (
    <details className="group panel overflow-hidden" open={filled || undefined}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
        <div>
          <p className="font-display font-semibold text-chalk-50">
            {t.notesTitle} <span className="font-normal text-granite-400">{t.optional}</span>
          </p>
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

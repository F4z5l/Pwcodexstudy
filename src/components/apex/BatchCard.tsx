import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, GraduationCap, Heart, Info } from "lucide-react";

import type { CatalogBatch } from "@/lib/content/catalog.server";

export function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function BatchCard({
  batch,
  favorite,
  onToggleFavorite,
  onInfo,
}: {
  batch: CatalogBatch;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onInfo: (batch: CatalogBatch) => void;
}) {
  const date = formatDate(batch.startDate);

  return (
    <article className="cx-panel group relative overflow-hidden rounded-3xl transition-colors hover:border-primary/60">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
        {batch.photo ? (
          <img
            src={batch.photo}
            alt={batch.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-7 w-7 text-muted-foreground" aria-hidden />
          </div>
        )}

        {batch.exam ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {batch.exam}
          </span>
        ) : null}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => onToggleFavorite(batch.batchId)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:text-destructive"
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-current text-destructive" : ""}`} aria-hidden />
          </button>
          <button
            onClick={() => onInfo(batch)}
            aria-label={`Quick info about ${batch.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:text-primary"
          >
            <Info className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {batch.language ? <Tag>{batch.language}</Tag> : null}
          {batch.className ? <Tag accent>{batch.className}</Tag> : null}
        </div>
        <h3 className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug">
          {batch.name}
        </h3>
        <div className="mt-4 flex items-center gap-2">
          {date ? (
            <span className="flex flex-1 items-center gap-2 truncate rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {date}
            </span>
          ) : (
            <span className="flex-1" />
          )}
          <Link
            to="/batch/$batchId"
            params={{ batchId: batch.batchId }}
            className="cx-brand-gradient flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
          >
            Let&apos;s Study <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Tag({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
        accent
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-secondary text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

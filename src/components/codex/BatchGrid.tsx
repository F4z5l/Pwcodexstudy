import { Link } from "@tanstack/react-router";
import { CalendarDays, LayoutGrid, List } from "lucide-react";
import { useState } from "react";

import { BatchCard, formatDate } from "@/components/apex/BatchCard";
import { Modal } from "@/components/codex/modals";
import { useFavorites } from "@/components/codex/favorites";
import type { CatalogBatch } from "@/lib/content/catalog.server";

export function BatchGrid({
  items,
  view,
  toolbar,
}: {
  items: CatalogBatch[];
  view: "grid" | "list";
  toolbar?: React.ReactNode;
}) {
  const { isFavorite, toggle } = useFavorites();
  const [info, setInfo] = useState<CatalogBatch | null>(null);

  return (
    <>
      {toolbar}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid grid-cols-1 gap-4"
        }
      >
        {items.map((b) => (
          <BatchCard
            key={b.batchId}
            batch={b}
            favorite={isFavorite(b.batchId)}
            onToggleFavorite={toggle}
            onInfo={setInfo}
          />
        ))}
      </div>

      <Modal open={!!info} onClose={() => setInfo(null)} label="Batch details">
        {info ? (
          <>
            {info.photo ? (
              <img
                src={info.photo}
                alt={info.name}
                className="aspect-[16/9] w-full rounded-2xl object-cover"
              />
            ) : null}
            <h2 className="mt-4 font-display text-xl font-bold">{info.name}</h2>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
              {[info.exam, info.className, info.language].filter(Boolean).map((tag) => (
                <span
                  key={tag as string}
                  className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            {formatDate(info.startDate) ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden /> Starts {formatDate(info.startDate)}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <Link
                to="/batch/$batchId"
                params={{ batchId: info.batchId }}
                onClick={() => setInfo(null)}
                className="cx-brand-gradient flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold"
              >
                Start learning
              </Link>
              <button
                onClick={() => toggle(info.batchId)}
                className="rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-semibold"
              >
                {isFavorite(info.batchId) ? "Saved ♥" : "Save"}
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-secondary">
      <button
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={`px-3 py-2 ${view === "grid" ? "cx-brand-gradient" : "text-muted-foreground"}`}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden />
      </button>
      <button
        onClick={() => onChange("list")}
        aria-label="List view"
        className={`px-3 py-2 ${view === "list" ? "cx-brand-gradient" : "text-muted-foreground"}`}
      >
        <List className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

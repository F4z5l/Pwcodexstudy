import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { CardSkeleton, EmptyState, ErrorState } from "@/components/apex/states";
import { BatchGrid, ViewToggle } from "@/components/codex/BatchGrid";
import { useFavorites } from "@/components/codex/favorites";
import { fetchCatalog } from "@/lib/content/catalog.functions";

type HomeSearch = { q?: string | undefined; view?: "favorites" | undefined };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    view: search["view"] === "favorites" ? "favorites" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "PW-MARCO — Free Batches, Lectures & Notes" },
      {
        name: "description",
        content:
          "PW-MARCO: browse thousands of free study batches, save favorites, and stream lectures and notes on any device.",
      },
      { property: "og:title", content: "PW-MARCO — Free Batches, Lectures & Notes" },
      {
        property: "og:description",
        content: "Browse free study batches, save favorites and jump straight into lectures.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { q, view } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [term, setTerm] = useState(q ?? "");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const { favorites } = useFavorites();
  const showFavorites = view === "favorites";

  useEffect(() => setTerm(q ?? ""), [q]);

  const catalog = useServerFn(fetchCatalog);
  const query = useQuery({
    queryKey: ["catalog", q ?? "", 1],
    queryFn: () => catalog({ data: { q: q ?? "", page: 1, pageSize: 24 } }),
    staleTime: 5 * 60 * 1000,
  });

  const favQuery = useQuery({
    queryKey: ["catalog-favorites", favorites],
    queryFn: () => catalog({ data: { ids: favorites, pageSize: 60 } }),
    enabled: showFavorites && favorites.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/", search: { q: term.trim() || undefined, view } });
  }

  const active = showFavorites ? favQuery : query;
  const items = active.data && "items" in active.data ? active.data.items : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4">
      <form onSubmit={submit} className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search batches by name, class…"
          aria-label="Search batches"
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
        />
      </form>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Link
          to="/"
          search={{ q }}
          className={`rounded-2xl px-4 py-3.5 text-center text-sm font-bold ${
            showFavorites ? "border border-border bg-secondary" : "cx-brand-gradient cx-glow"
          }`}
        >
          All Batches
        </Link>
        <Link
          to="/"
          search={{ q, view: "favorites" }}
          className={`rounded-2xl px-4 py-3.5 text-center text-sm font-bold ${
            showFavorites ? "cx-brand-gradient cx-glow" : "border border-border bg-secondary"
          }`}
        >
          ♥ Favorite Batches
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          {showFavorites
            ? `${favorites.length} saved ${favorites.length === 1 ? "batch" : "batches"}`
            : query.data && "total" in query.data
              ? `Showing ${items.length} of ${query.data.total.toLocaleString()} batches`
              : "Loading batches…"}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <ViewToggle view={layout} onChange={setLayout} />
          <Link
            to="/batches"
            search={{ q }}
            className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold"
          >
            Browse all
          </Link>
        </div>
      </div>

      <div className="mt-4">
        {showFavorites && favorites.length === 0 ? (
          <EmptyState message="No favorite batches yet — tap the heart on any batch to save it." />
        ) : active.isPending ? (
          <CardSkeleton count={6} />
        ) : active.isError ? (
          <ErrorState message="Couldn't load batches." onRetry={() => void active.refetch()} />
        ) : active.data && "error" in active.data && active.data.error ? (
          <ErrorState message={active.data.error as string} />
        ) : items.length === 0 ? (
          <EmptyState message="No batches matched your search." />
        ) : (
          <BatchGrid items={items} view={layout} />
        )}
      </div>
    </div>
  );
}

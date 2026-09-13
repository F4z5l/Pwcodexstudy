import { Link } from "@tanstack/react-router";
import { Download, Heart, Home, Menu, Palette, Search, Send, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LOGO_URL, TELEGRAM_URL } from "@/components/apex/branding";
import { CommunityModal, InstallModal, ThemeModal, useInstallPrompt } from "@/components/codex/modals";
import { useTheme } from "@/components/codex/theme";

const COMMUNITY_SEEN = "marco-community-seen";
const INSTALL_SEEN = "marco-install-seen";

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

export function CodexHeader() {
  const { theme, setTheme } = useTheme();
  const { deferred, installed } = useInstallPrompt();
  const [community, setCommunity] = useState(false);
  const [install, setInstall] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Community popup first, install popup right after it closes.
  useEffect(() => {
    if (sessionStorage.getItem(COMMUNITY_SEEN) === "1") return;
    const t = setTimeout(() => {
      sessionStorage.setItem(COMMUNITY_SEEN, "1");
      setCommunity(true);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  function closeCommunity() {
    setCommunity(false);
    if (installed || sessionStorage.getItem(INSTALL_SEEN) === "1") return;
    sessionStorage.setItem(INSTALL_SEEN, "1");
    setTimeout(() => setInstall(true), 700);
  }

  return (
    <>
      <header className="cx-panel sticky top-0 z-40 w-full">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-3 py-2.5 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="PW-MARCO"
              className="h-10 w-10 shrink-0 rounded-full border border-border bg-secondary object-contain p-1"
              width={40}
              height={40}
            />
            <span className="truncate font-display text-lg font-extrabold tracking-tight">
              PW <span className="text-primary">MARCO</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              to="/batches"
              aria-label="Search batches"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <Search className="h-4 w-4" aria-hidden />
            </Link>
            <IconButton label="Change theme" onClick={() => setThemeOpen(true)}>
              <Palette className="h-4 w-4" aria-hidden />
            </IconButton>
            <Link
              to="/"
              search={{ view: "favorites" }}
              aria-label="Favorite batches"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary transition-colors hover:border-primary hover:text-primary sm:flex"
            >
              <Heart className="h-4 w-4" aria-hidden />
            </Link>
            <IconButton label="Menu" onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
            </IconButton>
          </div>
        </div>

        {menuOpen ? (
          <nav className="mx-auto grid w-full max-w-6xl gap-1.5 px-3 pb-3 sm:px-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold"
            >
              Home
            </Link>
            <Link
              to="/batches"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold"
            >
              All Batches
            </Link>
            <Link
              to="/"
              search={{ view: "favorites" }}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold"
            >
              Favorite Batches
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                setCommunity(true);
              }}
              className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-left text-sm font-semibold"
            >
              Important Links
            </button>
          </nav>
        ) : null}
      </header>

      <div className="mx-auto mt-3 grid w-full max-w-6xl grid-cols-2 gap-2.5 px-3 sm:px-4">
        <Link
          to="/"
          className="cx-brand-gradient cx-glow flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold"
        >
          <Home className="h-4 w-4" aria-hidden /> Home
        </Link>
        <button
          onClick={() => setInstall(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm font-bold"
        >
          <Download className="h-4 w-4" aria-hidden /> Install App
        </button>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm font-bold text-primary"
        >
          <Send className="h-4 w-4" aria-hidden /> Join Telegram
        </a>
        <button
          onClick={() => setCommunity(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm font-bold"
        >
          <Heart className="h-4 w-4" aria-hidden /> Important Links
        </button>
      </div>

      <CommunityModal open={community} onClose={closeCommunity} />
      <InstallModal open={install} onClose={() => setInstall(false)} deferred={deferred} />
      <ThemeModal
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </>
  );
}

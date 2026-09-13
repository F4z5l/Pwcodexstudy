import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Download, Send, Share2, X } from "lucide-react";

import { LOGO_URL, TELEGRAM_URL } from "@/components/apex/branding";
import { THEMES, type ThemeId } from "@/components/codex/theme";

/* ------------------------------------------------------------- shell */

export function Modal({
  open,
  onClose,
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("cx-modal-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("cx-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="cx-panel relative max-h-[86vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-xl border border-border bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {children}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- community */

export function CommunityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <Modal open={open} onClose={onClose} label="Community links">
      <div className="flex items-center gap-3">
        <img
          src={LOGO_URL}
          alt="PW-MARCO"
          className="h-12 w-12 rounded-full border border-border bg-secondary object-contain p-1"
          width={48}
          height={48}
        />
        <div>
          <p className="font-display text-lg font-bold leading-tight">PW-MARCO 🚀</p>
          <p className="text-xs text-muted-foreground">Official Announcements</p>
        </div>
      </div>
      <h2 className="mt-5 text-center font-display text-xl font-bold">Important Links</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Access the community, batches and updates from one place.
      </p>
      <div className="mt-5 space-y-2.5">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cx-brand-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold"
        >
          <Send className="h-4 w-4" aria-hidden /> Telegram Channel
        </a>
        <button
          onClick={copyLink}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3.5 text-sm font-bold"
        >
          {copied ? (
            <Check className="h-4 w-4 text-mint" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Link copied" : "Copy Site Link"}
        </button>
        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title: "PW-MARCO", url: window.location.origin });
              } catch {
                /* cancelled */
              }
            } else {
              void copyLink();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground"
        >
          <Share2 className="h-4 w-4" aria-hidden /> Share with friends
        </button>
      </div>
    </Modal>
  );
}

/* ----------------------------------------------------------- install */

type InstallEvent = Event & { prompt: () => Promise<void> };

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return { deferred, installed };
}

export function InstallModal({
  open,
  onClose,
  deferred,
}: {
  open: boolean;
  onClose: () => void;
  deferred: InstallEvent | null;
}) {
  const [iosHint, setIosHint] = useState(false);

  async function install() {
    if (deferred) {
      await deferred.prompt();
      onClose();
    } else {
      setIosHint(true);
    }
  }

  return (
    <Modal open={open} onClose={onClose} label="Install PW-MARCO">
      <img
        src={LOGO_URL}
        alt="PW-MARCO"
        className="h-14 w-14 rounded-full border border-border bg-secondary object-contain p-1"
        width={56}
        height={56}
      />
      <h2 className="mt-4 font-display text-2xl font-bold">Install PW-MARCO 📲</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add PW-MARCO to your home screen for a faster, app-like experience.
      </p>
      <button
        onClick={install}
        className="cx-brand-gradient cx-glow mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold"
      >
        <Download className="h-4 w-4" aria-hidden /> Install App
      </button>
      {iosHint ? (
        <p className="mt-3 rounded-2xl border border-border bg-secondary p-3 text-xs text-muted-foreground">
          On iPhone/iPad: tap the browser menu, then choose “Add to Home Screen”. On desktop
          Chrome, use the install icon in the address bar.
        </p>
      ) : null}
      <button
        onClick={onClose}
        className="mt-2 w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground"
      >
        Maybe later
      </button>
    </Modal>
  );
}

/* ------------------------------------------------------------- theme */

export function ThemeModal({
  open,
  onClose,
  theme,
  setTheme,
}: {
  open: boolean;
  onClose: () => void;
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} label="Select theme mode">
      <h2 className="font-display text-2xl font-bold">Select Theme Mode</h2>
      <p className="mt-1 text-sm text-muted-foreground">Apna vibe chuno — instantly applies.</p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`relative rounded-2xl border p-3 text-left transition-colors ${
              theme === t.id
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary hover:border-primary/50"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-lg">
              {t.emoji}
            </span>
            <span className="mt-2 block text-sm font-semibold">{t.label}</span>
            {theme === t.id ? (
              <Check className="absolute right-3 top-3 h-4 w-4 text-primary" aria-hidden />
            ) : null}
          </button>
        ))}
      </div>
    </Modal>
  );
}

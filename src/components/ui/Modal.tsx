"use client";

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`my-8 w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-[var(--radius)] bg-branco`}
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {subtitle && <div className="mt-1 text-xs text-ink-soft">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none text-ink-faint hover:text-ink"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

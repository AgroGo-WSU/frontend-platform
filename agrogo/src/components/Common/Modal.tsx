import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="agro-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="agro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="agro-modal-header">
          <h3>{title}</h3>
          <button className="agro-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="agro-modal-body">{children}</div>

        <div className="agro-modal-actions">
          {secondaryLabel && (
            <button className="agro-btn outline" type="button" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button className="agro-btn solid" type="button" onClick={onPrimary}>
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

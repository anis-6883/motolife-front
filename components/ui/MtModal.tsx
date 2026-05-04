"use client";

import { useEffect, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  maxWidth?: number;
  showCloseButton?: boolean;
}

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function Modal({ open, onClose, children, title, description, maxWidth = 520, showCloseButton = true }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const hasHeader = title || description || showCloseButton;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          animation: "modalFadeIn .18s ease",
        }}
      />

      {/* Centering wrapper */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        {/* Dialog */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            animation: "modalSlideUp .22s ease",
            pointerEvents: "all",
            overflow: "hidden",
          }}
        >
          {/* ── Header (optional) ── */}
          {hasHeader && (
            <>
              <div
                style={{ padding: "20px 24px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
              >
                <div style={{ flex: 1 }}>
                  {title && (
                    <h2 id="modal-title" style={{ fontSize: 16, fontWeight: 700, color: "#0f0f0f", margin: 0, letterSpacing: "-0.2px" }}>
                      {title}
                    </h2>
                  )}
                  {description && <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 4, lineHeight: 1.65 }}>{description}</p>}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      padding: 4,
                      flexShrink: 0,
                      borderRadius: 6,
                      lineHeight: 1,
                      transition: "color .15s, background .15s",
                      marginTop: -2,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#111";
                      (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                      (e.currentTarget as HTMLButtonElement).style.background = "none";
                    }}
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              {/* Divider under header */}
              <div style={{ height: 1, background: "#f3f4f6" }} />
            </>
          )}

          {/* ── Body — children render here ── */}
          <div style={{ padding: "20px 24px 24px" }}>{children}</div>
        </div>
      </div>
    </>
  );
}

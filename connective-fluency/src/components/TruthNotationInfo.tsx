import { useEffect, useRef, useState } from "react";
import { Info, X } from "lucide-react";

export function TruthNotationInfo() {
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open && wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <span className="truth-notation-info">
      <button
        ref={triggerRef}
        className="notation-info-button"
        type="button"
        aria-label="About T and F"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Info aria-hidden="true" />
      </button>
      {open && (
        <div className="notation-dialog" role="dialog" aria-label="About T and F">
          <p>In these exercises, T and F stand for the truth values true and false. They are not sentence letters.</p>
          <button ref={closeRef} className="notation-dialog-close" type="button" onClick={() => setOpen(false)}>
            <X aria-hidden="true" /> <span>Close</span>
          </button>
        </div>
      )}
    </span>
  );
}

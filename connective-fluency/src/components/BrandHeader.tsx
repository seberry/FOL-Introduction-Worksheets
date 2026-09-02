import { BarChart3, Home, Settings } from "lucide-react";

interface BrandHeaderProps {
  onHome: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

export function BrandHeader({ onHome, onProgress, onSettings }: BrandHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand-button" type="button" onClick={onHome} aria-label="Connective Fluency home">
        <span className="brand-mark" aria-hidden="true">T∧F</span>
        <span>Connective Fluency</span>
      </button>
      <nav aria-label="Main navigation">
        <button className="icon-button" type="button" onClick={onHome} aria-label="Home" title="Home">
          <Home aria-hidden="true" />
        </button>
        <button className="icon-button" type="button" onClick={onProgress} aria-label="Progress" title="Progress">
          <BarChart3 aria-hidden="true" />
        </button>
        <button className="icon-button" type="button" onClick={onSettings} aria-label="Settings" title="Settings">
          <Settings aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}

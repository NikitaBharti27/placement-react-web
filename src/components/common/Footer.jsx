import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-slate-950/60 text-slate-500 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            <strong className="text-slate-300">PlacePrep Secure</strong> — Free-Tier Optimized Microservice Architecture
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span>Microsoft Entra ID (PKCE)</span>
          <span>•</span>
          <span>Azure Container Apps</span>
          <span>•</span>
          <span>Groq LLaMA 3</span>
          <span>•</span>
          <span>PostgreSQL + MongoDB</span>
        </div>

        <div className="text-slate-500 text-[11px]">
          Engineering Capstone Team • Phase 2
        </div>
      </div>
    </footer>
  );
}

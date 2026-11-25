import { BrandLogo } from './BrandLogo';
import { Badge } from '../ui/Badge';
import { Shield, Terminal } from 'lucide-react';

export function Header({ activeRole }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <BrandLogo size="sm" showSubtitle={false} />

        <div className="hidden md:flex items-center gap-3">
          <Badge variant="primary" dot size="sm">
            OAuth2 + PKCE
          </Badge>
          <Badge variant="neutral" size="sm">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3 h-3 text-cyan-400" />
              Zero-Trust Sandbox
            </span>
          </Badge>
          <Badge variant="neutral" size="sm">
            <span className="flex items-center gap-1 text-slate-300">
              <Terminal className="w-3 h-3 text-indigo-400" />
              Phase 2 Ready
            </span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {activeRole && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Session View
              </span>
              <span className="text-xs font-semibold text-indigo-400">
                {activeRole}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

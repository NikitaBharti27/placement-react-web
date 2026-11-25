import { Button } from '../../../components/ui/Button';
import { Lock } from 'lucide-react';

export function EntraIdButton({
  onClick,
  isLoading = false,
  label = 'Sign in with Microsoft Entra ID',
  subtext = 'Institutional OAuth2 + PKCE SSO',
  className = '',
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <Button
        variant="microsoft"
        size="lg"
        fullWidth
        isLoading={isLoading}
        onClick={onClick}
        leftIcon={
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
        }
        className={className}
      >
        <span className="font-semibold tracking-wide text-sm">{label}</span>
      </Button>

      {subtext && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-1">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>{subtext}</span>
          <span>•</span>
          <span className="text-slate-400">Zero Passwords Stored</span>
        </div>
      )}
    </div>
  );
}

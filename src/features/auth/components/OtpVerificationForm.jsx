import { useState } from 'react';
import { OtpInput } from '../../../components/ui/OtpInput';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { useOtpTimer } from '../hooks/useOtpTimer';
import { ArrowLeft, Mail, RefreshCw, ShieldCheck } from 'lucide-react';

export function OtpVerificationForm({
  studentId,
  tenantName,
  onVerify,
  onBack,
  onResend,
  isLoading = false,
}) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { secondsLeft, canResend, resetTimer } = useOtpTimer(60);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    setError('');
    onVerify(otp);
  };

  const handleResend = () => {
    if (!canResend) return;
    setError('');
    resetTimer();
    if (onResend) onResend();
  };

  const handleAutoFillDemo = () => {
    setOtp('123456');
    setError('');
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change ID / College</span>
        </button>

        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
          Step 2 of 2
        </span>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          Verify One-Time Passcode
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          We sent a 6-digit verification code to the registered email for{' '}
          <strong className="text-indigo-300 font-mono">{studentId}</strong>
          {tenantName && <span> at {tenantName}</span>}.
        </p>
      </div>

      <Alert variant="info" className="py-2.5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs">
            Passwordless zero-trust authentication. Check your college inbox or spam folder.
          </span>
        </div>
      </Alert>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300">
              6-Digit Secure Passcode
            </label>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer"
            >
              Demo Auto-Fill (123456)
            </button>
          </div>

          <OtpInput
            length={6}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (error) setError('');
            }}
            onComplete={(val) => {
              setOtp(val);
              onVerify(val);
            }}
            error={Boolean(error)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
        >
          Verify & Enter Platform
        </Button>
      </form>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <span>Didn't receive the passcode?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="inline-flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? '' : 'hover:rotate-180 transition-transform'}`} />
          {canResend ? 'Resend Passcode' : `Resend in ${secondsLeft}s`}
        </button>
      </div>
    </div>
  );
}

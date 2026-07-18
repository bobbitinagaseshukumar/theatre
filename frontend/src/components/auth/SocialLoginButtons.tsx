import React from "react";
import toast from "react-hot-toast";

export interface SocialLoginButtonsProps {
  onGoogle?: () => void;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.4 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
    />
  </svg>
);

/**
 * Social sign-in buttons. Google is primary; Apple/Facebook are marked future.
 */
const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onGoogle }) => {
  const notReady = (name: string) => () => toast(`${name} login is coming soon.`, { icon: "🔒" });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-cpm text-cpm-muted">or continue with</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onGoogle ?? notReady("Google")}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-gold/40"
        >
          <GoogleIcon /> Google
        </button>
        <button
          type="button"
          onClick={notReady("Apple")}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-gold/40"
        >
           Apple
        </button>
        <button
          type="button"
          onClick={notReady("Facebook")}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-gold/40"
        >
          <span className="font-bold text-[#1877F2]">f</span> Facebook
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;

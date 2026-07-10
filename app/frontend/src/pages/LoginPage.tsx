import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FlaskConical } from 'lucide-react';
import { appRoutes } from '../components/WorkspaceShell';

const GoogleLogo = () => (
  <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
    <path
      d="M21.805 12.227c0-.764-.068-1.497-.195-2.197H12v4.158h5.49a4.697 4.697 0 0 1-2.037 3.084v2.561h3.3c1.931-1.779 3.052-4.402 3.052-7.606Z"
      fill="#4285F4"
    />
    <path
      d="M12 22c2.754 0 5.062-.912 6.75-2.467l-3.3-2.561c-.913.612-2.08.975-3.45.975-2.649 0-4.893-1.789-5.694-4.192H2.894v2.642A9.999 9.999 0 0 0 12 22Z"
      fill="#34A853"
    />
    <path
      d="M6.306 13.755A5.996 5.996 0 0 1 5.988 12c0-.609.105-1.201.318-1.755V7.603H2.894A9.999 9.999 0 0 0 2 12c0 1.61.385 3.135 1.066 4.397l3.24-2.642Z"
      fill="#FBBC05"
    />
    <path
      d="M12 6.053c1.498 0 2.844.515 3.904 1.526l2.928-2.928C17.058 2.999 14.75 2 12 2a9.999 9.999 0 0 0-9.106 5.603l3.412 2.642C7.107 7.842 9.351 6.053 12 6.053Z"
      fill="#EA4335"
    />
  </svg>
);

const GithubLogo = () => (
  <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-ml-ink" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(appRoutes.home);
  };

  const handleSocialLogin = () => {
    navigate(appRoutes.home);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans text-ml-ink selection:bg-ml-blue-soft selection:text-ml-blue-strong">
      {/* Left Panel: Brand & Teaser (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-ml-blue to-ml-blue-strong text-white relative overflow-hidden">
        {/* Dotted Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

        {/* Top Branding Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg p-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <FlaskConical size={22} strokeWidth={2.4} />
            </span>
            <span className="font-black text-xl tracking-tight leading-none text-white">
              MARKET<span className="text-white/70">LAB</span>
            </span>
          </Link>
        </div>

        {/* Middle Teaser Content */}
        <div className="relative z-10 max-w-lg my-auto pr-6">
          <span className="text-[10px] font-black tracking-[0.25em] text-ml-blue-soft/80 uppercase block mb-3">
            TRÍ TUỆ NGHIÊN CỨU PERSONA
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-[1.3] text-white">
            Đừng đoán khách hàng nghĩ gì. Hãy kiểm thử trước với persona dựa trên nghiên cứu.
          </h1>
          <span className="text-sm font-bold text-ml-blue-soft/75 mt-4 block">
            — Cách các đội dùng Market Lab
          </span>

          {/* Glassmorphic Persona Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 mt-10 shadow-lg max-w-md flex items-center gap-4 animate-in fade-in duration-300">
            <div className="h-11 w-11 rounded-full bg-emerald-400/20 text-emerald-300 font-extrabold flex items-center justify-center border border-emerald-400/10 shrink-0 text-sm">
              MA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-white truncate">Maya tiết kiệm</div>
              <div className="text-[9px] font-black text-emerald-300 uppercase tracking-wider mt-0.5">
                DO AI TẠO • TIN CẬY 84%
              </div>
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/20 overflow-hidden relative">
                <div className="h-full rounded-full bg-emerald-400 w-[84%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs font-semibold text-ml-blue-soft/60 flex items-center gap-6">
          <span>© 2026 Market Lab</span>
          <Link to="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <Link to="/" className="hover:text-white transition-colors">
            Quyền riêng tư
          </Link>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="flex flex-col justify-center items-center bg-white p-8 md:p-16 relative overflow-hidden">
        {/* Subtle grey dotted grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,34,41,0.04)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />

        <div className="w-full max-w-md relative z-10">
          {/* Back to Home Link for Mobile */}
          <div className="mb-8 md:hidden">
            <Link to="/" className="flex items-center gap-2 text-xs font-bold text-ml-ink-muted hover:text-ml-ink">
              ← Quay lại Trang chủ
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-ml-ink tracking-tight">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-sm font-medium text-ml-ink-muted">
              Đăng nhập để tiếp tục nghiên cứu.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSocialLogin}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ml-border bg-white text-sm font-bold text-ml-ink shadow-xs transition-all hover:border-ml-blue/40 hover:bg-ml-surface cursor-pointer"
            >
              <GoogleLogo />
              Tiếp tục với Google
            </button>

            <button
              type="button"
              onClick={handleSocialLogin}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ml-border bg-white text-sm font-bold text-ml-ink shadow-xs transition-all hover:border-ml-blue/40 hover:bg-ml-surface cursor-pointer"
            >
              <GithubLogo />
              Tiếp tục với GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-ml-border/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ml-ink-muted">Hoặc</span>
            <span className="h-px flex-1 bg-ml-border/60" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-ml-ink">
                Email công việc
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-ml-border bg-white px-4 text-sm font-medium text-ml-ink outline-hidden transition focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="login-password" className="block text-xs font-bold text-ml-ink">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={handleSocialLogin}
                  className="text-xs font-bold text-ml-blue hover:text-ml-blue-strong"
                >
                  Quên?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-11 w-full rounded-xl border border-ml-border bg-white px-4 text-sm font-medium text-ml-ink outline-hidden transition focus:border-ml-blue focus:ring-2 focus:ring-ml-blue/20"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2.5 text-xs font-medium text-ml-ink cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4.5 w-4.5 rounded border-ml-border accent-ml-blue cursor-pointer"
                />
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-xl bg-ml-blue text-sm font-extrabold text-white shadow-xs transition-all hover:bg-ml-blue-strong cursor-pointer"
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-medium text-ml-ink-muted">
            Mới biết Market Lab?{' '}
            <button
              type="button"
              onClick={handleSocialLogin}
              className="font-bold text-ml-blue hover:text-ml-blue-strong cursor-pointer"
            >
              Tạo tài khoản
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

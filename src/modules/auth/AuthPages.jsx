import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldAlert, ShieldCheck, CheckCircle2, Timer } from "lucide-react";
import { Button, Input, PasswordInput, Alert, Card } from "../../components/ui/index.jsx";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "../../hooks/useToast.jsx";

/* ============ LOGIN ============ */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("admin@nova.com");
  const [password, setPassword] = useState("Admin@123");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [banner, setBanner] = useState(null);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (locked) return;
    if (!validate()) return;
    setLoading(true);
    setBanner(null);
    setTimeout(() => {
      setLoading(false);
      // Mock success for admin@nova.com / Admin@123
      if (email === "admin@nova.com" && password === "Admin@123") {
        login();
        toast.success("Logged in — sending OTP to your email");
        navigate("/otp");
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 3) {
          setLocked(true);
          setBanner({ type: "danger", title: "Account locked", msg: "Too many failed attempts. Your account has been temporarily locked for 15 minutes." });
          navigate("/account-locked");
        } else {
          setBanner({ type: "danger", title: "Invalid credentials", msg: `The email or password is incorrect. ${3 - next} attempt(s) remaining.` });
        }
      }
    }, 900);
  };

  return (
    <Card padded={false} className="p-8">
      <h2 className="text-2xl font-bold text-main">Welcome back</h2>
      <p className="text-sm text-muted mt-1">Sign in to your admin account</p>

      {banner && (
        <div className="mt-4">
          <Alert variant={banner.type} title={banner.title}>{banner.msg}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} disabled={locked} className="w-full">
          Sign in
        </Button>
        <div className="text-center text-xs text-muted">
          Demo credentials: <code>admin@nova.com</code> / <code>Admin@123</code>
        </div>
      </form>
    </Card>
  );
}

/* ============ OTP ============ */
export function OtpPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const inputs = Array.from({ length: 6 }, () => useRef(null));
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [expiry, setExpiry] = useState(600); // 10 min
  const [status, setStatus] = useState({ type: null, msg: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setExpiry((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const setDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs[i + 1].current?.focus();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setStatus({ type: "danger", msg: "Please enter the complete 6-digit OTP." });
      return;
    }
    if (expiry <= 0) {
      setStatus({ type: "danger", msg: "OTP has expired. Please request a new one." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === "123456") {
        setStatus({ type: "success", msg: "OTP verified successfully!" });
        toast.success("Verified! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 700);
      } else {
        setStatus({ type: "danger", msg: "Invalid OTP. (Hint: 123456)" });
      }
    }, 700);
  };

  const resend = () => {
    setCountdown(30);
    setExpiry(600);
    setStatus({ type: "info", msg: "A new OTP has been sent to your email." });
    toast.info("OTP re-sent");
  };

  const min = Math.floor(expiry / 60);
  const sec = expiry % 60;

  return (
    <Card padded={false} className="p-8">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary-soft)" }}>
        <ShieldCheck size={22} className="text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-main mt-4">Verify your email</h2>
      <p className="text-sm text-muted mt-1">We've sent a 6-digit code to your inbox.</p>

      {status.msg && (
        <div className="mt-4">
          <Alert variant={status.type}>{status.msg}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="flex gap-2 justify-between">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputs[i]}
              value={d}
              onChange={(e) => setDigit(i, e.target.value.slice(-1))}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) inputs[i - 1].current?.focus();
              }}
              maxLength={1}
              inputMode="numeric"
              className="w-11 h-12 md:w-12 md:h-14 text-center text-lg font-semibold border border-app rounded-lg bg-card text-main focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "var(--color-primary)" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted flex items-center gap-1">
            <Timer size={12} /> Expires in {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={resend}
            disabled={countdown > 0}
            className="text-primary hover:underline disabled:text-muted disabled:no-underline disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>

        <Button type="submit" loading={loading} className="w-full">Verify</Button>
      </form>
    </Card>
  );
}

/* ============ ACCOUNT LOCKED ============ */
export function AccountLockedPage() {
  const [remaining, setRemaining] = useState(15 * 60);
  useEffect(() => {
    const t = setInterval(() => setRemaining((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  return (
    <Card padded={false} className="p-8 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(220,38,38,.1)" }}>
        <ShieldAlert size={28} style={{ color: "var(--color-danger)" }} />
      </div>
      <h2 className="text-2xl font-bold text-main mt-4">Account Locked</h2>
      <p className="text-sm text-muted mt-2">
        Your account has been locked due to 3 failed login attempts. Please try
        again after the lock period, or contact your administrator.
      </p>
      <div className="mt-6 p-4 bg-app rounded-lg" style={{ background: "var(--color-bg)" }}>
        <div className="text-xs text-muted">Time remaining</div>
        <div className="text-3xl font-bold text-main mt-1 tabular-nums">
          {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
        </div>
      </div>
      <Link to="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
        Back to login
      </Link>
    </Card>
  );
}

/* ============ FIRST LOGIN ============ */
export function FirstLoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checks = {
    length: next.length >= 8,
    upper: /[A-Z]/.test(next),
    lower: /[a-z]/.test(next),
    digit: /\d/.test(next),
    special: /[^A-Za-z0-9]/.test(next),
    match: next && next === confirm,
  };
  const allValid = Object.values(checks).every(Boolean);

  const onSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!current) err.current = "Enter your temporary password";
    if (!allValid) err.next = "Password does not meet all requirements";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Password updated");
      setTimeout(() => navigate("/dashboard"), 1200);
    }, 900);
  };

  return (
    <Card padded={false} className="p-8">
      <h2 className="text-2xl font-bold text-main">Set a new password</h2>
      <p className="text-sm text-muted mt-1">First-time login requires you to change your password.</p>

      {success && (
        <div className="mt-4">
          <Alert variant="success" title="Password updated">Redirecting to dashboard…</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <PasswordInput label="Current / Temporary Password" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current} required />
        <PasswordInput label="New Password" value={next} onChange={(e) => setNext(e.target.value)} error={errors.next} required />
        <PasswordInput label="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

        <div className="bg-app p-3 rounded-lg text-xs space-y-1" style={{ background: "var(--color-bg)" }}>
          <RequirementRow ok={checks.length}>At least 8 characters</RequirementRow>
          <RequirementRow ok={checks.upper}>One uppercase letter</RequirementRow>
          <RequirementRow ok={checks.lower}>One lowercase letter</RequirementRow>
          <RequirementRow ok={checks.digit}>One number</RequirementRow>
          <RequirementRow ok={checks.special}>One special character</RequirementRow>
          <RequirementRow ok={checks.match}>Passwords match</RequirementRow>
        </div>

        <Button type="submit" loading={loading} disabled={!allValid || !current} className="w-full">
          Change password
        </Button>
      </form>
    </Card>
  );
}

function RequirementRow({ ok, children }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 size={14} style={{ color: ok ? "var(--color-success)" : "var(--color-text-muted)" }} />
      <span style={{ color: ok ? "var(--color-success)" : "var(--color-text-muted)" }}>{children}</span>
    </div>
  );
}

/* ============ FORGOT PASSWORD ============ */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Card padded={false} className="p-8">
      <h2 className="text-2xl font-bold text-main">Forgot password?</h2>
      <p className="text-sm text-muted mt-1">Enter your email and we'll send you a reset link.</p>
      {sent ? (
        <div className="mt-6">
          <Alert variant="success" title="Check your inbox">
            If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
          </Alert>
          <Link to="/login" className="block text-center mt-4 text-sm text-primary hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="mt-6 space-y-4"
        >
          <Input label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">Send reset link</Button>
          <Link to="/login" className="block text-center text-sm text-primary hover:underline">Back to login</Link>
        </form>
      )}
    </Card>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, Loader2, Package, CheckCircle2 } from "lucide-react";
import { register, login } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { useLang } from "../context/LangContext";

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { t } = useLang();

  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError(t.register.errorPasswordMatch); return; }
    if (form.password.length < 6) { setError(t.register.errorPasswordLength); return; }
    setLoading(true);
    setError(null);
    try {
      await register({ email: form.email, password: form.password });
      const data = await login({ email: form.email, password: form.password });
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      const user = { id: payload.sub, email: payload.email, role: payload.role };
      setAuth(user, data.access_token);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t.register.errorDefault;
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", t.register.strengthWeak, t.register.strengthFair, t.register.strengthGood, t.register.strengthStrong][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-slate-900/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
              <Package size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{t.register.title}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {t.register.subtitle}{" "}
              <span className="text-indigo-400 font-medium">devmarket</span>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
            >
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">{t.register.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder={t.register.emailPlaceholder} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">{t.register.password}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder={t.register.passwordPlaceholder} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthColor : "bg-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.register.strengthLabel}{" "}
                    <span className={`font-medium ${strength >= 3 ? "text-emerald-400" : strength === 2 ? "text-yellow-400" : "text-red-400"}`}>
                      {strengthLabel}
                    </span>
                  </p>
                </motion.div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">{t.register.confirmPassword}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder={t.register.confirmPlaceholder} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                />
                {form.confirmPassword && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle2 size={15} className="text-emerald-400" />
                      : <AlertCircle size={15} className="text-red-400" />}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 text-sm shadow-lg shadow-indigo-500/20 transition-colors mt-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" />{t.register.submitting}</> : t.register.submit}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t.register.hasAccount}{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              {t.register.loginLink}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-600/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

          <div className="hidden lg:flex relative flex-col justify-center p-12 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent">

            <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full" />
            <div className="absolute bottom-16 left-10 w-32 h-32 border border-blue-400/10 rounded-full" />

            <div className="relative">

              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/40">
                  A
                </div>

                <span className="text-white text-xl font-semibold">
                  Account Manager
                </span>

              </div>

              <h2 className="text-4xl font-bold text-white leading-tight">
                Create your
                <span className="block text-blue-400">
                  account today.
                </span>
              </h2>

              <p className="mt-5 text-slate-400 leading-relaxed max-w-md">
                Create your account and start managing your accounts,
                balances and transactions securely.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    ✓
                  </span>
                  Secure account management
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    ✓
                  </span>
                  Easy transaction tracking
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    ✓
                  </span>
                  Fast and simple access
                </div>

              </div>

            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-10">

            <div className="flex justify-center lg:hidden mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-110 hover:rotate-3">
                A
              </div>
            </div>

            <div className="mb-7">

              <p className="text-blue-600 text-sm font-semibold mb-2">
                ACCOUNT MANAGEMENT
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Create account
              </h1>

              <p className="mt-2 text-slate-500">
                Register to start using your account
              </p>

            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all duration-300 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all duration-300 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full px-4 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all duration-300 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all duration-300 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>

                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 disabled:opacity-70"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <span>→</span>
                  </span>
                )}

              </button>

            </form>

            <div className="flex items-center gap-3 my-6">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-xs text-slate-400">
                ALREADY HAVE AN ACCOUNT?
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
            >
              Back to Login
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Register;
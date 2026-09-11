import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      console.log("Login successful:", data);

      // Redirect according to role
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center px-4 py-8 overflow-x-hidden">

      {/* Background decoration */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed -bottom-32 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-5xl min-w-0 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

        {/* Left Section */}
        <div className="hidden lg:flex min-w-0 flex-col justify-center p-10 xl:p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20">

          {/* Logo */}
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-500/30">
            A
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-4 break-words">
            Account Management
          </h1>

          <p className="text-slate-300 leading-relaxed max-w-md">
            Manage your account, transactions and profile securely from one
            place.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <p>✓ Secure JWT authentication</p>
            <p>✓ Easy account management</p>
            <p>✓ Secure transactions</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="min-w-0 w-full p-7 sm:p-10 lg:p-12">

          <h2 className="text-3xl font-bold mb-2">
            Welcome back
          </h2>

          <p className="text-slate-400 mb-8">
            Login to your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-5 w-full p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm break-words">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="w-full">
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition text-white placeholder:text-slate-500"
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <div className="relative w-full">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full min-w-0 px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition text-white placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
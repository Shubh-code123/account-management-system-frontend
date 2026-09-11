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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://account-management-system-2.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      console.log("Login successful:", data);

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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">

        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-500/30">
            A
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Account Management
          </h1>

          <p className="text-slate-300 leading-relaxed">
            Manage your account, transactions and profile securely from one
            place.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <p>✓ Secure JWT authentication</p>
            <p>✓ Easy account management</p>
            <p>✓ Secure transactions</p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>

          <p className="text-slate-400 mb-8">
            Login to your account
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
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
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
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
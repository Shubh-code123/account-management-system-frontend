import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    initialDeposit: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
  });

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
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/account/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account creation failed");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 rounded-xl bg-[#191d2b] border border-slate-00 px-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all";

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background - same theme */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#10131f] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden">

        {/* Top Header */}
        <div className="px-7 sm:px-10 pt-8 pb-6 border-b border-white/10">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/25">
              A
            </div>

            <div>
              <p className="text-sm font-medium text-blue-400">
                Account Management
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Create Your Account
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Complete your details to get started.
              </p>
            </div>

          </div>

        </div>

        {/* Form Area */}
        <div className="px-7 sm:px-10 py-8">

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ================= ACCOUNT DETAILS ================= */}
            <section>

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  ₹
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Account Details
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Set your initial account information
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Initial Deposit */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Initial Deposit
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="initialDeposit"
                      value={formData.initialDeposit}
                      onChange={handleChange}
                      min="0"
                      placeholder="0.00"
                      className="w-full h-12 rounded-xl bg-[#191d2b] border border-slate-700 pl-9 pr-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />

                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className={inputClass}
                  />
                </div>

              </div>

            </section>

            {/* ================= PERSONAL INFORMATION ================= */}
            <section>

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  ✦
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Personal Information
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide your basic personal details
                  </p>
                </div>

              </div>

              <div className="max-w-md">

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

              </div>

            </section>

            {/* ================= ADDRESS DETAILS ================= */}
            <section>

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  ⌖
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Address Details
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Add your current residential address
                  </p>
                </div>

              </div>

              {/* Full Address */}
              <div className="mb-5">

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  required
                  className="w-full rounded-xl bg-[#191d2b] border border-slate-700 px-4 py-3 text-base text-white outline-none resize-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />

              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                    className={inputClass}
                  />

                </div>

              </div>

            </section>

            {/* ================= SECURITY ================= */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10">

              <span className="text-blue-400 text-lg">
                🔒
              </span>

              <p className="text-sm text-slate-400">
                Your information is protected and securely stored.
              </p>

            </div>

            {/* ================= BUTTONS ================= */}
            <div className="pt-1">

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full h-12 mt-3 rounded-xl border border-slate-700 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-all"
              >
                ← Back to Dashboard
              </button>

            </div>

          </form>

        </div>

        {/* Footer */}
        <div className="px-7 sm:px-10 py-4 border-t border-white/10 text-center">
          <p className="text-xs text-slate-600">
            Secure connection • Account Management System
          </p>
        </div>

      </div>
    </div>
  );
}

export default CreateAccount;
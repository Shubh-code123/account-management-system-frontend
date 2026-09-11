import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Withdraw() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/account/withdrawMoney",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Withdrawal failed");
      }

      toast.success(
        `₹${Number(amount).toLocaleString("en-IN")} withdrawn successfully!`
      );

      setAmount("");

      setTimeout(() => {
        navigate("/transactions");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-red-400 text-sm font-medium">
              Account Management
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Withdraw Money
            </h1>

            <p className="text-slate-400 mt-2">
              Withdraw money securely from your account.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-white/10 bg-[#10131f] hover:bg-white/5 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Withdraw Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

            <div className="text-4xl mb-4">💸</div>

            <h2 className="text-2xl font-bold">
              Withdraw Money
            </h2>

            <p className="text-slate-400 mt-2 mb-7">
              Enter the amount you want to withdraw.
            </p>

            {/* Success */}
            {message && (
              <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-400">
                ✓ {message}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-5">

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Withdrawal Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full rounded-xl bg-[#0b0f1a] border border-slate-700 pl-9 pr-4 py-3 text-white outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 font-semibold transition"
              >
                {loading ? "Withdrawing..." : "Withdraw Money →"}
              </button>

            </form>

            <p className="text-xs text-slate-500 text-center mt-5">
              Make sure you have sufficient balance before withdrawing.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
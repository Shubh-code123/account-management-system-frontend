import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Deposit() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async (e) => {
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
        "https://account-management-system-2.onrender.com/api/account/deposit",
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
        throw new Error(data.message || "Deposit failed");
      }

      toast.success(
        `₹${Number(amount).toLocaleString("en-IN")} deposited successfully!`
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
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#10131f] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white transition mb-6"
          >
            ← Back to Dashboard
          </button>

          <p className="text-green-400 text-sm font-medium">
            Account Management
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Deposit Money
          </h1>

          <p className="text-slate-400 mt-2 mb-8">
            Add money to your account securely.
          </p>

          {message && (
            <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleDeposit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Deposit Amount
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg bg-[#0b0f1a] border border-slate-700 px-4 py-3 text-white outline-none focus:border-green-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-semibold transition"
            >
              {loading ? "Depositing..." : "Deposit Money"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
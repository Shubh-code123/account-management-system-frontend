import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Transfer() {
  const navigate = useNavigate();

  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!accountNumber || !amount) {
      setError("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
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
        "https://account-management-system-2.onrender.com/api/account/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverAccountNumber: accountNumber,
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transfer failed");
      }

      setMessage(
        `₹${Number(amount).toLocaleString("en-IN")} transferred successfully!`
      );

      setAccountNumber("");
      setAmount("");
    } catch (error) {
      setError(error.message);
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
            <p className="text-blue-400 text-sm font-medium">
              Account Management
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Transfer Money
            </h1>

            <p className="text-slate-400 mt-2">
              Send money securely to another account.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-white/10 bg-[#10131f] hover:bg-white/5 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Transfer Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

            <div className="text-4xl mb-4">
              💸
            </div>

            <h2 className="text-2xl font-bold">
              Send Money
            </h2>

            <p className="text-slate-400 mt-2 mb-7">
              Enter the recipient account number and amount.
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

            <form onSubmit={handleTransfer} className="space-y-5">

              {/* Account Number */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Recipient Account Number
                </label>

                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter 10-digit account number"
                  className="w-full rounded-xl bg-[#0b0f1a] border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Transfer Amount
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
                    className="w-full rounded-xl bg-[#0b0f1a] border border-slate-700 pl-9 pr-4 py-3 text-white outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 font-semibold transition"
              >
                {loading ? "Transferring..." : "Transfer Money →"}
              </button>

            </form>

            <p className="text-xs text-slate-500 text-center mt-5">
              Please verify the recipient account number before transferring.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Transfer;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyAccount() {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const [accountResponse, transactionResponse] = await Promise.all([
          fetch("https://account-management-system-2.onrender.com/api/account/details", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(
            "https://account-management-system-2.onrender.com/api/account/transactions?page=1&limit=5",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        const accountData = await accountResponse.json();
        const transactionData = await transactionResponse.json();

        if (!accountResponse.ok) {
          throw new Error(accountData.message || "Failed to fetch account");
        }

        if (!transactionResponse.ok) {
          throw new Error(
            transactionData.message || "Failed to fetch transactions"
          );
        }

        setAccount(accountData.account);
        setTransactions(transactionData.transactions || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-slate-400">Loading account details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-400 text-sm font-medium">
              Account Management
            </p>

            <h1 className="text-3xl font-bold mt-2">
              My Account
            </h1>

            <p className="text-slate-400 mt-1">
              View your personal and account information.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-white/10 bg-[#10131f] hover:bg-white/5 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Account Number + Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Account Number
            </p>

            <h2 className="text-2xl font-bold mt-2 tracking-wider">
              {account?.accountNumber || "N/A"}
            </h2>
          </div>

          <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Current Balance
            </p>

            <h2 className="text-2xl font-bold mt-2 text-green-400">
              ₹{Number(account?.balance || 0).toLocaleString("en-IN")}
            </h2>
          </div>

        </div>

        {/* Personal Information */}
        <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6 mb-6">

          <h2 className="text-xl font-semibold mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Full Name
              </p>

              <p className="font-medium">
                {account?.userId?.fullName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Email
              </p>

              <p className="font-medium break-all">
                {account?.userId?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Phone Number
              </p>

              <p className="font-medium">
                {account?.phone || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Date of Birth
              </p>

              <p className="font-medium">
                {formatDate(account?.dateOfBirth)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Address
              </p>

              <p className="font-medium">
                {account?.address || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                City
              </p>

              <p className="font-medium">
                {account?.city || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                State
              </p>

              <p className="font-medium">
                {account?.state || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">
                Account Created
              </p>

              <p className="font-medium">
                {formatDate(account?.createdAt)}
              </p>
            </div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#10131f] border border-white/10 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Recent Activity
            </h2>

            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-slate-400">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-3">

              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0f1a] border border-white/5"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {transaction.type}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {transaction.description || "Transaction"}
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>

                  <p
                    className={`font-semibold ${
                      transaction.type === "deposit"
                        ? "text-green-400"
                        : transaction.type === "withdraw"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}
                  >
                    {transaction.type === "deposit" ? "+" : "-"}₹
                    {Number(transaction.amount).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyAccount;
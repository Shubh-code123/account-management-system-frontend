import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch(
          "https://account-management-system-2.onrender.com/api/account/transactions?page=1&limit=20",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch transactions");
        }

        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Transaction Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const getAccountInfo = (transaction) => {
    if (transaction.type !== "transfer") {
      return {
        label: "Account",
        number: "—",
        color: "text-slate-400",
      };
    }

    const currentUserId = transaction.userId?.toString();

    const senderId = transaction.sender?._id?.toString();
    const receiverId = transaction.receiver?._id?.toString();

    if (currentUserId === senderId) {
      return {
        label: "To",
        number: transaction.receiver?.accountNumber || "N/A",
        color: "text-red-400",
      };
    }

    if (currentUserId === receiverId) {
      return {
        label: "From",
        number: transaction.sender?.accountNumber || "N/A",
        color: "text-green-400",
      };
    }

    return {
      label: "Account",
      number: "N/A",
      color: "text-slate-400",
    };
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0b0f1a]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-sm font-medium">
              Account Management
            </p>

            <h1 className="text-2xl font-bold mt-1">Transactions</h1>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-white/5 transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold">Transaction History</h2>

        <p className="text-slate-400 mt-2 mb-8">
          View your recent account transactions.
        </p>

        {/* Transaction Table */}
        <div className="bg-[#10131f] border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-sm text-slate-400">Type</th>

                    <th className="px-6 py-4 text-sm text-slate-400">Amount</th>

                    <th className="px-6 py-4 text-sm text-slate-400">
                      Account
                    </th>

                    <th className="px-6 py-4 text-sm text-slate-400">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => {
                    const accountInfo = getAccountInfo(transaction);

                    return (
                      <tr
                        key={transaction._id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition"
                      >
                        {/* Type */}
                        <td className="px-6 py-4">
                          <span className="capitalize">{transaction.type}</span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 font-semibold">
                          ₹{transaction.amount}
                        </td>

                        {/* Account */}
                        <td className="px-6 py-5">
                          {transaction.type === "transfer"
                            ? transaction.receiverAccount?.accountNumber ||
                              "N/A"
                            : "Self"}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-slate-400">
                          {transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Transactions;

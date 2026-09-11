import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [hasAccount, setHasAccount] = useState(null);

  const [balance, setBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        // =========================
        // GET USER PROFILE
        // =========================
        const profileResponse = await fetch(
          "https://account-management-system-2.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setUser(profileData.user);

        // =========================
        // GET ACCOUNT BALANCE
        // =========================
        const balanceResponse = await fetch(
          "https://account-management-system-2.onrender.com/api/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const balanceData = await balanceResponse.json();
        console.log(balanceData);

        if (!balanceResponse.ok) {
          setHasAccount(false);
          return;
        }

        setHasAccount(true);

        setBalance(Number(balanceData.balance) || 0);

        // =========================
        // GET TRANSACTION HISTORY
        // =========================
        const transactionResponse = await fetch(
          "https://account-management-system-2.onrender.com/api/account/transactions?page=1&limit=100",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const transactionData = await transactionResponse.json();

        if (transactionResponse.ok) {
          const transactions = transactionData.transactions || [];

          setTransactionCount(
            transactionData.totalTransactions || transactions.length,
          );

          let deposits = 0;
          let withdrawals = 0;

          transactions.forEach((transaction) => {
            const amount = Number(transaction.amount) || 0;

            if (transaction.type === "deposit") {
              deposits += amount;
            }

            if (transaction.type === "withdraw") {
              withdrawals += amount;
            }
          });

          setTotalDeposits(deposits);
          setTotalWithdrawals(withdrawals);
        }
      } catch (error) {
        console.log("Dashboard error:", error);
        setHasAccount(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  // =========================
  // LOADING
  // =========================
  if (hasAccount === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Checking your account...</p>
        </div>
      </div>
    );
  }

  // =========================
  // NO ACCOUNT
  // =========================
  if (hasAccount === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-600/20 blur-3xl rounded-full -top-20 -left-20"></div>
        <div className="absolute w-72 h-72 bg-purple-600/20 blur-3xl rounded-full -bottom-20 -right-20"></div>

        <div className="relative w-full max-w-md text-center p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-4xl mb-6">
            💳
          </div>

          <p className="text-blue-400 text-sm mb-2">
            Welcome, {user?.fullName || "User"}
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Create Your Account
          </h1>

          <p className="text-slate-400 leading-relaxed mb-8">
            You don't have an account yet. Create one to start managing your
            money, deposits, withdrawals and transactions.
          </p>

          <button
            onClick={() => navigate("/account/create")}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-600/20"
          >
            Create Account
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="w-full mt-3 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD STATS
  // =========================
  const stats = [
    {
      title: "Account Balance",
      value: `₹${balance.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: "₹",
    },
    {
      title: "Total Deposits",
      value: `₹${totalDeposits.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: "+",
    },
    {
      title: "Total Withdrawals",
      value: `₹${totalWithdrawals.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: "−",
    },
    {
      title: "Transactions",
      value: transactionCount,
      icon: "↗",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">
              A
            </div>

            <div>
              <h1 className="font-bold">Account Manager</h1>
              <p className="text-xs text-slate-400">Secure Banking</p>
            </div>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* WELCOME */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm mb-2">Dashboard</p>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Welcome, {user?.fullName || "User"} 👋
          </h2>

          <p className="text-slate-400 mt-2">
            Manage your account and transactions from here.
          </p>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.07] transition"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-400">{stat.title}</p>

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  {stat.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid lg:grid-cols-3 gap-5 mt-8">
          <Link
            to="/account"
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-5">
              💳
            </div>

            <h3 className="text-xl font-semibold group-hover:text-blue-400 transition">
              My Account
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              View account details and current balance.
            </p>
          </Link>

          <Link
            to="/transactions"
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-5">
              📊
            </div>

            <h3 className="text-xl font-semibold group-hover:text-purple-400 transition">
              Transactions
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              View your deposits, withdrawals and transfers.
            </p>
          </Link>

          <Link
            to="/profile"
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl mb-5">
              👤
            </div>

            <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition">
              My Profile
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              View and update your profile information.
            </p>
          </Link>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10">
          <h3 className="text-xl font-semibold">Quick Actions</h3>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => navigate("/deposit")}
              className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-500 transition font-semibold"
            >
              + Deposit Money
            </button>
            <button
              onClick={() => navigate("/withdraw")}
              className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 font-semibold transition"
            >
              Withdraw Money
            </button>
            {/* TRANSFER MONEY */}
            <Link
              to="/transfer"
              className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition text-sm font-medium"
            >
              💸 Transfer Money
            </Link>

            <Link
              to="/account"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm font-medium"
            >
              Manage Account
            </Link>

            <Link
              to="/transactions"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm font-medium"
            >
              View Transactions
            </Link>

            <Link
              to="/profile"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-sm font-medium"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

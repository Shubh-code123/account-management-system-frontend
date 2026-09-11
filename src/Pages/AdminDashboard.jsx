import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.log("Admin users error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, currentStatus) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://account-management-system-2.onrender.com/api/admin/users/${userId}/change-status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to change status");
    }

    if (currentStatus) {
      toast.success("User deactivated successfully");
    } else {
      toast.success("User reactivated successfully");
    }

    fetchUsers();
  } catch (error) {
    toast.error(error.message);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Manage users and account status
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-xl font-semibold">
              All Users ({users.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              <thead className="bg-slate-800/60">
                <tr className="text-left text-slate-300">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Account No.</th>
                  <th className="px-5 py-4">Balance</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4 font-medium">
                        {user.fullName}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {user.accountNumber || "No Account"}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        ₹{Number(user.balance || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStatusChange(user._id, user.isActive)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            user.isActive
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          
                        >
                          {user.isActive ? "Deactivate" : "Reactivate"}
                          
                          
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;

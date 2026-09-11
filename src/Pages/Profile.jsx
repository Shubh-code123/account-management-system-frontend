import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    profilePhoto: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Profile Data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      if (!data.account) {
        throw new Error("Account details not found");
      }

      setUser(data.user);
      setAccount(data.account);

      setFormData({
        fullName: data.user.fullName || "",
        phone: data.account.phone || "",
        dateOfBirth: data.account.dateOfBirth
          ? data.account.dateOfBirth.substring(0, 10)
          : "",
        address: data.account.address || "",
        city: data.account.city || "",
        state: data.account.state || "",
        profilePhoto: data.user.profilePhoto || "",
      });
    } catch (error) {
      console.log("Profile error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        profilePhoto: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://account-management-system-2.onrender.com/api/users/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setUser(data.user);
      setAccount(data.account);

      setFormData({
        fullName: data.user.fullName || "",
        phone: data.account.phone || "",
        dateOfBirth: data.account.dateOfBirth
          ? data.account.dateOfBirth.substring(0, 10)
          : "",
        address: data.account.address || "",
        city: data.account.city || "",
        state: data.account.state || "",
        profilePhoto: data.user.profilePhoto || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log("Update profile error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-500 rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-3">
            Something went wrong
          </h2>

          <p className="text-slate-300 mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              My Profile
            </h1>

            <p className="text-slate-400 mt-1">
              Manage your personal information
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-5">
            {message}
          </div>
        )}

        {error && user && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          {/* PROFILE HEADER */}

          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">

            <div className="relative">

              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-700"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}

              {editing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer">
                  📷

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.fullName}
              </h2>

              <p className="text-slate-400">
                {user.email}
              </p>

              <span className="inline-block mt-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
            </div>

          </div>


          {/* PERSONAL DETAILS */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">
                Personal Details
              </h2>

              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setError("");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Edit Profile
                </button>
              )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* FULL NAME */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {user.fullName}
                  </p>
                )}
              </div>


              {/* EMAIL */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Email
                </label>

                <p className="bg-slate-800 rounded-lg px-4 py-3 text-slate-400">
                  {user.email}
                </p>
              </div>


              {/* PHONE */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Phone
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {account.phone}
                  </p>
                )}
              </div>


              {/* DATE OF BIRTH */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Date of Birth
                </label>

                {editing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {formData.dateOfBirth}
                  </p>
                )}
              </div>


              {/* ADDRESS */}

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Address
                </label>

                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {account.address}
                  </p>
                )}
              </div>


              {/* CITY */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  City
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {account.city}
                  </p>
                )}
              </div>


              {/* STATE */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  State
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="bg-slate-800 rounded-lg px-4 py-3">
                    {account.state}
                  </p>
                )}
              </div>

            </div>
          </div>


          {/* ACCOUNT DETAILS */}

          <div className="mt-8 pt-6 border-t border-slate-800">

            <h2 className="text-xl font-semibold mb-5">
              Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Account Number
                </label>

                <p className="bg-slate-800 rounded-lg px-4 py-3">
                  {account.accountNumber}
                </p>
              </div>


              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Account Balance
                </label>

                <p className="bg-slate-800 rounded-lg px-4 py-3 text-green-400 font-semibold">
                  ₹{Number(account.balance || 0).toLocaleString("en-IN")}
                </p>
              </div>


              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Account Role
                </label>

                <p className="bg-slate-800 rounded-lg px-4 py-3">
                  {user.role}
                </p>
              </div>


              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Account Status
                </label>

                <p className="bg-slate-800 rounded-lg px-4 py-3">
                  {user.isActive ? "Active" : "Inactive"}
                </p>
              </div>

            </div>
          </div>


          {/* SAVE / CANCEL */}

          {editing && (
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-800">

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  setError("");

                  setFormData({
                    fullName: user.fullName || "",
                    phone: account.phone || "",
                    dateOfBirth: account.dateOfBirth
                      ? account.dateOfBirth.substring(0, 10)
                      : "",
                    address: account.address || "",
                    city: account.city || "",
                    state: account.state || "",
                    profilePhoto: user.profilePhoto || "",
                  });
                }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import CreateAccount from "./Pages/CreateAccount";
import Transactions from "./Pages/Transactions";
import MyAccount from "./Pages/MyAccount";
import Transfer from "./Pages/Transfer";
import Deposit from "./Pages/Deposit";
import Withdraw from "./Pages/Withdraw";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account/create" element={<CreateAccount />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/SA/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/SA/Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </HashRouter>
  );
}

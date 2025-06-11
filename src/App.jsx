import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/SA/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/SA/Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";
export default function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
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

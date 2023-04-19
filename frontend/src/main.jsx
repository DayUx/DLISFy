import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/admin/Admin.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </HashRouter>
);

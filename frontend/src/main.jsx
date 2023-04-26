import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Admin from "./pages/admin/Admin.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import { utils } from "./utils/_helper.jsx";

const checkIfLoggedIn = () => {
  if (localStorage.getItem("access_token")) {
    return true;
  }
  return false;
};

const Root = () => {
  utils.navigate = useNavigate();
  utils.location = useLocation();
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

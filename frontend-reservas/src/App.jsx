import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Servicios from "./components/Servicios";
import Reservas from "./components/Reservas";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Servicios />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

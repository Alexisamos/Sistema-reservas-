import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", formData);
      setSuccess("Usuario registrado exitosamente.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err); // <-- Mostrar error en consola para debugging
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Error al registrar. Verifica los datos.");
      } else {
        setError("Error al registrar. Verifica los datos.");
      }
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <form className="register-form p-4 rounded shadow bg-white" onSubmit={handleSubmit} style={{ width: "350px" }}>
        <h2 className="mb-4 text-center">Registro</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
      </form>
    </div>
  );
}
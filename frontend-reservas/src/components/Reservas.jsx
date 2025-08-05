import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reservas.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ servicio: "", fecha: "", hora: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/reservas/");
      setReservas(res.data);
    } catch (err) {
      toast.error("Error al cargar reservas");
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/reservas/${editingId}/`, form);
        toast.success("Reserva actualizada");
      } else {
        await axios.post("http://localhost:8000/api/reservas/", form);
        toast.success("Reserva creada");
      }
      setForm({ servicio: "", fecha: "", hora: "" });
      setEditingId(null);
      fetchReservas();
    } catch (err) {
      toast.error("Error al guardar reserva");
    }
  };

  const handleEdit = reserva => {
    setForm({ servicio: reserva.servicio, fecha: reserva.fecha, hora: reserva.hora });
    setEditingId(reserva.id);
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/reservas/${id}/`);
      toast.success("Reserva eliminada");
      fetchReservas();
    } catch (err) {
      toast.error("Error al eliminar reserva");
    }
  };

  return (
    <div className="reservas-container">
      <ToastContainer />
      <h2>Gestión de Reservas</h2>

      <form onSubmit={handleSubmit} className="reserva-form">
        <input
          type="text"
          name="servicio"
          value={form.servicio}
          onChange={handleChange}
          placeholder="Servicio"
          required
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Actualizar" : "Agregar"} Reserva</button>
      </form>

      <div className="reservas-list">
        {reservas.map(reserva => (
          <div className="reserva-card" key={reserva.id}>
            <p><strong>Servicio:</strong> {reserva.servicio}</p>
            <p><strong>Fecha:</strong> {reserva.fecha}</p>
            <p><strong>Hora:</strong> {reserva.hora}</p>
            <div className="reserva-actions">
              <button className="edit-btn" onClick={() => handleEdit(reserva)}>Editar</button>
              <button className="delete-btn" onClick={() => handleDelete(reserva.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
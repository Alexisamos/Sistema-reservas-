import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Servicios.css";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/servicios/")
      .then((res) => setServicios(res.data))
      .catch((err) => console.error("Error al cargar servicios:", err));
  }, []);

  return (
    <div className="servicios-container">
      <h2>Servicios Disponibles</h2>
      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div className="servicio-card" key={servicio.id}>
            <h3>{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
            <p><strong>Precio:</strong> ${servicio.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

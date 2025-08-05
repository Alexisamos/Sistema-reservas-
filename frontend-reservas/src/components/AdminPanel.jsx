import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Table, Button, Form, Alert, Modal, Row, Col } from "react-bootstrap";

export default function AdminPanel() {
  const { token } = useContext(AuthContext);

  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    fetchServicios();
  }, [authHeaders]);

  const fetchServicios = () => {
    axios.get("http://127.0.0.1:8000/api/servicios/", authHeaders)
      .then(res => setServicios(res.data))
      .catch(() => setError("Error al cargar servicios"));
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleAddServicio = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validación sencilla
    if (!form.nombre || !form.descripcion || !form.precio) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    axios.post("http://127.0.0.1:8000/api/servicios/", form, authHeaders)
      .then(() => {
        setSuccess("Servicio agregado correctamente.");
        setForm({ nombre: "", descripcion: "", precio: "" });
        fetchServicios();
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => setError("Error al agregar servicio."));
  };

  const confirmDelete = (servicio) => {
    setServicioToDelete(servicio);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/servicios/${servicioToDelete.id}/`, authHeaders)
      .then(() => {
        setSuccess("Servicio eliminado correctamente.");
        fetchServicios();
        setShowDeleteModal(false);
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Error al eliminar servicio.");
        setShowDeleteModal(false);
      });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Panel de Administración de Servicios</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleAddServicio} className="mb-4 p-3 border rounded bg-light shadow">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del servicio"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción breve"
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                min="0"
                required
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button type="submit" variant="primary" className="w-100">
              Agregar
            </Button>
          </Col>
        </Row>
      </Form>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(servicio => (
            <tr key={servicio.id}>
              <td>{servicio.nombre}</td>
              <td>{servicio.descripcion}</td>
              <td>${servicio.precio}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmDelete(servicio)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el servicio "{servicioToDelete?.nombre}"? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
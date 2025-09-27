import "./App.css";
import api from "./api/api";
import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("/tasks");
      if (response.status === 204) {
        setTasks([]);
      } else {
        setTasks(response.data);
      }
      setError(null);
    } catch (error) {
      setError("Error fetching tasks");
    }
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      const cleanDescription = description.trim();
      const response = await api.post("/tasks", {
        description: cleanDescription,
      });
      setTasks([...tasks, response.data]);
      setDescription("");
      setError(null);
    } catch (error) {
      setError("Error adding task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (error) {
      setError("Error deleting task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditDescription(task.description);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setEditDescription("");
  };

  const handleModalChange = (e) => {
    setEditDescription(e.target.value);
  };

  const handleUpdateTask = async () => {
    if (!editDescription.trim()) return;
    try {
      const cleanDescription = editDescription.trim();
      console.log(cleanDescription);
      const response = await api.put(`/tasks/${editingTask.id}`, {
        description: cleanDescription,
      });
      console.log(response);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, description: cleanDescription }
            : task
        )
      );
      handleCloseModal();
      setError(null);
    } catch (error) {
      setError("Error updating task");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}

      <form method="post" onSubmit={handleSubmit} className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Faire les courses..."
          value={description}
          onChange={handleChange}
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
        />
        <button
          className="btn btn-outline-secondary"
          type="submit"
          disabled={!description.trim()}
        >
          Ajouter
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-danger">Aucune tâche pour l'instant.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Description</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <th scope="row">{index + 1}</th>
                <td>{task.description}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning ms-2"
                    onClick={() => handleEdit(task)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier la tâche</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Faire les courses..."
                    value={editDescription}
                    onChange={handleModalChange}
                    aria-label="Task description"
                  />
                  <button
                    className="btn btn-outline-warning"
                    type="button"
                    onClick={handleUpdateTask}
                    disabled={!editDescription.trim()}
                  >
                    Modifier
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await api.post('/tasks', { title });
    setTasks([data, ...tasks]);
    setTitle('');
  };

  const toggleTask = async (task) => {
    const { data } = await api.patch(`/tasks/${task._id}`, {
      completed: !task.completed
    });
    setTasks(tasks.map(t => t._id === data._id ? data : t));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="dash-wrapper">
      <div className="dash-container">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Mire se erdhe, {user?.name}!</h1>
            <p>{completed}/{tasks.length} tasks te përfunduara</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Dil</button>
        </div>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completed / tasks.length) * 100}%` }}
            />
          </div>
        )}

        {/* Add task form */}
        <form onSubmit={addTask} className="add-task-form">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Shto task të ri..."
          />
          <button type="submit" className="btn-add">+ Shto</button>
        </form>

        {/* Task list */}
        <div className="task-list">
          {loading && <p className="empty-msg">Duke ngarkuar...</p>}
          {!loading && tasks.length === 0 && (
            <p className="empty-msg">Nuk ke tasks ende. Shto te paren!</p>
          )}
          {tasks.map(task => (
            <div key={task._id} className={`task-item ${task.completed ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                className="task-checkbox"
              />
              <span className="task-title">{task.title}</span>
              <button
                className="btn-delete"
                onClick={() => deleteTask(task._id)}
              >
                Fshi
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
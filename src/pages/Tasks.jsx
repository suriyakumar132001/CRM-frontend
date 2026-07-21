import { useEffect, useState } from 'react';
import { getTasks, toggleTask, deleteTask } from '../api/tasks';
import TaskFormModal from '../components/TaskFormModal';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all | pending | completed

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const completedParam = filter === 'all' ? undefined : filter === 'completed';
      const { data } = await getTasks(completedParam);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleSaved = (newTask) => {
    setShowModal(false);
    setTasks((prev) => [newTask, ...prev]);
  };

  const isOverdue = (task) =>
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Tasks</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div className="task-filters">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="task-list">
          {tasks.map((t) => (
            <div key={t._id} className={`task-row ${t.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggle(t._id)}
              />
              <div className="task-info">
                <span className="task-title">{t.title}</span>
                {t.relatedTo?.name && (
                  <span className="task-related">→ {t.relatedTo.name}</span>
                )}
                {t.dueDate && (
                  <span className={`task-due ${isOverdue(t) ? 'overdue' : ''}`}>
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <span className={`priority-badge priority-${t.priority}`}>{t.priority}</span>
              <button className="btn-link danger" onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskFormModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
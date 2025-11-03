import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // router hooks
import './EventForm.css';

function EventForm() {
  const { id } = useParams();  // 如果 /edit/:id，获取 event ID
  const navigate = useNavigate();  // Jump after success

  // Form state (based on your mock data structure)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'study',  // default category
    location: 'Snell Library',
    date: '',  // YYYY-MM-DD
    time: '',
    maxParticipants: 10,
    currentParticipants: 0 // default current participants
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Category and location options (copied from EventList for consistency)
  const categories = [
    { value: 'study', label: 'Study' },
    { value: 'sports', label: 'Sports' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'food', label: 'Food' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'language', label: 'Language' },
    { value: 'other', label: 'Other' }
  ];

  const locations = [
    'Snell Library',
    'Marino Recreation Center',
    'Curry Student Center',
    'International Village',
    'Khoury Study Room',
    "Costco",
    'Off Campus'
  ];

  // Load event data (if editing)
  const fetchEvent = useCallback(async () => {
    if (!id) return;  // Skip when creating new

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:4000/api/events/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      
      const event = await response.json();
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'study',
        location: event.location || 'Snell Library',
        date: new Date(event.date).toISOString().split('T')[0] || '',  // Format date
        time: event.time || '',
        maxParticipants: event.maxParticipants || 10,
        currentParticipants: event.currentParticipants || 0
      });
      setIsEdit(true);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save (POST New or PUT Edit)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = id 
        ? `http://localhost:4000/api/events/${id}`  // 编辑
        : 'http://localhost:4000/api/events';  // 新建
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),  // make sure full ISO format
          currentParticipants: parseInt(formData.currentParticipants)  // Make sure the numbers
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} event`);
      }

      alert(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
      navigate('/events');  // 回列表
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, id, isEdit, navigate]);

  // 删除（只编辑模式）
  const handleDelete = useCallback(async () => {
    if (!id || !window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/events/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      alert('Event deleted successfully!');
      navigate('/events');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="event-form-loading">Loading...</div>;
  }

  return (
    <div className="event-form-container">
      <h1>{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Study Session for CSYE 6200"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Event details..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select id="location" name="location" value={formData.location} onChange={handleChange}>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}  // 今天起
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxParticipants">Max Participants</label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currentParticipants">Current Participants</label>
            <input
              type="number"
              id="currentParticipants"
              name="currentParticipants"
              value={formData.currentParticipants}
              onChange={handleChange}
              min="0"
              max={formData.maxParticipants}  // 动态 max = maxParticipants
              //disabled={!isEdit}  // 编辑时可改，新建默认 0 不可改（或可选）
            />
          </div>
        
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
          </button>
          {isEdit && (
            <button type="button" onClick={handleDelete} disabled={loading} className="delete-btn">
              Delete Event
            </button>
          )}
          <button type="button" onClick={() => navigate('/events')} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
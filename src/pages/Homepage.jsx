import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    user: null,
    joinedEvents: [],
    createdEvents: [],
    pastEvents: []
  });

  useEffect(() => {
    // Use mock data directly for development (backend not ready)
    const loadMockData = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setUserData(getMockUserData());
        setLoading(false);
      }, 500);
    };
    
    loadMockData();
  }, []);

  // This will be used when backend is ready
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch current user info
      const userResponse = await fetch('http://localhost:4000/api/auth/me', {
        credentials: 'include'
      });
      
      if (!userResponse.ok) {
        throw new Error('Not authenticated');
      }
      
      const user = await userResponse.json();
      
      // Fetch user's events
      const [joinedRes, createdRes] = await Promise.all([
        fetch(`http://localhost:3000/api/users/${user._id}/events/joined`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:3000/api/users/${user._id}/events/created`, {
          credentials: 'include'
        })
      ]);
      
      const joinedEvents = await joinedRes.json();
      const createdEvents = await createdRes.json();
      
      // Separate past and upcoming joined events
      const now = new Date();
      const upcoming = joinedEvents.filter(event => new Date(event.date) >= now);
      const past = joinedEvents.filter(event => new Date(event.date) < now);
      
      setUserData({
        user,
        joinedEvents: upcoming,
        createdEvents,
        pastEvents: past
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use mock data for development
      setUserData(getMockUserData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockUserData = () => ({
    user: {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@northeastern.edu',
      major: 'Computer Science',
      graduationYear: 2025
    },
    joinedEvents: [
      {
        _id: '1',
        title: 'Study Session for CSYE 6200',
        description: 'Preparing for midterm together',
        category: 'study',
        location: 'Snell Library',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        time: '7:00 PM',
        currentParticipants: 5,
        maxParticipants: 8
      },
      {
        _id: '2',
        title: 'Pickup Basketball',
        description: 'Casual game at Marino',
        category: 'sports',
        location: 'Marino Recreation Center',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        time: '5:30 PM',
        currentParticipants: 8,
        maxParticipants: 10
      },
      {
        _id: '6',
        title: 'Coffee Chat - International Students',
        description: 'Meet other international students',
        category: 'language',
        location: 'Curry Student Center',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: '3:00 PM',
        currentParticipants: 6,
        maxParticipants: 15
      }
    ],
    createdEvents: [
      {
        _id: '3',
        title: 'Costco Run - Need Carpool',
        description: 'Going to Costco, need 3 people',
        category: 'groceries',
        location: 'Off Campus',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:00 PM',
        currentParticipants: 2,
        maxParticipants: 4
      },
      {
        _id: '7',
        title: 'Board Game Night',
        description: 'Bring your favorite board games!',
        category: 'gaming',
        location: 'International Village',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '8:00 PM',
        currentParticipants: 8,
        maxParticipants: 12
      }
    ],
    pastEvents: [
      {
        _id: '4',
        title: 'Chinese New Year Dinner',
        description: 'Celebrate Chinese New Year together',
        category: 'food',
        location: 'Chinatown',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: '6:00 PM',
        currentParticipants: 12,
        maxParticipants: 12
      },
      {
        _id: '5',
        title: 'Hiking at Blue Hills',
        description: 'Morning hike with friends',
        category: 'sports',
        location: 'Off Campus',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        time: '8:00 AM',
        currentParticipants: 7,
        maxParticipants: 10
      },
      {
        _id: '8',
        title: 'Study Group - Data Structures',
        description: 'Final exam preparation',
        category: 'study',
        location: 'Snell Library',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        time: '4:00 PM',
        currentParticipants: 6,
        maxParticipants: 8
      }
    ]
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      study: '📚',
      sports: '🏃',
      groceries: '🛒',
      food: '🍕',
      gaming: '🎮',
      hobbies: '🎨',
      language: '🗣️',
      other: '🚀'
    };
    return emojis[category] || '📌';
  };

  const handleLeaveEvent = async (eventId) => {
    // Mock implementation for development
    if (window.confirm('Are you sure you want to leave this event?')) {
      // Remove from joinedEvents
      setUserData(prev => ({
        ...prev,
        joinedEvents: prev.joinedEvents.filter(e => e._id !== eventId)
      }));
      alert('Successfully left the event!');
    }
    
    // Uncomment when backend is ready:
    /*
    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}/leave`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchUserData();
      }
    } catch (error) {
      console.error('Error leaving event:', error);
    }
    */
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    // Mock implementation for development
    setUserData(prev => ({
      ...prev,
      createdEvents: prev.createdEvents.filter(e => e._id !== eventId)
    }));
    alert('Event deleted successfully!');
    
    // Uncomment when backend is ready:
    /*
    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchUserData();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    */
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const { user, joinedEvents, createdEvents, pastEvents } = userData;

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="home-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="user-info">{user?.email} • {user?.major}</p>
        </div>
        <div className="header-actions">
          <button 
            className="create-event-btn"
            onClick={() => navigate('/events/new')}
          >
            + Create New Event
          </button>
          <button 
            className="browse-events-btn"
            onClick={() => navigate('/events')}
          >
            Browse All Events
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{joinedEvents.length}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div className="stat-info">
            <h3>{createdEvents.length}</h3>
            <p>Events Created</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{pastEvents.length}</h3>
            <p>Events Attended</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>{joinedEvents.length + createdEvents.length + pastEvents.length}</h3>
            <p>Total Events</p>
          </div>
        </div>
      </div>

      {/* Events I'm Attending */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>📅 Events I'm Attending ({joinedEvents.length})</h2>
        </div>
        {joinedEvents.length > 0 ? (
          <div className="events-grid">
            {joinedEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                formatDate={formatDate}
                getCategoryEmoji={getCategoryEmoji}
                actions={
                  <>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="leave-btn"
                      onClick={() => handleLeaveEvent(event._id)}
                    >
                      Leave Event
                    </button>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>🔍 You haven't joined any upcoming events yet.</p>
            <button 
              className="browse-btn"
              onClick={() => navigate('/events')}
            >
              Browse Events
            </button>
          </div>
        )}
      </section>

      {/* Events I Created */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>✨ Events I Created ({createdEvents.length})</h2>
        </div>
        {createdEvents.length > 0 ? (
          <div className="events-grid">
            {createdEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                formatDate={formatDate}
                getCategoryEmoji={getCategoryEmoji}
                isCreator={true}
                actions={
                  <>
                    <button 
                      className="edit-btn"
                      onClick={() => navigate(`/events/${event._id}/edit`)}
                    >
                      Edit Event
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>✨ You haven't created any events yet.</p>
            <button 
              className="create-btn"
              onClick={() => navigate('/events/new')}
            >
              Create Your First Event
            </button>
          </div>
        )}
      </section>

      {/* Past Events */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>✅ Past Events ({pastEvents.length})</h2>
        </div>
        {pastEvents.length > 0 ? (
          <div className="events-grid">
            {pastEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                formatDate={formatDate}
                getCategoryEmoji={getCategoryEmoji}
                isPast={true}
                actions={
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View Details
                  </button>
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📜 No past events yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable Event Card Component
function EventCard({ event, formatDate, getCategoryEmoji, isCreator = false, isPast = false, actions }) {
  return (
    <div className={`event-card ${isPast ? 'past-event' : ''}`}>
      <div className="event-badges">
        <span className="category-badge">
          {getCategoryEmoji(event.category)} {event.category}
        </span>
        {isCreator && <span className="creator-badge">Created by you</span>}
        {isPast && <span className="past-badge">Completed</span>}
        {event.currentParticipants >= event.maxParticipants && !isPast && (
          <span className="full-badge">FULL</span>
        )}
      </div>
      
      <h3 className="event-title">{event.title}</h3>
      
      <div className="event-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span>{formatDate(event.date)} at {event.time}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>{event.location}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <span>{event.currentParticipants}/{event.maxParticipants} joined</span>
        </div>
      </div>
      
      <div className="event-actions">
        {actions}
      </div>
    </div>
  );
}

export default Home;
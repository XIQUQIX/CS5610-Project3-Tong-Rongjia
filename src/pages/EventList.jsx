```
This component is missing proptypes definition.
```
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function EventList() {
  // Events data state
  const [events, setEvents] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter and sort states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  // Fetch events from backend
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { id } = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(id);
      } catch (err) {
        console.error("Token decode failed", err);
      }
    }

    fetchEvents();
  }, [fetchEvents]);

  // Categories for filtering
  const categories = [
    'all',
    'study',
    'sports',
    'groceries',
    'food',
    'gaming',
    'hobbies',
    'language',
    'other'
  ];

  // Campus locations
  const locations = [
    'all',
    'Snell Library',
    'Curry Student Center',
    'Marino Recreation Center',
    'Ryder Hall',
    'International Village',
    'West Village',
    'East Village',
    'Off Campus'
  ];

  // Filter events based on search and filters
  const getFilteredEvents = useCallback(() => {
    let filtered = [...events];

    // Search filter
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(keyword) ||
          event.description.toLowerCase().includes(keyword)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= weekFromNow;
      });
    } else if (dateFilter === 'upcoming') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      });
    }

    return filtered;
  }, [events, searchKeyword, selectedCategory, selectedLocation, dateFilter]);

  // Sort events
  const getSortedEvents = useCallback((filtered) => {
    const sorted = [...filtered];

    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popularity') {
      sorted.sort((a, b) => b.currentParticipants - a.currentParticipants);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [sortBy]);

  // Get paginated events
  const getPaginatedEvents = useCallback(() => {
    const filtered = getFilteredEvents();
    const sorted = getSortedEvents(filtered);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

    return {
      events: sorted.slice(indexOfFirstEvent, indexOfLastEvent),
      totalEvents: sorted.length,
      totalPages: Math.ceil(sorted.length / eventsPerPage)
    };
  }, [currentPage, getFilteredEvents, getSortedEvents]);

  const { events: displayedEvents, totalEvents, totalPages } = getPaginatedEvents();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedCategory, selectedLocation, dateFilter, sortBy]);

  // Format date
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

  // Get category emoji
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

  // Handle joining an event
  const handleJoinEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to join events");
      return;
    }

    try {
      const { id: userId } = JSON.parse(atob(token.split(".")[1]));

      const response = await fetch(`${baseUrl}/api/events/${eventId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to join event");
      } else {
        alert("✅ Joined event successfully!");
        fetchEvents(); // refresh UI
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Failed to join event");
    }
  };

  // Handle leaving an event
  const handleLeaveEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    if (!window.confirm("Are you sure you want to leave this event?")) {
      return;
    }

    try {
      const { id: userId } = JSON.parse(atob(token.split(".")[1]));

      const response = await fetch(`${baseUrl}/api/events/${eventId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to leave event");
      } else {
        alert("✅ You left the event successfully!");
        fetchEvents(); // refresh UI
      }
    } catch (err) {
      console.error("Leave error:", err);
      alert("Failed to leave event");
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete event");
      } else {
        alert("✅ Event deleted successfully!");
        fetchEvents(); // refresh UI
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="event-list-loading">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <div className="event-list-error">
        <p>❌ Error: {error}</p>
        <button onClick={fetchEvents}>Retry</button>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      {/* Fixed Home Button */}
      <Link to="/homepage" className="fixed-home-btn">
        Home
      </Link>

      {/* Header */}
      <div className="event-list-header">
        <div className="header-left">
          <h1>Campus Events</h1>
          <p>Discover and join spontaneous activities around NEU campus</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events by title or description..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="location-filter">Location:</label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'all' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-filter">Date:</label>
            <select
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Date (Earliest First)</option>
              <option value="popularity">Popularity</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>Showing {displayedEvents.length} of {totalEvents} events</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {displayedEvents.length > 0 ? (
          displayedEvents.map(event => (
            <div key={event._id} className="event-card">
              {/* Event Badges */}
              <div className="event-badges">
                <span className="category-badge">
                  {getCategoryEmoji(event.category)} {event.category}
                </span>
                {event.currentParticipants >= event.maxParticipants && (
                  <span className="full-badge">FULL</span>
                )}
                {formatDate(event.date) === 'Today' && (
                  <span className="today-badge">TODAY</span>
                )}
              </div>

              {/* Event Content */}
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </p>

              {/* Event Details */}
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
                  <span>
                    {event.currentParticipants}/{event.maxParticipants} joined
                  </span>
                </div>
              </div>

              {/* Event Actions */}
              <div className="event-actions">
                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  View Details
                </button>

                {/* If current user created the event → DELETE */}
                {currentUserId && event.creator === currentUserId && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete Event
                  </button>
                )}

                {/* If user already joined → LEAVE */}
                {currentUserId &&
                  event.participants?.includes(currentUserId) &&
                  event.creator !== currentUserId && (
                    <button
                      className="leave-btn"
                      onClick={() => handleLeaveEvent(event._id)}
                    >
                      Leave Event
                    </button>
                  )}

                {/* If user has NOT joined and event has space → JOIN */}
                {currentUserId &&
                  !event.participants?.includes(currentUserId) &&
                  event.creator !== currentUserId &&
                  event.currentParticipants < event.maxParticipants && (
                    <button
                      className="join-btn"
                      onClick={() => handleJoinEvent(event._id)}
                    >
                      Join Event
                    </button>
                  )}

                {/* If user NOT joined & FULL → disabled */}
                {currentUserId &&
                  !event.participants?.includes(currentUserId) &&
                  event.creator !== currentUserId &&
                  event.currentParticipants >= event.maxParticipants && (
                    <button className="join-btn" disabled>
                      Event Full
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">
            <p>😔 No events found matching your criteria.</p>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {/* Always show Page 1 */}
            <button
              className={`page-number ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>

            {/* Show current page if not page 1 */}
            {currentPage !== 1 && (
              <button className="page-number active">
                {currentPage}
              </button>
            )}

            {/* Show next page if it exists */}
            {currentPage < totalPages && (
              <button
                className="page-number"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage + 1}
              </button>
            )}
          </div>

          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}

export default EventList;

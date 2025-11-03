import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

function EventList() {
  // Events data state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and sort states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/events'); // 后端 URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      // Fallback to mock data (for dev/testing)
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
}, []); // 依赖数组为空：因为 fetchEvents 不依赖其他 state/props（如果以后依赖 filters，就添加它们）
    
  
  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Mock events data
  const getMockEvents = () => [
    {
      _id: '1',
      title: 'Study Session for CSYE 6200',
      description: 'Let\'s prepare for the midterm together. Bring your notes and questions!',
      category: 'study',
      location: 'Snell Library',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      time: '7:00 PM',
      maxParticipants: 8,
      currentParticipants: 5,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Pickup Basketball at Marino',
      description: 'Need 2 more players for a casual game. All skill levels welcome!',
      category: 'sports',
      location: 'Marino Recreation Center',
      date: new Date().toISOString(), // Today
      time: '5:30 PM',
      maxParticipants: 10,
      currentParticipants: 8,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Costco Run - Need Carpool',
      description: 'Going to Costco this Saturday. Have space for 3 people. Split gas!',
      category: 'groceries',
      location: 'Off Campus',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:00 PM',
      maxParticipants: 4,
      currentParticipants: 1,
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      title: 'Korean Food Tour in Allston',
      description: 'Trying new Korean restaurants. Anyone interested in joining?',
      category: 'food',
      location: 'Off Campus',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: '6:00 PM',
      maxParticipants: 6,
      currentParticipants: 3,
      createdAt: new Date().toISOString()
    },
    {
      _id: '5',
      title: 'Board Game Night',
      description: 'Catan, Monopoly, Uno - bring your favorite games!',
      category: 'gaming',
      location: 'Curry Student Center',
      date: new Date().toISOString(),
      time: '8:00 PM',
      maxParticipants: 12,
      currentParticipants: 12,
      createdAt: new Date().toISOString()
    },
    {
      _id: '6',
      title: 'Chinese Language Exchange',
      description: 'Practice Chinese conversation. Native speakers and learners welcome!',
      category: 'language',
      location: 'International Village',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: '4:00 PM',
      maxParticipants: 10,
      currentParticipants: 6,
      createdAt: new Date().toISOString()
    }
  ];

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
        <p>Using mock data for demonstration</p>
        <button onClick={fetchEvents}>Retry</button>
      </div>
    );
  }

return (
  <div className="event-list-container">
    {/* Fixed Home 按钮：放到整个页面右上角 */}
    <Link to="/homepage" className="fixed-home-btn">
      Home
    </Link>

    {/* Header - 完整闭合 */}
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
                onClick={() => window.location.href = `/events/${event._id}`}
              >
                View Details
              </button>
              {event.currentParticipants < event.maxParticipants ? (
                <button className="join-btn">Join Event</button>
              ) : (
                <button className="join-btn" disabled>Event Full</button>
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
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
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
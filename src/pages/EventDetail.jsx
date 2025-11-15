```
This component is missing PropTypes definitions, and there's also a small issue with the Google Maps integration. 
The iframe uses the literal string 'YOUR_GOOGLE_MAPS_API_KEY' as a placeholder, which means the map feature doesn't actually work for users.
The direct link to Google Maps works fine though.

```

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetail.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      console.error(err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const getMapLinkUrl = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (!event) {
    return (
      <div className="event-detail-error">
        <h2>Event Not Found</h2>
        <button onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    );
  }

  const isPast = new Date(event.date) < new Date();
  const isFull = event.currentParticipants >= event.maxParticipants;

  return (
    <div className="event-detail-container">
    <button className="back-btn" onClick={() => navigate('/events')}>
        ← Back to Events
    </button>

    <div className="event-detail-header">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
        </p>
        <p>
        <strong>Time:</strong> {event.time}
        </p>
        <p>
        <strong>Location:</strong> {event.location}{' '}
        <a href={getMapLinkUrl(event.location)} target="_blank" rel="noopener noreferrer">
            View on Google Maps
        </a>
        </p>
        <p>
        <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}{' '}
        {isFull && '(FULL)'}
        </p>
    </div>

    <div className="event-map">
        <iframe
        title="Event Location"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
            event.location
        )}&zoom=15`}
        />
    </div>
    </div>
  );
}

export default EventDetail;

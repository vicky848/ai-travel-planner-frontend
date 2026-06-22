import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import TripForm from '../components/TripForm';
import ItineraryCard from '../components/ItineraryCard';
import PackingList from '../components/PackingList';

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await API.get('/api/trips');
      setTrips(res.data);
      if (res.data.length > 0) setSelectedTrip(res.data[0]);
    } catch (err) {
      console.error('Error fetching trips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTrip = async (formData) => {
    setGenerating(true);
    try {
      const res = await API.post('/api/trips/generate', formData);
      setTrips([res.data, ...trips]);
      setSelectedTrip(res.data);
      setShowForm(false);
    } catch (err) {
      alert('Error generating trip. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateTrip = async (tripId, updateData) => {
    try {
      const res = await API.put(`/api/trips/${tripId}`, updateData);
      setSelectedTrip(res.data);
      setTrips(trips.map(t => t._id === tripId ? res.data : t));
    } catch (err) {
      console.error('Error updating trip', err);
    }
  };

  const handleRegenerateDay = async (tripId, dayNumber, feedback) => {
    try {
      const res = await API.post(`/api/trips/${tripId}/regenerate-day`, {
        dayNumber,
        feedback
      });
      setSelectedTrip(res.data);
      setTrips(trips.map(t => t._id === tripId ? res.data : t));
    } catch (err) {
      console.error('Error regenerating day', err);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await API.delete(`/api/trips/${tripId}`);
      const remaining = trips.filter(t => t._id !== tripId);
      setTrips(remaining);
      setSelectedTrip(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      console.error('Error deleting trip', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>✈️ Loading your trips...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>✈️ TravelAI</h1>
          <p style={styles.welcome}>Welcome, {user.name}!</p>
        </div>
        <div style={styles.headerRight}>
          <button onClick={() => setShowForm(!showForm)} style={styles.newTripBtn}>
            {showForm ? '✕ Cancel' : '+ New Trip'}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {/* Trip Generation Form */}
      {showForm && (
        <div style={styles.formSection}>
          <TripForm onSubmit={handleGenerateTrip} loading={generating} />
        </div>
      )}

      {generating && (
        <div style={styles.generatingBanner}>
          🤖 AI is generating your trip itinerary... Please wait (15-30 seconds)
        </div>
      )}

      <div style={styles.mainContent}>
        {/* Sidebar - Trip List */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Your Trips</h2>
          {trips.length === 0 ? (
            <div style={styles.noTrips}>
              <p>No trips yet!</p>
              <p>Click "+ New Trip" to get started</p>
            </div>
          ) : (
            trips.map(trip => (
              <div
                key={trip._id}
                onClick={() => setSelectedTrip(trip)}
                style={{
                  ...styles.tripCard,
                  ...(selectedTrip?._id === trip._id ? styles.tripCardActive : {})
                }}
              >
                <div style={styles.tripCardHeader}>
                  <span style={styles.tripDestination}>📍 {trip.destination}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip._id); }}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
                <p style={styles.tripMeta}>{trip.durationDays} Days • {trip.budgetTier} Budget</p>
                <p style={styles.tripBudget}>💰 Total: ${trip.estimatedBudget?.total}</p>
              </div>
            ))
          )}
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {selectedTrip ? (
            <>
              {/* Budget Overview */}
              <div style={styles.budgetCard}>
                <h2 style={styles.sectionTitle}>💰 Budget Overview - {selectedTrip.destination}</h2>
                <div style={styles.budgetGrid}>
                  <div style={styles.budgetItem}>
                    <span style={styles.budgetLabel}>🚗 Transport</span>
                    <span style={styles.budgetValue}>${selectedTrip.estimatedBudget?.transport}</span>
                  </div>
                  <div style={styles.budgetItem}>
                    <span style={styles.budgetLabel}>🏨 Accommodation</span>
                    <span style={styles.budgetValue}>${selectedTrip.estimatedBudget?.accommodation}</span>
                  </div>
                  <div style={styles.budgetItem}>
                    <span style={styles.budgetLabel}>🍜 Food</span>
                    <span style={styles.budgetValue}>${selectedTrip.estimatedBudget?.food}</span>
                  </div>
                  <div style={styles.budgetItem}>
                    <span style={styles.budgetLabel}>🎯 Activities</span>
                    <span style={styles.budgetValue}>${selectedTrip.estimatedBudget?.activities}</span>
                  </div>
                  <div style={{...styles.budgetItem, ...styles.budgetTotal}}>
                    <span style={styles.budgetLabel}>💵 Total</span>
                    <span style={styles.budgetValue}>${selectedTrip.estimatedBudget?.total}</span>
                  </div>
                </div>
              </div>

              {/* Hotels */}
              <div style={styles.hotelsCard}>
                <h2 style={styles.sectionTitle}>🏨 Recommended Hotels</h2>
                <div style={styles.hotelsGrid}>
                  {selectedTrip.hotels?.map((hotel, index) => (
                    <div key={index} style={styles.hotelItem}>
                      <p style={styles.hotelName}>{hotel.name}</p>
                      <p style={styles.hotelTier}>{hotel.tier}</p>
                      <p style={styles.hotelCost}>${hotel.estimatedCostNightUSD}/night</p>
                      <p style={styles.hotelRating}>⭐ {hotel.rating}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <ItineraryCard
                trip={selectedTrip}
                onUpdate={handleUpdateTrip}
                onRegenerateDay={handleRegenerateDay}
              />

              {/* Packing List */}
              <PackingList
                trip={selectedTrip}
                onUpdate={handleUpdateTrip}
              />
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>✈️</p>
              <p style={styles.emptyText}>Select a trip or create a new one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1117', fontFamily: "'Segoe UI', sans-serif" },
  loadingContainer: { minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#fff', fontSize: '24px' },
  header: { background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: {},
  headerRight: { display: 'flex', gap: '12px' },
  logo: { color: '#fff', fontSize: '24px', margin: 0 },
  welcome: { color: '#aaa', fontSize: '14px', margin: '4px 0 0 0' },
  newTripBtn: { background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { background: 'rgba(255,0,0,0.2)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', color: '#ff6b6b', padding: '10px 20px', cursor: 'pointer' },
  formSection: { padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  generatingBanner: { background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', color: '#667eea', padding: '12px 24px', textAlign: 'center', fontSize: '14px' },
  mainContent: { display: 'flex', minHeight: 'calc(100vh - 70px)' },
  sidebar: { width: '280px', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '20px', flexShrink: 0 },
  sidebarTitle: { color: '#fff', fontSize: '16px', marginBottom: '16px' },
  noTrips: { color: '#666', fontSize: '14px', textAlign: 'center', paddingTop: '40px' },
  tripCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s' },
  tripCardActive: { background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.5)' },
  tripCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tripDestination: { color: '#fff', fontWeight: 'bold', fontSize: '14px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  tripMeta: { color: '#aaa', fontSize: '12px', margin: '4px 0' },
  tripBudget: { color: '#667eea', fontSize: '12px', margin: 0 },
  content: { flex: 1, padding: '24px', overflowY: 'auto' },
  budgetCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '20px' },
  sectionTitle: { color: '#fff', fontSize: '18px', marginBottom: '16px' },
  budgetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' },
  budgetItem: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  budgetTotal: { background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.3)' },
  budgetLabel: { color: '#aaa', fontSize: '12px' },
  budgetValue: { color: '#fff', fontSize: '18px', fontWeight: 'bold' },
  hotelsCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '20px' },
  hotelsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' },
  hotelItem: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' },
  hotelName: { color: '#fff', fontWeight: 'bold', fontSize: '14px', margin: '0 0 6px 0' },
  hotelTier: { color: '#667eea', fontSize: '12px', margin: '0 0 4px 0' },
  hotelCost: { color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' },
  hotelRating: { color: '#ffd700', fontSize: '12px', margin: 0 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' },
  emptyIcon: { fontSize: '60px', margin: '0 0 16px 0' },
  emptyText: { color: '#666', fontSize: '18px' },
};

export default Dashboard;
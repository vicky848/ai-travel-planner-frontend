import React, { useState } from 'react';

function ItineraryCard({ trip, onUpdate, onRegenerateDay }) {
  const [newActivity, setNewActivity] = useState('');
  const [targetDay, setTargetDay] = useState(null);
  const [regenerateFeedback, setRegenerateFeedback] = useState('');
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [loadingDay, setLoadingDay] = useState(null);

  const handleAddActivity = async (dayNumber) => {
    if (!newActivity.trim()) return;

    const updatedItinerary = trip.itinerary.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [
            ...day.activities,
            {
              title: newActivity,
              description: 'Added by traveler',
              estimatedCostUSD: 0,
              timeOfDay: 'Afternoon'
            }
          ]
        };
      }
      return day;
    });

    await onUpdate(trip._id, { itinerary: updatedItinerary });
    setNewActivity('');
    setTargetDay(null);
  };

  const handleRemoveActivity = async (dayNumber, activityIndex) => {
    const updatedItinerary = trip.itinerary.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.filter((_, index) => index !== activityIndex)
        };
      }
      return day;
    });

    await onUpdate(trip._id, { itinerary: updatedItinerary });
  };

  const handleRegenerateDay = async (dayNumber) => {
    if (!regenerateFeedback.trim()) {
      alert('Please enter feedback for regeneration!');
      return;
    }
    setLoadingDay(dayNumber);
    try {
      await onRegenerateDay(trip._id, dayNumber, regenerateFeedback);
      setRegeneratingDay(null);
      setRegenerateFeedback('');
    } finally {
      setLoadingDay(null);
    }
  };

  const timeColors = {
    Morning: '#ffd700',
    Afternoon: '#ff8c00',
    Evening: '#9370db'
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Day-by-Day Itinerary</h2>

      {trip.itinerary?.map((day) => (
        <div key={day.dayNumber} style={styles.dayCard}>
          {/* Day Header */}
          <div style={styles.dayHeader}>
            <h3 style={styles.dayTitle}>Day {day.dayNumber}</h3>
            <button
              onClick={() => setRegeneratingDay(
                regeneratingDay === day.dayNumber ? null : day.dayNumber
              )}
              style={styles.regenerateBtn}
            >
              🔄 Regenerate Day
            </button>
          </div>

          {/* Regenerate Form */}
          {regeneratingDay === day.dayNumber && (
            <div style={styles.regenerateForm}>
              <input
                type="text"
                placeholder="e.g. More outdoor activities, hiking instead of shopping..."
                value={regenerateFeedback}
                onChange={(e) => setRegenerateFeedback(e.target.value)}
                style={styles.regenerateInput}
              />
              <button
                onClick={() => handleRegenerateDay(day.dayNumber)}
                style={styles.regenerateSubmitBtn}
                disabled={loadingDay === day.dayNumber}
              >
                {loadingDay === day.dayNumber ? '⏳ Regenerating...' : '✨ Apply'}
              </button>
            </div>
          )}

          {/* Activities */}
          <div style={styles.activitiesList}>
            {day.activities?.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityHeader}>
                  <span
                    style={{
                      ...styles.timeTag,
                      background: `${timeColors[activity.timeOfDay]}22`,
                      color: timeColors[activity.timeOfDay],
                      border: `1px solid ${timeColors[activity.timeOfDay]}44`
                    }}
                  >
                    {activity.timeOfDay}
                  </span>
                  <button
                    onClick={() => handleRemoveActivity(day.dayNumber, index)}
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
                <p style={styles.activityTitle}>{activity.title}</p>
                <p style={styles.activityDesc}>{activity.description}</p>
                {activity.estimatedCostUSD > 0 && (
                  <p style={styles.activityCost}>💵 ${activity.estimatedCostUSD}</p>
                )}
              </div>
            ))}
          </div>

          {/* Add Activity */}
          {targetDay === day.dayNumber ? (
            <div style={styles.addActivityForm}>
              <input
                type="text"
                placeholder="Enter activity name..."
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                style={styles.addInput}
                onKeyPress={(e) => e.key === 'Enter' && handleAddActivity(day.dayNumber)}
              />
              <button
                onClick={() => handleAddActivity(day.dayNumber)}
                style={styles.addBtn}
              >
                Add
              </button>
              <button
                onClick={() => { setTargetDay(null); setNewActivity(''); }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setTargetDay(day.dayNumber)}
              style={styles.addActivityBtn}
            >
              + Add Activity
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
  },
  title: { color: '#fff', fontSize: '18px', marginBottom: '20px' },
  dayCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  dayTitle: { color: '#667eea', fontSize: '16px', margin: 0 },
  regenerateBtn: {
    background: 'rgba(255,165,0,0.15)',
    border: '1px solid rgba(255,165,0,0.3)',
    borderRadius: '8px',
    color: '#ffa500',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  regenerateForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  regenerateInput: {
    flex: 1,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  regenerateSubmitBtn: {
    background: 'rgba(255,165,0,0.3)',
    border: '1px solid rgba(255,165,0,0.5)',
    borderRadius: '8px',
    color: '#ffa500',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  activitiesList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' },
  activityItem: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '12px',
  },
  activityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  timeTag: { fontSize: '11px', padding: '2px 10px', borderRadius: '20px', fontWeight: 'bold' },
  removeBtn: {
    background: 'rgba(255,0,0,0.1)',
    border: '1px solid rgba(255,0,0,0.2)',
    borderRadius: '6px',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '2px 8px',
  },
  activityTitle: { color: '#fff', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0' },
  activityDesc: { color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' },
  activityCost: { color: '#4caf50', fontSize: '12px', margin: 0 },
  addActivityForm: { display: 'flex', gap: '8px', marginTop: '10px' },
  addInput: {
    flex: 1,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  addBtn: {
    background: 'rgba(102,126,234,0.3)',
    border: '1px solid rgba(102,126,234,0.5)',
    borderRadius: '8px',
    color: '#667eea',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#aaa',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  addActivityBtn: {
    background: 'none',
    border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#666',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    width: '100%',
    marginTop: '8px',
  },
};

export default ItineraryCard;
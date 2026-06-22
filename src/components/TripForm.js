import React, { useState } from 'react';

const INTERESTS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'History', 'Nightlife', 'Sports'];

function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    destination: '',
    durationDays: 3,
    budgetTier: 'Medium',
    interests: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    const current = formData.interests;
    if (current.includes(interest)) {
      setFormData({ ...formData, interests: current.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...current, interest] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) {
      alert('Please enter a destination!');
      return;
    }
    if (formData.interests.length === 0) {
      alert('Please select at least one interest!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🗺️ Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          {/* Destination */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>📍 Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Tokyo, Paris, Bali"
              style={styles.input}
              required
            />
          </div>

          {/* Duration */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>📅 Number of Days</label>
            <input
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              min="1"
              max="14"
              style={styles.input}
            />
          </div>

          {/* Budget */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>💰 Budget Type</label>
            <select
              name="budgetTier"
              value={formData.budgetTier}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Low">Low Budget</option>
              <option value="Medium">Medium Budget</option>
              <option value="High">High Budget</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>🎯 Interests (select all that apply)</label>
          <div style={styles.interestsGrid}>
            {INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                style={{
                  ...styles.interestBtn,
                  ...(formData.interests.includes(interest) ? styles.interestBtnActive : {})
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? '🤖 Generating your trip...' : '🚀 Generate Trip with AI'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px',
  },
  title: { color: '#fff', fontSize: '20px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#ccc', fontSize: '14px', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  interestsGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  interestBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
  interestBtnActive: {
    background: 'rgba(102,126,234,0.3)',
    border: '1px solid rgba(102,126,234,0.6)',
    color: '#667eea',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default TripForm;
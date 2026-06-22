import React from 'react';

const categoryIcons = {
  Documents: '📄',
  Clothing: '👕',
  Gear: '🎒',
  Electronics: '💻',
  Toiletries: '🧴',
  Medicine: '💊',
  Other: '📦'
};

const categoryColors = {
  Documents: '#ff6b6b',
  Clothing: '#ffd700',
  Gear: '#4ecdc4',
  Electronics: '#667eea',
  Toiletries: '#ff8c00',
  Medicine: '#4caf50',
  Other: '#aaa'
};

function PackingList({ trip, onUpdate }) {
  const toggleItem = async (itemId) => {
    const updatedPackingList = trip.packingList.map(item => {
      if (item._id === itemId) {
        return { ...item, isPacked: !item.isPacked };
      }
      return item;
    });
    await onUpdate(trip._id, { packingList: updatedPackingList });
  };

  const packedCount = trip.packingList?.filter(item => item.isPacked).length || 0;
  const totalCount = trip.packingList?.length || 0;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Group by category
  const grouped = {};
  trip.packingList?.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>⛈️ AI Weather-Aware Packing Assistant</h2>
        <p style={styles.subtitle}>
          Smart packing list based on {trip.destination} climate & your activities
        </p>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressText}>Packing Progress</span>
          <span style={styles.progressCount}>{packedCount}/{totalCount} items packed</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
              background: percentage === 100
                ? 'linear-gradient(135deg, #4caf50, #45a049)'
                : 'linear-gradient(135deg, #667eea, #764ba2)'
            }}
          />
        </div>
        <span style={styles.progressPercent}>{percentage}%</span>
      </div>

      {percentage === 100 && (
        <div style={styles.allPackedBanner}>
          🎉 All packed! Ready for your trip to {trip.destination}!
        </div>
      )}

      {/* Items by Category */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={styles.categorySection}>
          <h3 style={styles.categoryTitle}>
            <span>{categoryIcons[category] || '📦'}</span>
            <span style={{ color: categoryColors[category] || '#aaa' }}>{category}</span>
            <span style={styles.categoryCount}>{items.filter(i => i.isPacked).length}/{items.length}</span>
          </h3>

          <div style={styles.itemsGrid}>
            {items.map(item => (
              <div
                key={item._id}
                onClick={() => toggleItem(item._id)}
                style={{
                  ...styles.itemCard,
                  ...(item.isPacked ? styles.itemCardPacked : {})
                }}
              >
                <div style={styles.checkbox}>
                  {item.isPacked ? '✅' : '⬜'}
                </div>
                <span style={{
                  ...styles.itemName,
                  ...(item.isPacked ? styles.itemNamePacked : {})
                }}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
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
  header: { marginBottom: '20px' },
  title: { color: '#fff', fontSize: '18px', margin: '0 0 8px 0' },
  subtitle: { color: '#aaa', fontSize: '13px', margin: 0 },
  progressSection: { marginBottom: '20px' },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressText: { color: '#ccc', fontSize: '13px' },
  progressCount: { color: '#667eea', fontSize: '13px' },
  progressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressPercent: { color: '#aaa', fontSize: '12px' },
  allPackedBanner: {
    background: 'rgba(76,175,80,0.15)',
    border: '1px solid rgba(76,175,80,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#4caf50',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '16px',
  },
  categorySection: { marginBottom: '16px' },
  categoryTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    marginBottom: '10px',
  },
  categoryCount: { color: '#666', fontSize: '12px', marginLeft: 'auto' },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px',
  },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  itemCardPacked: {
    background: 'rgba(76,175,80,0.1)',
    border: '1px solid rgba(76,175,80,0.2)',
  },
  checkbox: { fontSize: '16px', flexShrink: 0 },
  itemName: { color: '#fff', fontSize: '13px' },
  itemNamePacked: {
    textDecoration: 'line-through',
    color: '#666',
  },
};

export default PackingList;
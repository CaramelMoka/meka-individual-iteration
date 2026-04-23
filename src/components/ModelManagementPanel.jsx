import React, { useState } from 'react';

const ModelManagementPanel = ({
  models,
  setModels,
  setSelectedModels
}) => {
  const [newName, setNewName] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [showForm, setShowForm] = useState(false);

  const toggleVisibility = (id) => {
    setModels(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, showInSelector: !m.showInSelector }
          : m
      )
    );

    setSelectedModels(prev =>
      prev.filter(mid => mid !== id)
    );
  };
  const addCustomModel = () => {
  if (!newName || !newEndpoint) return;

  const newModel = {
    id: newName.toLowerCase().replace(/\s+/g, '-'),
    name: newName,
    endpoint: newEndpoint,
    showInSelector: true
  };

  setModels(prev => [...prev, newModel]);

  setNewName('');
  setNewEndpoint('');
};

  //
const defaultModels = models.filter(m => !m.endpoint);
const customModels = models.filter(m => m.endpoint);
const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.2)',
  color: 'white',
  fontSize: '0.8rem'
};

const btnStyle = {
  padding: '4px 8px',
  fontSize: '0.75rem',
  borderRadius: '6px',
  border: 'none',
  background: '#cba6f7',
  color: 'white',
  cursor: 'pointer'
};

  return (
    <div className="model-panel">
      <h3>Models</h3>

      {/* ⭐ Default */}
      <div>
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '6px' }}>
          Available
        </div>

        {defaultModels.map(model => (
          <div key={model.id} className="model-row-item">
            <span>{model.name}</span>
            <input
              type="checkbox"
              checked={model.showInSelector}
              onChange={() => toggleVisibility(model.id)}
            />
          </div>
        ))}
      </div>

      {/*  Custom */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '6px' }}>
          Custom
        </div>

        {customModels.map(model => (
          <div key={model.id} className="model-row-item">
            <span>{model.name}</span>
            <input
              type="checkbox"
              checked={model.showInSelector}
              onChange={() => toggleVisibility(model.id)}
            />
          </div>
        ))}

<div style={{ marginTop: '8px' }}>
  {!showForm && (
    <div
      style={{
        opacity: 0.6,
        fontSize: '0.8rem',
        cursor: 'pointer'
      }}
      onClick={() => setShowForm(true)}
    >
      + Add custom model
    </div>
  )}

  {showForm && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      
      <input
        placeholder="Model name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Endpoint (http://...)"
        value={newEndpoint}
        onChange={e => setNewEndpoint(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: '6px' }}>
        <button style={btnStyle} onClick={() => {
          addCustomModel();
          setShowForm(false);
        }}>
          Add
        </button>

        <button style={btnStyle} onClick={() => {
          setShowForm(false);
          setNewName('');
          setNewEndpoint('');
        }}>
          Cancel
        </button>
      </div>

    </div>
  )}
</div>
      </div>

    </div>
  );
};

export default ModelManagementPanel;

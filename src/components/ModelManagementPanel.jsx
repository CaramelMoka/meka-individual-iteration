import React, { useState } from 'react';

const ModelManagementPanel = ({
  models,
  setModels,
  setSelectedModels
}) => {
  const [newName, setNewName] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [showForm, setShowForm] = useState(false);

const toggleVisibility = async (id) => {
  let updated;

  setModels(prev => {
    updated = prev.map(m =>
      m.id === id
        ? { ...m, showInSelector: !m.showInSelector }
        : m
    );
    return updated;
  });

  setSelectedModels(prev => prev.filter(mid => mid !== id));

  try {
    await fetch('http://localhost:3001/api/saveModels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        models: updated.filter(m => m.isCustom)
      })
    });
  } catch (err) {
    console.error('Toggle save failed:', err);
  }
};



//CustomModel
  const addCustomModel = async () => {
  if (!newName || !newEndpoint) return;

  const newModel = {
    id: Date.now().toString(),
    name: newName,
    endpoint: newEndpoint,
    showInSelector: true,
    isCustom: true
  };


  const updatedModels = [...models, newModel];
//render Ui
  setModels(updatedModels);
  try {//send to backend
   const customModels = updatedModels.filter(m => m.isCustom);
    await fetch('http://localhost:3001/api/saveModels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        models: customModels
      })
    });

  } catch (err) {
    console.error('Failed to save models:', err);
  }
//clear form
  setNewName('');
  setNewEndpoint('');
};

const deleteCustomModel = async (id) => {
  const updated = models.filter(m => m.id !== id);
//renderUI
  setModels(updated);
  setSelectedModels(prev => prev.filter(mid => mid !== id));

  try {
    const customModels = updated.filter(m => m.isCustom);

    await fetch('http://localhost:3001/api/saveModels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        models: customModels
      })
    });
  } catch (err) {
    console.error('Delete failed:', err);
  }
};

  

 const defaultModels = models.filter(m => !m.isCustom);
 const customModels = models.filter(m => m.isCustom);

 //style
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
  color: 'rgb(55, 9, 65)',
  cursor: 'pointer'
};
const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
 
};

const leftGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const checkboxStyle = {
  appearance: 'none',
  WebkitAppearance: 'none',
  width: '16px',
  height: '16px',
  cursor: 'pointer',
  border: '1.5px solid var(--ctp-mauve)',
  backgroundColor: 'var(--ctp-surface0)',
  borderRadius: '4px',
  position: 'relative'
};

const deleteBtnStyle = {
  marginLeft: '6px',
  background: 'transparent',
  border: 'none',
  color: '#e3e3e3',
  cursor: 'pointer',
  fontSize: '0.9rem',
  opacity: 0.8
};

  return (
    <div className="model-panel">
      <h3>Models</h3>

      {/*  Default */}
      <div>
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '6px' }}>
          Available
        </div>

        {defaultModels.map(model => (
  <div key={model.id} style={rowStyle}>
    <div style={leftGroup}>
      <div
        style={{
          ...checkboxStyle,
          backgroundColor: model.showInSelector
            ? 'var(--ctp-mauve)'
            : 'var(--ctp-surface0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(55, 9, 65)',
          fontSize: '12px'
        }}
        onClick={() => toggleVisibility(model.id)}
      >
        {model.showInSelector ? '✓' : ''}
      </div>

      <span>{model.name}</span>
    </div>
  </div>
))}
      </div>

      {/*  Custom */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '6px' }}>
          Custom
        </div>

{customModels.map(model => (
  <div key={model.id} style={rowStyle}>
    <div style={leftGroup}>
      <div
        style={{
          ...checkboxStyle,
          backgroundColor: model.showInSelector
            ? 'var(--ctp-mauve)'
            : 'var(--ctp-surface0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgb(55, 9, 65)',
          fontSize: '12px'
        }}
        onClick={() => toggleVisibility(model.id)}
      >
        {model.showInSelector ? '✓' : ''}
      </div>

      <span>{model.name}</span>
    </div>

    <button
      onClick={() => deleteCustomModel(model.id)}
      style={deleteBtnStyle}
    >
      ✕
    </button>
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

      <div style={{ display: 'flex', gap: '6px',marginTop: '12px' }}>
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

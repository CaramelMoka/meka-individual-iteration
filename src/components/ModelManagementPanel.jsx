import React from 'react';

const ModelManagementPanel = ({
  models,
  setModels,
  selectedModels,
  setSelectedModels
}) => {

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

  //
const defaultModels = models.filter(m => !m.endpoint);
const customModels = models.filter(m => m.endpoint);

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

      {/* ⭐ Custom */}
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

        <div style={{ marginTop: '8px', opacity: 0.6, fontSize: '0.8rem' }}>
          + Add custom model
        </div>
      </div>

    </div>
  );
};

export default ModelManagementPanel;
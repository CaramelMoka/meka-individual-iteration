import React from 'react';

const ModelSelector = ({ models, selectedModels, setSelectedModels }) => {
  const toggleModel = (modelId) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(m => m !== modelId)
        : [...prev, modelId]
    );
  };

  const visibleModels = models.filter(m => m.showInSelector);

  return (
    <div className="model-selector">
      {visibleModels.map(model => (
        <label key={model.id}>
          <input
            type="checkbox"
            checked={selectedModels.includes(model.id)}
            onChange={() => toggleModel(model.id)}
          />
          {model.name}
        </label>
      ))}
    </div>
  );
};

export default ModelSelector;
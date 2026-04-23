require('@babel/register')({
  presets: ['@babel/preset-react']
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelManagementPanel from '../../src/components/ModelManagementPanel';

describe('ModelManagementPanel', () => {

  it('renders model management panel with models', () => {
    const models = [
      { id: 'A', name: 'Model A', showInSelector: true },
      { id: 'B', name: 'Model B', showInSelector: true }
    ];

    render(
      <ModelManagementPanel
        models={models}
        setModels={jasmine.createSpy('setModels')}
        selectedModels={[]}
        setSelectedModels={jasmine.createSpy('setSelectedModels')}
      />
    );

    expect(screen.getByText('Models')).toBeTruthy();
    expect(screen.getByText('Model A')).toBeTruthy();
    expect(screen.getByText('Model B')).toBeTruthy();
  });

  it('toggle model visibility updates models and removes from selectedModels', () => {
    const models = [
      { id: 'A', name: 'Model A', showInSelector: true }
    ];

    const setModels = jasmine.createSpy('setModels');
    const setSelectedModels = jasmine.createSpy('setSelectedModels');

    render(
      <ModelManagementPanel
        models={models}
        setModels={setModels}
        selectedModels={['A']}
        setSelectedModels={setSelectedModels}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(setModels).toHaveBeenCalled();
    expect(setSelectedModels).toHaveBeenCalled();
  });

  it('removes model id from selectedModels', () => {
    const models = [
      { id: 'A', name: 'Model A', showInSelector: true }
    ];

    let selected = ['A'];

    const setSelectedModels = (fn) => {
      selected = fn(selected);
    };

    render(
      <ModelManagementPanel
        models={models}
        setModels={jasmine.createSpy('setModels')}
        selectedModels={selected}
        setSelectedModels={setSelectedModels}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(selected).toEqual([]);
  });

  it('adds a custom model with endpoint (J3)', () => {
  let models = [];

  const setModels = (fn) => {
    models = fn(models);
  };

  render(
    <ModelManagementPanel
      models={models}
      setModels={setModels}
      selectedModels={[]}
      setSelectedModels={() => {}}
    />
  );

  fireEvent.click(screen.getByText('+ Add custom model'));
  fireEvent.change(screen.getByPlaceholderText('Model name'), {
    target: { value: 'MyModel' }
  });

  fireEvent.change(screen.getByPlaceholderText('Endpoint (http://...)'), {
    target: { value: 'http://localhost:9999' }
  });


  fireEvent.click(screen.getByText('Add'));

  expect(models.length).toBe(1);
  expect(models[0].name).toBe('MyModel');
  expect(models[0].endpoint).toBe('http://localhost:9999');
  expect(models[0].showInSelector).toBe(true);
});

});
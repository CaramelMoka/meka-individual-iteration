import { render, screen, fireEvent } from '@testing-library/react';
import ModelSelector from './ModelSelector';

const mockModels = [
  { id: 'gemma3:270m', name: 'Gemma', showInSelector: true },
  { id: 'smollm2:135m', name: 'SmolLM', showInSelector: true },
  { id: 'tinyllama', name: 'TinyLlama', showInSelector: false }
];

test('renders only visible models', () => {
  render(
    <ModelSelector
      models={mockModels}
      selectedModels={[]}
      setSelectedModels={() => {}}
    />
  );

  expect(screen.getByText('Gemma')).toBeInTheDocument();
  expect(screen.getByText('SmolLM')).toBeInTheDocument();

  // hidden model should NOT appear
  expect(screen.queryByText('TinyLlama')).toBeNull();
});

test('selecting a model updates selectedModels', () => {
  const setSelectedModels = jest.fn();

  render(
    <ModelSelector
      models={mockModels}
      selectedModels={[]}
      setSelectedModels={setSelectedModels}
    />
  );

  const checkbox = screen.getByLabelText('Gemma');
  fireEvent.click(checkbox);

  expect(setSelectedModels).toHaveBeenCalled();
});

test('unselecting a model removes it from selectedModels', () => {
  const setSelectedModels = jest.fn();

  render(
    <ModelSelector
      models={mockModels}
      selectedModels={['gemma3:270m']}
      setSelectedModels={setSelectedModels}
    />
  );

  const checkbox = screen.getByLabelText('Gemma');
  fireEvent.click(checkbox);

  expect(setSelectedModels).toHaveBeenCalled();
});
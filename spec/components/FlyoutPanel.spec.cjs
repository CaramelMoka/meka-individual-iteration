const React = require('react');
const { render, fireEvent, screen } = require('@testing-library/react');
const FlyoutPanel = require('../../src/components/FlyoutPanel.jsx').default;

describe('FlyoutPanel', () => {
  const mockOnClose = jasmine.createSpy('onClose');
  const mockOnLoginClick = jasmine.createSpy('onLoginClick');

  beforeEach(() => {
    mockOnClose.calls.reset();
    mockOnLoginClick.calls.reset();
    spyOn(window, 'alert').and.stub();
  });

  it('does not render when isOpen is false', () => {
    render(<FlyoutPanel isOpen={false} onClose={mockOnClose} isLoggedIn={false} />);
    expect(screen.queryByText(/Logged in users can save chats/i)).toBeNull();
  });

  it('renders when isOpen is true (logged out)', () => {
    render(<FlyoutPanel isOpen={true} onClose={mockOnClose} isLoggedIn={false} />);
    expect(screen.getByText(/Logged in users can save chats/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /\?/i })).toBeTruthy();
  });

  it('renders when isOpen is true (logged in)', () => {
    render(<FlyoutPanel isOpen={true} onClose={mockOnClose} isLoggedIn={true} />);
    // Logged-out elements should not be present
    expect(screen.queryByText(/Logged in users can save chats/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Log in/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /\?/i })).toBeNull();
  });

  it('calls onClose and onLoginClick when login button is clicked', () => {
    render(
      <FlyoutPanel
        isOpen={true}
        onClose={mockOnClose}
        isLoggedIn={false}
        onLoginClick={mockOnLoginClick}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  it('calls onClose when close button inside panel is clicked', () => {
    render(<FlyoutPanel isOpen={true} onClose={mockOnClose} isLoggedIn={false} />);
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<FlyoutPanel isOpen={true} onClose={mockOnClose} isLoggedIn={false} />);
    // The overlay doesn't have a role, so we select it by test id
    // (Make sure FlyoutPanel has data-testid="flyout-overlay" on the overlay div)
    const overlay = screen.getByTestId('flyout-overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
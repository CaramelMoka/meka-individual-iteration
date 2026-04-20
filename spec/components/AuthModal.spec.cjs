const React = require('react');
const { render, fireEvent, screen, waitFor } = require('@testing-library/react');

const AuthModal = require('../../src/components/AuthModal.jsx').default;

describe('AuthModal', () => {
  const mockOnClose = jasmine.createSpy('onClose');
  const mockOnLoginSuccess = jasmine.createSpy('onLoginSuccess');

  const defaultFetch = global.fetch;

  beforeEach(() => {
    mockOnClose.calls.reset();
    mockOnLoginSuccess.calls.reset();
    global.fetch = defaultFetch;
  });

  afterAll(() => {
    global.fetch = defaultFetch;
  });

  it('does not render when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Welcome to Meka/i)).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/Welcome to Meka/i)).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Log In')).toBeTruthy();
    expect(screen.getByText('Create Account')).toBeTruthy();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  describe('Login flow', () => {

    it('calls fetch and logs user in successfully', async () => {
      const mockFetch = jasmine.createSpy('fetch').and.callFake(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ username: 'testuser' })
        })
      );

      global.fetch = mockFetch;

      render(
        <AuthModal
          isOpen={true}
          onClose={mockOnClose}
          onLoginSuccess={mockOnLoginSuccess}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'testuser' }
      });

      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'secret' }
      });

      fireEvent.click(screen.getByText('Log In'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/login',
          jasmine.objectContaining({ method: 'POST' })
        );
      });

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith({ username: 'testuser' });
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('shows error message when login fails', async () => {
      const mockFetch = jasmine.createSpy('fetch').and.callFake(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid credentials' })
        })
      );

      global.fetch = mockFetch;

      render(
        <AuthModal
          isOpen={true}
          onClose={mockOnClose}
          onLoginSuccess={mockOnLoginSuccess}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'bad' }
      });

      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'wrong' }
      });

      fireEvent.click(screen.getByText('Log In'));

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeTruthy();
      });

      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Registration flow', () => {

    it('calls fetch when registering', async () => {
      const mockFetch = jasmine.createSpy('fetch').and.callFake(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ username: 'newuser' })
        })
      );

      global.fetch = mockFetch;

      spyOn(window, 'alert').and.stub();

      render(
        <AuthModal
          isOpen={true}
          onClose={mockOnClose}
          onLoginSuccess={mockOnLoginSuccess}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'newuser' }
      });

      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'secret' }
      });

      fireEvent.click(screen.getByText('Create Account'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/register',
          jasmine.objectContaining({ method: 'POST' })
        );
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('shows error message if registration fails', async () => {
      const mockFetch = jasmine.createSpy('fetch').and.callFake(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Username already exists' })
        })
      );

      global.fetch = mockFetch;

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'existing' }
      });

      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'secret' }
      });

      fireEvent.click(screen.getByText('Create Account'));

      await waitFor(() => {
        expect(screen.getByText(/Username already exists/i)).toBeTruthy();
      });
    });

  });

});

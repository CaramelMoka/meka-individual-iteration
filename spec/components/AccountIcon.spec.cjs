const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const AccountIcon = require('../../src/components/AccountIcon').default; 

describe('AccountIcon', () => {
  it('shows login button when logged out', () => {
    const { getByText } = render(
      <AccountIcon isLoggedIn={false} onLoginClick={() => {}} />
    );
    expect(getByText(/👤 Login/i)).toBeTruthy(); 
  });

  it('shows logout button when logged in', () => {
    const { getByText } = render(
      <AccountIcon isLoggedIn={true} onLogout={() => {}} />
    );
    expect(getByText(/Log Out/i)).toBeTruthy();
  });

  it('calls onLoginClick when login button is clicked', () => {
    const handleClick = jasmine.createSpy('onLoginClick');
    const { getByText } = render(
      <AccountIcon isLoggedIn={false} onLoginClick={handleClick} />
    );
    fireEvent.click(getByText(/👤 Login/i));
    expect(handleClick).toHaveBeenCalled();
  });
});
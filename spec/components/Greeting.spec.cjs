const React = require('react');
const { render } = require('@testing-library/react');
const Greeting = require('../../src/components/Greeting').default;

describe('Greeting component', () => {
  it('displays generic greeting when no username is provided', () => {
    const { getByText } = render(<Greeting />);
    const greetingElement = getByText((content, element) => {
      return element.tagName === 'H2' && content.includes('Good ') && content.includes('User');
    });
    expect(greetingElement).toBeTruthy();
  });

  it('displays the username when provided', () => {
    const { getByText } = render(<Greeting username="Group15" />);
    const greetingElement = getByText((content, element) => {
      return element.tagName === 'H2' && content.includes('Good ') && content.includes('Group15');
    });
    expect(greetingElement).toBeTruthy();
  });
});
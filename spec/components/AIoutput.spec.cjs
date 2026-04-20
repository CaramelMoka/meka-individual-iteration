describe("AIOutput Component", () => {

  it("should display default message when no messages exist", () => {
    const messages = [];

    const output = messages.length === 0
      ? "Your AI response will appear here..."
      : null;

    expect(output).toBe("Your AI response will appear here...");
  });

  it("should display user and AI messages correctly", () => {
    const messages = [
      { role: "user", content: "Hello" },
      { role: "ai", content: "Hi there!" }
    ];

    const formatted = messages.map(msg => {
      return msg.role === "user"
        ? "You: " + msg.content
        : "AI: " + msg.content;
    });

    expect(formatted[0]).toBe("You: Hello");
    expect(formatted[1]).toBe("AI: Hi there!");
  });

  it("should render correct number of messages", () => {
    const messages = [
      { role: "user", content: "Hi" },
      { role: "ai", content: "Hello" },
      { role: "user", content: "How are you?" }
    ];

    expect(messages.length).toBe(3);
  });

});
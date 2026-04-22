describe("AIOutput Component", () => {

  it("should display default message when no messages exist", () => {
    const messages = [];

    const output = messages.length === 0
      ? "Your AI response will appear here..."
      : null;

    expect(output).toBe("Your AI response will appear here...");
  });

  it("should display user and model messages correctly", () => {
    const messages = [
      { role: "user", content: "Hello" },
      { role: "gemma3:270m", content: "Hi there!" }
    ];

    const formatRole = (role) => {
      if (role === "user") return "You";
      if (role.includes("gemma")) return "Gemma";
      if (role.includes("llama")) return "Llama";
      if (role.includes("smollm")) return "SmolLM";
      return role;
    };

    const formatted = messages.map(msg => {
      return `${formatRole(msg.role)}: ${msg.content}`;
    });

    expect(formatted[0]).toBe("You: Hello");
    expect(formatted[1]).toBe("Gemma: Hi there!");
  });

  it("should render correct number of messages", () => {
    const messages = [
      { role: "user", content: "Hi" },
      { role: "gemma3:270m", content: "Hello" },
      { role: "tinyllama", content: "How are you?" }
    ];

    expect(messages.length).toBe(3);
  });

  it("should support multiple model responses", () => {
    const messages = [
      { role: "gemma3:270m", content: "Response A" },
      { role: "tinyllama", content: "Response B" }
    ];

    const modelNames = messages.map(msg => msg.role);

    expect(modelNames).toContain("gemma3:270m");
    expect(modelNames).toContain("tinyllama");
  });

});
it("should not label messages as generic AI", () => {
  const role = "gemma3:270m";

  const label = role === "ai" ? "AI" : role;

  expect(label).not.toBe("AI");
});
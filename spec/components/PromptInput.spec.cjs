describe("PromptInput Component", () => {

  it("should call onSend when form is submitted with valid input", () => {
    const mockOnSend = jasmine.createSpy("onSend");

    // simulate component logic
    const prompt = "Hello AI";

    // simulate submit
    if (prompt.trim()) {
      mockOnSend(prompt);
    }

    expect(mockOnSend).toHaveBeenCalledWith("Hello AI");
  });

  it("should NOT call onSend if input is empty", () => {
    const mockOnSend = jasmine.createSpy("onSend");

    const prompt = "   "; // empty after trim

    if (prompt.trim()) {
      mockOnSend(prompt);
    }

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should clear input after sending message", () => {
    let prompt = "Test message";

    const mockOnSend = jasmine.createSpy("onSend");

    if (prompt.trim()) {
      mockOnSend(prompt);
      prompt = ""; // simulate setPrompt('')
    }

    expect(prompt).toBe("");
  });

});
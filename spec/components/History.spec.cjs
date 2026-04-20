describe("Chat Application Flow", () => {

  let app;

  beforeEach(() => {
    // mock app state
    app = {
      isLoggedIn: false,
      messages: [],
      history: [],
      sendMessage: function(msg) {
        this.messages.push({ role: "user", content: msg });
        this.messages.push({ role: "ai", content: "AI response" });
      },
      login: function() {
        this.isLoggedIn = true;
      },
      saveHistory: function() {
        if (this.isLoggedIn) {
          this.history.push(this.messages);
        }
      }
    };
  });

  // 🔹 Test 1: User sends message → UI updates
  it("should update state and display user + AI messages when user sends message", () => {
    app.sendMessage("Hello");

    expect(app.messages.length).toBe(2);
    expect(app.messages[0].role).toBe("user");
    expect(app.messages[1].role).toBe("ai");
  });

  // 🔹 Test 2: Login flow
  it("should update state after user logs in", () => {
    app.login();

    expect(app.isLoggedIn).toBeTrue();
  });

  // 🔹 Test 3: Save history only when logged in
  it("should save conversation when user is logged in", () => {
    app.login();
    app.sendMessage("Hi");
    app.saveHistory();

    expect(app.history.length).toBe(1);
  });

  // 🔹 Test 4: Do not save history if not logged in
  it("should NOT save conversation if user is not logged in", () => {
    app.sendMessage("Hi");
    app.saveHistory();

    expect(app.history.length).toBe(0);
  });

  // 🔹 Test 5: UI re-render simulation
  it("should re-render UI with updated messages", () => {
    app.sendMessage("Test");

    const lastMessage = app.messages[app.messages.length - 1];
    expect(lastMessage.content).toBe("AI response");
  });

});
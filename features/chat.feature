Feature: LLM Chat Integration and Chat History

  @chat
  Scenario: User sends a message and receives an LLM response
    Given the user is on the chat page
    When the user enters a message and submits
    Then the system sends the message to the LLM
    And the user receives a response
    And the response is displayed in the chat UI

  @chat
  Scenario: Chat history persists after refresh
    Given a registered user exists
    And the user is logged in
    And the user has an existing conversation
    When the user refreshes the page
    Then previous messages should be loaded
    And displayed in the correct order

  @chat
  Scenario: Conversation maintains context
    Given the user has sent a previous message
    When the user sends a follow-up message
    Then the LLM receives the full conversation context
    And responds based on prior messages

  @chat
  Scenario: Empty message is not sent
    Given the user is on the chat page
    When the user submits an empty message
    Then the message is not sent
    And an error message is shown

  @chat
  Scenario: Loading indicator appears during response
    Given the user sends a message
    When the system is waiting for the LLM response
    Then a loading indicator is displayed

  @chat
  Scenario: Handle LLM API failure
    Given the user sends a message
    When the LLM API fails
    Then an error message is displayed
    And the system does not crash

  @chat
  Scenario: Messages are displayed in order
    Given multiple messages exist
    When they are displayed
    Then they should appear in chronological order

  


Feature: Model Selection

  Scenario: User selects multiple models
    Given the user is on the chat interface
    And the model selector displays available models
    When the user selects "Gemma"
    And the user selects "SmolLM"
    Then both models should be selected
    And both models should be sent in the request


  Scenario: Responses from multiple models are displayed
    Given the user has selected multiple models
    When the user sends a prompt
    Then responses from all selected models should be returned
    And each response should be displayed separately
    And each response should show the correct model name


  Scenario: Hidden models are not shown in selector
    Given a model has showInSelector set to false
    When the ModelSelector is rendered
    Then the hidden model should not appear
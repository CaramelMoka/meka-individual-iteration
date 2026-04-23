Feature: Model Management

  Scenario: User can view available models (J1)
    Given the model management panel is loaded
    Then I should see "Model A"
    And I should see "Model B"

  Scenario: User can enable or disable models (J2)
    Given the model management panel is loaded with "Model A" selected
    When I toggle "Model A"
    Then "Model A" should be removed from selected models
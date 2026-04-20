Feature: Landing Page

Scenario: Visitor views the landing page
  Given the visitor opens the application
  When the landing page loads
  Then the visitor should see a greeting message
  And the visitor should see a prompt input field

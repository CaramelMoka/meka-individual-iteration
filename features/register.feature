Feature: Account Creation

Scenario: New user creates an account
  Given the user opens the registration form
  When the user enters valid registration information
  Then the system should create a new account

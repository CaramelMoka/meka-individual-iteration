Feature: User Login

Scenario: Registered user logs in successfully
  Given a registered user exists
  When the user enters valid login credentials
  Then the user should access the interface

Feature: User Logout

Scenario: Logged in user logs out
  Given the user is logged in
  When the user clicks the logout button
  Then the user should be logged out

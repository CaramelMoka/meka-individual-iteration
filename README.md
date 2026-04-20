# Meka
AI Agent built for Rutgers Software Engineering Class Spring 2026

# Team (iteration 1)
Requirements: Yiwen Cai  
Development: Shivraj Nath  
Testing: Zohaib Ahmed, Muhammad Nazir


# Metadata
**Application Name:** meka  
## Core Features for Iteration 1:
- Landing page
- User account creation
- Login/Logout

## Core Features for Iteration 2:
- Chat Interface
- Fly out panel  
- Conversation History  
- Search box

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Testing:** Jasmine, Cucumber.js, Puppeteer

## User Stories and Features

### Identified Stories for Iteration 1
| # | User Story | Function | Points Assigned |
|---|------------|----------|-----------------|
| A | As a visitor, I want to see a landing page that explains the tool, so I can understand the application | Home Page | 2 |
| B | As a new user, I want to create an account, so I can access the interface | Account Creation | 3 | 
| C | As a registered user, I want to login to my preexisting account, so that I can access the interface | Log-In | 3 |
| D | As a logged-in user, I want to be able to log out, so that my session is securely ended | Log-Out | 1 | 

Total effort: 2 + 3 + 3 + 1 = 9 points.  
These stories deliver a basic interface with a landing page and user authentication.

### Identified Stories for Iteration 2
| #  | User Story                                                                                                                 | Function                  | Points |
| -- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| E1 | As a user, I want to enter a prompt in a chat input box, so that I can send a question to the LLM                          | Send Prompt               | 2      |
| E2 | As a user, I want to receive a response from the LLM after submitting a prompt, so that I can get answers                  | Receive Response          | 2      |
| F  | As a logged-in user, I want my conversations to be saved automatically after each message, so that I can review them later | Save Conversation History | 2      |
| G1 | As a logged-in user, I want to search conversations by keyword, so that I can find relevant chats                          | Search by Keyword         | 2      |
| G2 | As a logged-in user, I want to see a list of matching conversations, so that I can choose one to view                      | Display Search Results    | 1      |
| H  | As a logged-in user, I want to reopen a previous conversation, so that I can continue chatting in the same thread          | Continue Conversation     | 2      |


Total effort: 2+2+2+2+1+2 = 11 points.   
These stories allow users to interact with the LLM and manage their conversation history.


# StackOverflow
This is an academic project.
# Client Requirements
The client UI will have the following routes:
- SignUp page
- SignIn page
-> Home page: Show a list of posts (texts/code snippets)
-> Notification page: should show notifications of recent posts
Clicking on the notification should show the post
# Server requirements
APIS
- /signup endpoint for registering new users
user signs up with email and password
- /signin endpoint for signing into the system
user signs in with email and password
- /post endpoint for creating and retrieving posts
GET: Get latest posts of all users except logged in user
POST: Create new posts for user
- /notification endpoint for creating and retrieving notifications
GET: Get notifications
POST: Create notification against a post
- Jobs
Notification cleaner: A job should periodically check for old notifications and delete them.
# System assumptions
The system needs no other services (e.g. comments, votes etc.)

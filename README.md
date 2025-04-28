# user-auth-system
A User Authentication System



ENDPOINT | TEST CASE | EXPECTED RESULT
-------|----------|-------------------
POST /api/auth/signup | Valid credentials |	Create a new user
 |	Duplicate email	 |	400 Bad Request
 |	Invalid email format	 |	400 + validation error
GET |	/api/v1/love-island/user/:id |	Get a single user's details
DELETE |	/api/v1/love-island/user/:id |	Delete a user profile
POST |	/api/v1/love-island/user/:id/report |	Report a user profile
POST |	/api/v1/love-island/user/:id/love-request |	Send a love request
POST |	/api/v1/love-island/user/:id/gift |	Gift a user on their birthday
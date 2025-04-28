# user-auth-system
A User Authentication System



ENDPOINT | TEST CASE | EXPECTED RESULT
-------|----------|-------------------
POST /api/auth/signup | Valid credentials |	Create a new user
       |	Duplicate email	 |	400 Bad Request
       |	Invalid email format	 |	400 + validation error
POST /api/auth/login	 |	Correct credentials	 |	200 OK + JWT
       |	Incorrect password	 |	401 Unauthorized
       |	Nonexistent email	 |	401 (obfuscated response)
GET /api/users/profile	 |	Valid JWT	 |	200 + user data
       |	Expired/malformed JWT	 |	401 Unauthorized
       |	No Authorization header	|	401 Unauthorized
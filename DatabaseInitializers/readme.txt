Database initialization order is important.
At first run login with Admin user first!

In any case, databases can be dropped freely, if an error occurs and will be re-created.

- In case of invalid initialization order, it can happen, that the JoggingApp database gets created without the ASPNet_Identity database created first and the creation of the V_User view will fail.
- The database initializer cannot continue initiating a half created database.
- 10k rows are added to the JoggingApp database, be patient. (1-2 mins max.)

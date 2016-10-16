# restify
Creating a basic API REST using restify module

## RESTful API

| url                     | method   | status    | description                     | params             |
| ----------------------- | -------- | --------- |-------------------------------- | ------------------ |
| /                       | GET      | 200       | return Hello World              |                    |
| /movie                  | POST     | 201       | creates a new movie             | <ul><li>_id</li><li>title</li><li>year</li></ul> |
| /movie                  | GET      | 200       | return all movies               |                    |
| /movie/:id              | GET      | 200       | return a specific movie         |                    |
| /movie/:id              | PUT      | 200       | modifies a movie                | <ul><li>_id</li><li>title</li><li>year</li></ul> |
| /movie/:id              | DELETE   | 400       | remove a movie                  |                    |
| /user                   | POST     | 201       | creates a new user              | <ul><li></li></ul> |
| /user/:id               | GET      | 200       | return a specific user          |                    |
| /user/:id               | PUT      | 200       | modifies user data              | <ul><li></li></ul> |
| /user/:id               | DELETE   | 400       | remove a user                   |                    |
| /auth                   | POST     | 201       | user authentication with tokens | <ul><li></li></ul> |

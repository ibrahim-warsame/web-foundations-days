# Library API Design

A RESTful API for a library's **books** resource. The resource is named with a plural noun (`/books`), the HTTP method says what to do, and a single book is addressed by its id (`/books/42`).

## The book resource

A book looks like this in JSON:

```json
{
  "id": 42,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "isbn": "9780385474542",
  "publishedYear": 1958,
  "available": true
}
```

- `id` is created by the server, and the client never sends it
- `title` and `author` are required text
- `isbn` is a 10 or 13 digit text string
- `publishedYear` is a whole number
- `available` is `true` when the book is on the shelf

## Endpoints

### 1. List all books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns every book in the library.
- **Request body:** none
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** `GET`
- **Path:** `/books/{id}`, for example `/books/42`
- **Description:** Returns the single book with that id.
- **Request body:** none
- **Success status:** `200 OK`

### 3. Create a book

- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book. The server chooses the id and returns the new book.
- **Request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958
  }
  ```

- **Success status:** `201 Created`

### 4. Replace a book

- **Method:** `PUT`
- **Path:** `/books/{id}`, for example `/books/42`
- **Description:** Replaces the whole book with the new version, so every field must be sent.
- **Request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958,
    "available": false
  }
  ```

- **Success status:** `200 OK`

### 5. Update part of a book

- **Method:** `PATCH`
- **Path:** `/books/{id}`, for example `/books/42`
- **Description:** Changes only the fields that are sent and leaves the rest alone.
- **Request body:**

  ```json
  {
    "available": false
  }
  ```

- **Success status:** `200 OK`

### 6. Delete a book

- **Method:** `DELETE`
- **Path:** `/books/{id}`, for example `/books/42`
- **Description:** Removes the book from the library.
- **Request body:** none
- **Success status:** `204 No Content` (the book is gone, so there is nothing to send back)

### 7. List books by an author

- **Method:** `GET`
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns only the books written by that author. The author goes in a query parameter after the `?`, and spaces are written as `%20`.
- **Request body:** none
- **Success status:** `200 OK` (an author with no books gets `200` and an empty list `[]`)

## Error codes

### 400 Bad Request

The request itself is invalid, so the server refuses it.

- **When it happens:** `POST /books` is sent without a `title`, or with `"publishedYear": "last year"` (text instead of a number).
- **Example error response:**

  ```json
  {
    "error": "Bad Request",
    "message": "title is required"
  }
  ```

### 404 Not Found

The URL is valid, but the book it points to does not exist.

- **When it happens:** `GET /books/9999` when no book has the id 9999. The same happens for `PATCH` and `DELETE` on a missing id.
- **Example error response:**

  ```json
  {
    "error": "Not Found",
    "message": "No book with id 9999"
  }
  ```

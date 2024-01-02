# NoteTaking Api

RESTful API for a simple note-taking application using Node.js and Express.js, with MongoDB
as the database. The API allow users to register and login to create, retrieve, update, and delete text notes which they have authorized access.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Install dependencies
   ```
   npm install
   ```
3. Create .env file with refrence to .env.sample
4. Run to Start server
   ```
   npm run dev
   ```
5. Run test
   ```
   npm run test
   ```

## Endpoints

### 1. Register User

- Method: POST
- Request Body : {username : required, password : required}

```
Path: http://localhost:3000/api/v1/users/register
```

- response :

```
{
    "statusCode": 201,
    "data": {
        "_id": "6593c4694bf793e2fd11e6e7",
        "username": "abcdef",
        "notes": [],
        "createdAt": "2024-01-02T08:08:09.193Z",
        "updatedAt": "2024-01-02T08:08:09.193Z",
        "__v": 0
    },
    "message": "New User registered Successfully",
    "success": true
}
```

### 2. Login User

- Method: POST
- Request Body : {username : required, password : required}

```
Path: http://localhost:3000/api/v1/users/login
```

- response :

```
{
    "statusCode": 201,
    "data": {
        "_id": "6593c4694bf793e2fd11e6e7",
        "username": "abcdef",
        "notes": [],
        "createdAt": "2024-01-02T08:08:09.193Z",
        "updatedAt": "2024-01-02T08:08:09.193Z",
        "__v": 0
    },
    "message": "New User registered Successfully",
    "success": true
}
```

# Authenticated Routes only

### 3. Logout User

- Method: POST

```
Path: http://localhost:3000/api/v1/users/logout
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "6593c4694bf793e2fd11e6e7",
        "username": "abcdef",
        "notes": [],
        "createdAt": "2024-01-02T08:08:09.193Z",
        "updatedAt": "2024-01-02T08:12:07.614Z",
        "__v": 0,
    },
    "message": "User Logged Out",
    "success": true
}
```

### 4. Create Note

- Method: POST
- Request Body : {title : required, content : required}

```
Path: http://localhost:3000/api/v1/notes/createnote
```

- response :

```
{
    "statusCode": 201,
    "data": {
        "title": "backend stack development",
        "content": "A backend web developer is a person who can develop both client and server software. In addition to mastering",
        "owner": "6593c4694bf793e2fd11e6e7",
        "_id": "6593c6b126b22ccf90ae47c8",
        "createdAt": "2024-01-02T08:17:53.982Z",
        "updatedAt": "2024-01-02T08:17:53.982Z",
        "__v": 0
    },
    "message": "new note created",
    "success": true
}
```

### 5. Get Note (option 1 => ALL)

- Method: GET

```
Path: http://localhost:3000/api/v1/notes/getnotes
```

- response :

```
{
    "statusCode": 200,
    "data": [
        {
            "_id": "6593c6b126b22ccf90ae47c8",
            "title": "backend stack development",
            "content": "A backend web developer is a person who can develop both client and server software. In addition to mastering",
            "owner": "6593c4694bf793e2fd11e6e7",
            "createdAt": "2024-01-02T08:17:53.982Z",
            "updatedAt": "2024-01-02T08:17:53.982Z",
            "__v": 0
        }
    ],
    "message": "Successfully retrived all Notes",
    "success": true
}
```

### 6. Get Note (option 2 => id)

- Method: GET
- Request Parmas : noteid

```
Path: http://localhost:3000/api/v1/notes/getnotes/noteid
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "6593c6b126b22ccf90ae47c8",
        "title": "backend stack development",
        "content": "A backend web developer is a person who can develop both client and server software. In addition to mastering",
        "owner": "6593c4694bf793e2fd11e6e7",
        "createdAt": "2024-01-02T08:17:53.982Z",
        "updatedAt": "2024-01-02T08:17:53.982Z",
        "__v": 0
    },
    "message": "Single note Successfully retrived",
    "success": true
}
```

### 7. Update Note

- Method: PATCH
- Request Body: { title : optional, content : optional }
- Request Parmas : noteid (reequired)

```
Path: http://localhost:3000/api/v1/notes/updatenote/noteid
```

- response :

```
{
    "statusCode": 200,
    "data": {
        "_id": "6593c6b126b22ccf90ae47c8",
        "title": "nodejs development",
        "content": "A backend web developer is a person who can develop both client and server software. In addition to mastering",
        "owner": "6593c4694bf793e2fd11e6e7",
        "createdAt": "2024-01-02T08:17:53.982Z",
        "updatedAt": "2024-01-02T08:26:04.481Z",
        "__v": 0
    },
    "message": "note successfully updated",
    "success": true
}
```

### 8. Delete Note

- Method: DELETE
- Request Parmas : noteid (reequired)

```
Path: http://localhost:3000/api/v1/notes/deletenote/noteid
```

- response :

```
{
    "statusCode": 200,
    "data": {},
    "message": "note deleted",
    "success": true
}
```

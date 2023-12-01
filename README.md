# Node.js RESTful API with TypeScript and MongoDB

This project is a simple RESTful API built with Node.js and TypeScript, using MongoDB as the database. It provides endpoints to create and manage products in a store.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Features
- Create, read, and manage products in a store.
- Token-based authentication for secure endpoints.
- TypeScript for enhanced code quality and maintainability.
- MongoDB for efficient data storage.
- Redis for caching.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB server running locally or provide a connection URI.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RealRichi3/mainstack_backend_test
   ```
   
2. Install dependencies:

   ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
```
PORT=3000

MONGO_URI=mongodb://localhost:27017/mainstack_backend_test

JWT_SECRET=secret
```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Navigate to `http://localhost:3000/api/v1` to access the API.


## Endpoints

| Method | Endpoint           | Description                           | Authentication |
| ------ | ------------------ | ------------------------------------- | -------------- |
| POST   | `/auth/register`   | Register a new user                   | No             |
| POST   | `/auth/login`      | Login with an existing user           | No             |
| GET    | `/products`        | Get all products                      | No             |
| GET    | `/products/:id`    | Get a single product by ID            | No             |
| POST   | `/products`        | Create a new product                  | Yes            |
| PUT    | `/products/:id`    | Update an existing product by ID      | Yes            |
| DELETE | `/products/:id`    | Delete an existing product by ID      | Yes            |

## Authentication

Some endpoints require authentication. To authenticate a request, add the `Authorization` header with the value `Bearer <token>`, where `<token>` is the access token returned from the login endpoint.
Redis cache is used to store the token. The access token expires after 1 hour, and the refresh token expires after 1 week.

## Environment
Create a .env file in the root directory and add the following environment variables:
```bash
NODE_ENV=DEV
MONGO_URI_DEV=<A hosted mongodb database>
MONGO_URI_LOG=<A hosted mongodb database>
REDIS_URL=redis://redis:6379
JWT_SECRET=<secret>
```

The `REDIS_URL` is the url to the redis server. If you are running the redis server within docker, you can use `redis://redis:6379` as the value.``

## Testing
Create a .env.test file in the root directory and add the following environment variables:
```bash
NODE_ENV=TEST
MONGO_URI_TEST=<A hosted mongodb database>
MONGO_URI_LOG=<A hosted mongodb database>
REDIS_URL=redis://redis:6379
JWT_SECRET=<secret>
```

To run the tests, run the following command:
```bash
npm run test
```

## Docker
To run the app in a docker container, run the following command:
```bash
docker-compose up
```



# Introduction

I use Microservice approach for this project

for this reason, implement 4 section

- api-gateway: communication with RestAPI
- files-microservice: manage and work with files and storage
- mailer-microservice: send mail
- users-microservie: manage users; **I tried to use DDD in this module**

These services are connected to each other using RabbitMQ

# Summary Of The Tasks

## Implement POST /api/users

It receives a POST request with JSON data type, and if the user's email is not duplicated, it stores the information in the database and call event and sends a email.

- ### Sample input data:
  ```
  "name": "hamid",
  "familyName": "aboutalebi",
  "emailAddress": "hamid@test3.com",
  "password": "{VALID_PASSWORD}"
  ```

## Implement GET /api/user/userId

Getting a user's ID and retrieving its information from the _reqres.in_ site

## Implement POST /api/files/{userId}/avatar

Save the avatar file of the specified user (userId) on the disk, and file info to database.

## Implement GET /api/user/{userId}/avatar

Display the desired user's avatar file

## Implement DELETE /api/user/{userId}/avatar

Delete the desired user's avatar file from the disk and its information from the database.

## Installation

```
$ npm install
```

## Configs

- Change .env file with valid mongodb and rabbitmq info

## Running the app

**Please Start All Services**

- ### start API-Gateway
  ```
  nest start api-gateway
  ```
- ### start Files-Microservice
  ```
  nest start files-microservice
  ```
- ### start Mailer-Microservice
  ```
  nest start files-microservice
  ```
- ### start Users-Microservice
  ```
  nest start users-microservice
  ```

## Test

```
$ npm run test
```

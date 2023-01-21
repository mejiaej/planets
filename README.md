## First steps

- create `.env file` with content:
  ```
  #App
  APPLICATION=
  NODE_ENV=development
  PORT=3000
  PREFIX=

  #Database
  DB_TYPE=
  DB_HOST=
  DB_PORT=
  DB_USER=
  DB_PASS=
  DB_NAME=
  DATABASE_URL=${DB_TYPE}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}

  # Kafka
  KAFKA_CLIENT_ID=
  KAFKA_GROUP_ID=
  KAFKA_TOPIC=
  KAFKA_BROKER=
  KAFKA_USER=
  KAFKA_PASS=
  ```

- run the app

  ```sh
  # To start working, install dependencies:
  $ npm install

  # run the app
  $ npm run start
  ````

Avoid using watch mode `npm run start:dev` the first times, there is an issue with nodemon detecting file changes and re-running repetitively, it fixes itself once you wait enough re-runs. My guess is that this is related to SqlLite in memory db triggering reruns.

## Notes

- I'm using a [static token](https://github.com/mejiaej/planets/blob/6241e4208cef7f2d9225199c8fe17542aa682e4d/src/core/guards/auth.guard.ts#L9) `5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA`
- Fetch and Delete endpoints return `404` if not found, including deleted ones. And returns `401` if Bearer token not present or invalid.
- List by name applies a exat name match strategy (===)
- List endpoint doesn't consider planets when [deletedAt is not null](https://github.com/mejiaej/planets/blob/6241e4208cef7f2d9225199c8fe17542aa682e4d/src/db/prisma/services/prisma.service.ts#L36-L45).
- Deletes are intercepted and replaced by a [soft delete](https://github.com/mejiaej/planets/blob/6241e4208cef7f2d9225199c8fe17542aa682e4d/src/db/prisma/services/prisma.service.ts#L60-L83).

### List Endpoint

List planets (will return first 5 entries)

```
curl --request GET \
  --url http://localhost:3000/planets
```

List planets (will return the next 5 entries)

```
curl --request GET \
  --url 'http://localhost:3000/planets?skip=5&take=5'
```

List by name

```
curl --request GET \
  --url 'http://localhost:3000/planets?name=Tatooine'
```

### Fetch Endpoint

Fetch planet with id 2

```
curl --request GET \
  --url http://localhost:3000/planets/2 \
  --header 'Authorization: Bearer 5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA'
```

returns `404` if not found

### Delete Endpoint

```
curl --request DELETE \
  --url http://localhost:3000/planets/2 \
  --header 'Authorization: Bearer 5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA'
```

returns `404` if not found

### Test

I created integration/e2e tests for the [planet enpoints](https://github.com/mejiaej/planets/blob/main/src/resources/planet/test/planets.e2e-spec.spec.ts).

Run tests

```
npm test
```

BTW, tests are connected to the same database, so running tests might modify the current database. In a real scenario we'll have a separate db for integration test runs.

## Overview

RESTful API that returns a list of Star Wars planets and their information from a local SQLite DB.

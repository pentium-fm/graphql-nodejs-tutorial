# graphql-nodejs-tutorial
Join me to learn more: https://www.twitch.tv/jefferyhus

## Instalation
```
$ git clone https://github.com/JefferyHus/graphql-nodejs-tutorial.git
$ cd graphql-nodejs-tutorial
$ npm install
```

Rename the file `knexfile.js.example` to 	`knexfile.js` and edit the section `development` with you database information

```
development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
```
After this let's migrate aand run the app
```
$ knex migrate:latest
$ node app.js
```
Enjoy

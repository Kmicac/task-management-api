<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Project Setup


1. Clone the project
```bash
git clone https://github.com/Kmicac/task-management-api.git
```

2. Navigate to the project directory
```
cd task-management-api
```

3. Install the dependencies 
```
yarn install
```

4. Duplicate the file ```.env.template``` and rename it ```.env```

5. Update the environment variables

6. Start the database
```
docker-compose up -d
```

7. Launch the server
 ```
 yarn start:dev
 ```

## Runing Tests

1. Ensure that your database is running.

2. Run the tests with the following command:

```
yarn test
```

To run tests in watch mode, use:
```
yarn test
```


For coverage information, execute:
```
yarn test:cov
```

## Api Documentation

You can view the API documentation using Swagger. After starting the server, navigate to:
```
http://localhost:3000/api
```

This will display the Swagger UI, where you can explore all available endpoints, request/response structures, and error codes.
# Movie Api
An Express API to interact with AWS DynamoDB service written in TypeScript.

![CI Build](https://github.com/DeepakChoudhari/movie-api/workflows/CI%20Build/badge.svg)

<hr>

## DynamoDB Local Setup
Use `docker-compose.yml` file to launch local version of DynamoDB if you don't have access to AWS DynamoDB instance.

You might have to give permissions to `./docker/dynamodb` folder that local DynamoDB uses as data file. Use following command to do so  -

`chmod 777 -R ./docker/dynamodb`

Once above steps have been taken care of, use below command to launch DynamoDB container locally -

`docker-compose up`

Next, to create a table (`Movies`) locally, use the following command. This command uses `year` as HASH/Primary key and `title` as RANGE/Sort key.

`aws dynamodb create-table --table-name Movies --attribute-definitions AttributeName=year,AttributeType=N AttributeName=title,AttributeType=S --key-schema AttributeName=year,KeyType=HASH AttributeName=title,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --tags Key=Project,Value=movie-api --endpoint-url http://localhost:8000`

To confirm if tables have been created, run the command below -

`aws dynamodb list-tables --endpoint-url http://localhost:8000`

## Running application locally
Once you clone the project in your local machine, install `npm` packages using `npm ci`. And run the application using `npm run start:dev`.
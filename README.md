# DynamoDB CRUD with Node.js and Typescript

Simple project that models a one-to-many relationship in AWS DynamoDB

- Project works right now
- User 1 -> 0..n Orders
- Does full lifecycle CRUD on creating the Table and Users/Orders
- Uses Typescript Node.js
- Uses AWS SDK for Node.js v3 (latest)

To compile and run:

```bash
npx tsc
node dist/yourEntryPoint.js

export AWS_PROFILE=<Your AWS PROFILE NAME HERE>
npx tsc
node dist/dynamodb-table-ops.ts
```

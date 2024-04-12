import {
  DynamoDBClient,
  CreateTableCommand,
  UpdateTableCommand,
  DeleteTableCommand,
  AttributeDefinition,
  KeySchemaElement,
  ScalarAttributeType,
  KeyType,
  ProjectionType,
} from '@aws-sdk/client-dynamodb';

const TABLE_NAME = 'UserOrders';

const client = new DynamoDBClient({
  region: 'us-east-1',
});

async function createTable() {
  const params = {
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' as KeyType },
      { AttributeName: 'SK', KeyType: 'RANGE' as KeyType },
    ] as KeySchemaElement[],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' as ScalarAttributeType },
      { AttributeName: 'SK', AttributeType: 'S' as ScalarAttributeType },
    ] as AttributeDefinition[],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const result = await client.send(new CreateTableCommand(params));
    console.log('Table Created', result);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function deleteTable() {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const command = new DeleteTableCommand(params);
    const response = await client.send(command);
    console.log('Table Deleted:', response);
  } catch (error) {
    console.error('Error deleting table:', error);
  }
}

async function addGSI(indexName: string) {
  const params = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: 'EntityType', AttributeType: 'S' as ScalarAttributeType }],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: indexName,
          KeySchema: [{ AttributeName: 'EntityType', KeyType: 'HASH' as KeyType }],
          Projection: {
            ProjectionType: 'ALL' as ProjectionType,
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    ],
  };

  try {
    const result = await client.send(new UpdateTableCommand(params));
    console.log('GSI Added', result);
  } catch (error) {
    console.error('Error adding GSI:', error);
  }
}

export { createTable, addGSI, deleteTable };

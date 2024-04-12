import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const TABLE_NAME = 'UserOrders';

export const createUser = async (userId: string, name: string, email: string) => {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
        name: name,
        email: email,
        EntityType: 'User', // GSI partition key
      },
    })
  );
  console.log(`User ${userId} created.`);
};

export const createOrder = async (userId: string, orderId: string, orderDetails: object) => {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `USER#${userId}`,
        SK: `ORDER#${orderId}`,
        ...orderDetails,
        EntityType: 'Order', // GSI partition key for orders
      },
    })
  );
  console.log(`Order ${orderId} for user ${userId} created.`);
};

export const getUserOrders = async (userId: string) => {
  const response = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'ORDER#',
      },
    })
  );
  console.log(`Orders for user ${userId}:`, response.Items);
  return response.Items;
};

export const deleteOrder = async (userId: string, orderId: string) => {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `ORDER#${orderId}`,
      },
    })
  );
  console.log(`Order ${orderId} for user ${userId} deleted.`);
};

export const deleteUser = async (userId: string) => {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
    })
  );
  console.log(`User ${userId} deleted.`);
};

export const getUser = async (userId: string) => {
  const response = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
    })
  );
  console.log(`User info:`, response.Item);
  return response.Item;
};

// Get all users using the GSI: just exercising a GSI...
export const getAllUsers = async () => {
  const response = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'EntityType = :entityType',
      ExpressionAttributeValues: {
        ':entityType': 'User',
      },
    })
  );
  console.log('All users:', response.Items);
  return response.Items;
};

// Data driver
export const main = async () => {
  // Start here, create users
  await createUser('123', 'Fu Bar', 'fbar@example.com');
  await createUser('456', 'Baz Biff', 'bbiff@example.com');
  await createUser('789', 'Fooious Maximus', 'fmaximus@example.com');
  // Creating orders for two of the users
  //await createOrder('123', 'order1', { orderDate: '2024-04-01', items: ['item1', 'item2'] });
  //await createOrder('456', 'order2', { orderDate: '2024-04-02', items: ['item3'] });
  //await getUserOrders('123');
  // Fetching and logging all users
  //await getAllUsers();
};

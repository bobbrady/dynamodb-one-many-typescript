import { addGSI, createTable, deleteTable } from './dynamodb-table-ops';
import { main as crudMain } from './dynamodb-crud-ops';

// build and run this: npm start
const main = async () => {
  // Wait a bit for the table to become active before trying to manipulate items
  await createTable(); // Start here
  //await addGSI('GSI1'); // Wait for this to complete
  //await crudMain(); // Create Users, Orders, fetch them...
  //await deleteTable();
};

main().catch(console.error);

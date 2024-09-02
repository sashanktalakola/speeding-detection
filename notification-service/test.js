require('dotenv').config();
const pool = require('./db');


const executeQuery = async (queryText, params) => {
  const client = await pool.connect();
  try {
    const res = await client.query(queryText, params);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    client.release();
  }
};


const runSelectQueries = async () => {
  // 1. Retrieve all records from the vehicle_owners table
  const selectVehicleOwnersQuery = 'SELECT * FROM vehicle_owners LIMIT 10;';
  const vehicleOwners = await executeQuery(selectVehicleOwnersQuery);
  console.log('Vehicle Owners:', vehicleOwners);

  // 2. Retrieve all records from the owners table
  const selectOwnersQuery = 'SELECT * FROM owners LIMIT 10;';
  const owners = await executeQuery(selectOwnersQuery);
  console.log('Owners:', owners);

  // 3. Retrieve combined data from both tables using a JOIN
  const joinQuery = `
    SELECT vo.license_plate_number, vo.phone_number, vo.email_address, o.firstName, o.lastName
    FROM vehicle_owners vo
    JOIN owners o ON vo.ownerId = o.ownerId
    LIMIT 10;
  `;
  const combinedData = await executeQuery(joinQuery);
  console.log('Combined Data:', combinedData);
};


runSelectQueries().catch((err) => console.error('Error running queries', err.stack));
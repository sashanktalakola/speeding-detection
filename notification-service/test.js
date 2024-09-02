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

  // 4. Retrieve vehicle owners whose email is NULL
  const selectVehicleOwnerWithNullEmailQuery = `
    SELECT * FROM vehicle_owners
    WHERE email_address IS NULL;
  `;
  const vehicleOwnerWithNullEmail = await executeQuery(selectVehicleOwnerWithNullEmailQuery);
  console.log('Vehicle Owners with NULL Email Address:', vehicleOwnerWithNullEmail);

  // 5. Retrieve vehicle owners whose phone number is NULL
  const selectVehicleOwnerWithNullPhoneQuery = `
    SELECT * FROM vehicle_owners
    WHERE phone_number IS NULL;
  `;
  const vehicleOwnerWithNullPhone = await executeQuery(selectVehicleOwnerWithNullPhoneQuery);
  console.log('Vehicle Owners with NULL Phone Number:', vehicleOwnerWithNullPhone);

  // 6. Retrieve vehicle owners where phone number is '123-456-7890'
  const selectVehicleOwnerByPhoneQuery = `
    SELECT * FROM vehicle_owners
    WHERE phone_number = $1;
  `;
  const vehicleOwnerByPhone = await executeQuery(selectVehicleOwnerByPhoneQuery, ['123-456-7890']);
  console.log('Vehicle Owners with Phone Number 123-456-7890:', vehicleOwnerByPhone);

  // 7. Retrieve vehicle owners where email is 'test@test.com'
  const selectVehicleOwnerByEmailQuery = `
    SELECT * FROM vehicle_owners
    WHERE email_address = $1;
  `;
  const vehicleOwnerByEmail = await executeQuery(selectVehicleOwnerByEmailQuery, ['test@test.com']);
  console.log('Vehicle Owners with Email test@test.com:', vehicleOwnerByEmail);

  // 8. Retrieve first name, last name, email, and phone number from both tables where license_plate_number matches
  const selectCombinedOwnerDataQuery = `
    SELECT o.firstName, o.lastName, vo.email_address, vo.phone_number
    FROM vehicle_owners vo
    JOIN owners o ON vo.ownerId = o.ownerId
    WHERE vo.license_plate_number = $1;
  `;
  const combinedOwnerData = await executeQuery(selectCombinedOwnerDataQuery, [licensePlate]);
  console.log(`Owner Data for License Plate ${licensePlate}:`, combinedOwnerData);

};


runSelectQueries().catch((err) => console.error('Error running queries', err.stack));
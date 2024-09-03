const pool = require('./db');
const twilio = require('twilio');

require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const getUserDetails = async (licensePlate, type) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT o.firstName, o.lastName, vo.email_address, vo.phone_number
      FROM vehicle_owners vo
      JOIN owners o ON vo.ownerId = o.ownerId
      WHERE vo.license_plate_number = $1;
    `;
    const res = await client.query(query, [licensePlate]);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching user details', err.stack);
  } finally {
    client.release();
  }
};


const sendSms = (phoneNumber, message) => {
  return twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};


const processNotification = async (notification) => {
  const { licensePlateNumber, type } = notification;
  const userDetails = await getUserDetails(licensePlateNumber, type);

  if (!userDetails) {
    console.log(`No user found for License Plate: ${licensePlateNumber}`);
    return;
  }

  const { firstName, lastName, email_address, phone_number } = userDetails;
  const message = `Hello ${firstName} ${lastName}, your vehicle with License Plate ${licensePlateNumber} has a new notification.`;

  try {
    if (type === 'sms' && phone_number) {
      await sendSms(phone_number, message);
      console.log(`SMS sent to ${phone_number}`);
    } else if (type === 'email' && email_address) {
      // Need to implement
      console.log(`Email sent to ${email_address}`);
    } else {
      console.log(`No valid contact method for ${licensePlateNumber}`);
    }
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

module.exports = { processNotification };
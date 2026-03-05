// Run this script from the server folder to create an admin user
// Usage (from server folder):
//   node tools/createAdmin.js <username> <password>

require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('../models/Models');

async function run() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin';

  try {
    const _id = new mongoose.Types.ObjectId();
    const admin = new Models.Admin({ _id, username, password });
    await admin.save();
    console.log('Admin created:', { _id: _id.toString(), username, password });
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

run();

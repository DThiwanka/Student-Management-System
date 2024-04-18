const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({



})

const adminModel = mongoose.model('admins', adminSchema)
module.exports = adminModel;
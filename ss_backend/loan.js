const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    solarSystemSize: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    annualincome: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Loan', loanSchema);
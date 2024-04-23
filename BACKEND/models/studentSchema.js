const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }],


    //Payment details
    payment: [{
        date: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Paid', 'Not Paid'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        month: {
            type: String,
            required: true
        },
    }],

    // New personal information fields
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("student", studentSchema);

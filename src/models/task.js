const mongoose = require('mongoose');
const validator = require('validator')

// schema for task
const taskSchema = mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{     //type of owner declear like this because we will use it as foriegn key in the users model (populate)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users',    // need to be same as user.js which we use in mongoose.model('Users',...) --> to create relationship
    }
},{
    timestamps: true
})

// Create tasks model
const Task = mongoose.model('Tasks',taskSchema)

// Test json data
// {
//     "description" : "Doing homework",
//     "completed" : "true"
// }
module.exports = Task
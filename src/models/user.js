const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,  //this require to fill in the info
        trim: true
    },
    email:{
        type: String,
        required:true,
        unique: true,   //will be no duplicate in creating email (if have, it will catch as an error)
        trim: true,     //cut all the space
        lowercase: true,    // make every string to lower case
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('This is not a form of email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password can not contain the word password itself')
            }
        }
    },
    age:{
        type: Number,
        default: 0,     //if no input will be automatically 0
        validate(value){    //validate the value base on our condition
            if (value < 0){
                throw new Error('The age must be positive')
            }
        }
    },
    tokens: [{  //is an array of obj
        token:{
            type: String,
            required: true,
            
        }
    }],
    avatar:{
        type: Buffer,   //use JSBIN to view the binary to image: <img src="data:image/jpg; base64, BINARY>

    }
},{ //option for schema
    timestamps:true,    // use for track the create and update time
})
// vitual property- not actual data store in db-- get data from 'tasks'  by using 'user' (populate)
userSchema.virtual('tasks',{    //virtual(NameOfVirtualField)
    ref:'Tasks',
    localField: '_id',     // local data is store-- user id who related to tasks
    foreignField: 'owner'    // name of field of other things on task
})  

// need to use 'this' for binding==> so we use function(){} instead of arrow func
userSchema.methods.generateAuthToken = async function (){   // .methods because it use by the other object (mean use by user = User. => user.Methods)
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    return token
}
// make some private to our data    -- toJSON will apply to all whenever we request
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
// verify user!!! by creating function call findByCredentials()
userSchema.statics.findByCredentials = async(email,password) =>{    // .statics because it is directly call (mean use by User.)
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login')
    }
    return user
}
// schema
// pre -> do something before save  pre(eventName, function)
// post ->do something after save  

// hash the plain text messages before saving
userSchema.pre('save', async function (next){
    const user = this
    // console.log(' Just Before saving'); // use this console will run only one time, so to make a change in user router to make sure it run as much as we change
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next(); //next will stop this code block and move to next
})
// delete user tasks when user is removed
userSchema.pre('remove',async function(next){
    const user = this
    Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('Users',userSchema)
module.exports = User

// -----------------------------------------------------------------------------//
// // create a new collection with name "User"
// const User = mongoose.model('Users',{
//     name:{
//         type: String,
//         required: true,  //this require to fill in the info
//         trim: true
//     },
//     email:{
//         type: String,
//         trim: true,     //cut all the space
//         lowercase: true,    // make every string to lower case
//         validate(value){
//             if (!validator.isEmail(value)){
//                 throw new Error('This is not a form of email')
//             }
//         }
//     },
//     password:{
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value){
//             if (value.toLowerCase().includes('password')){
//                 throw new Error('Password can not contain the word password itself')
//             }
//         }
//     },
//     age:{
//         type: Number,
//         default: 0,     //if no input will be automatically 0
//         validate(value){    //validate the value base on our condition
//             if (value < 0){
//                 throw new Error('The age must be positive')
//             }
//         }
//     }
// })
// Test json data
// {
//     "name": "Kimtong",
//     "email" : "Kimtong@gmail.com",
//     "password" : "1234sada",
//     "age" : "20"
// }
// module.exports = User
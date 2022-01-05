const mongoose = require('mongoose');
const validator = require('validator')

// create new database name "task-manager-api"
mongoose.connect(process.env.MONGODB_URL,{ 
    useNewUrlParser: true
})


// // Create tasks model
// const Tasks = mongoose.model('Tasks',{
//     description:{
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     }
// })
// const workTask = new Tasks({
//     description:'Clean house',
//     completed: true
// })
// workTask.save().then(()=>{
//     console.log(workTask);
// }).catch(error=>{
//     console.log(error);
// })

// ------------------------------------------------------------------------------------------------------------------- //

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
// // Input the data into the collection
// const me = new User({
//     name:"      Bun Ratanak Vichea    ",
//     email: 'vicheaBun@gmail.com        ',
//     password:"       1123eafs     ",
//     age: 20
// })
// // save the data 
// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log('error!', error);
// })
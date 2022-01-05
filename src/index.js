const express = require('express');
const morgan = require('morgan');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose')
const router = express.Router()
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log('Sever is up on port: ' + port);
})
// ---------------------------------------------------------------------------------------- //
// without middleware: new request -> run route handler
// with middleware: new request -> do sth -> run route handler

// // to put everything as not working from server we no need to use next(), just to stop right here in app.use
// app.use((req,res,next)=>{
//     res.status(503).send('The server is under maintenance')
// })

// use to block get request
// app.use((req,res,next)=>{
//     // console.log(req.method, req.path);
//     if(req.method === 'GET'){
//         res.send('GET request are disabled')
//     }else{
//         next()
//     }
//     // next()  //if there are something after this use middleware, it will be execute
// })


// 3rd party of middleware by morgan
app.use(morgan('dev')); //display the time and status`and route
// to use json file 
app.use(express.json())
// user the route from other folder
app.use(userRouter)
app.use(taskRouter)


// ---------------------------------------------------------------------------------------- //
// // file upload such as image
// const multer = require('multer')
// const upload = multer({
//     dest:'images',    //destination, the images folder will be create in our coding folder after adding first file
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error("Please upload a word document"))
//         }
//         cb(undefined, true)
//     }
// })
// const errorMiddleware = (req,res,next)=>{
//     throw new Error('From middleware')
// }
// app.post('/upload', upload.single('upload'), (req,res)=>{   //upload in single() need to be the same name as the input in form-data
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error: error.message})
// })
// ---------------------------------------------------------------------------------------- //
// // populate
// const main = async ()=>{
//     // // task --> to find user data ( id of the task)
//     // const task = await Task.findById('61bc5056a4348d85f0630b2c')
//     // await task.populate('owner')   // populate data from the relationship // find user connection with id 
//     // console.log(task.owner);

//     // find user by their id ( id of task owner)
//     const user = await User.findById('61bc19415f1f9b559aaf29c8')
//     await user.populate('tasks')    //bind all tasks to user and store in user.tasks
//     console.log(user.tasks);    // user.tasks is a virtual place that store all of the tasks documents
// }
// main()
// ---------------------------------------------------------------------------------------- //
// const obj = {
//     name : "hehe"
// }
// obj.toJSON = function(){
//     // console.log(this);
//     // return this
//     return {}
// }
// console.log(JSON.stringify(obj));
// ---------------------------------------------------------------------------------------- //
// // test Bcrypt module
// const bcrypt = require('bcryptjs');
// const myFunction =  async ()=> {
//     // hash is no way to decrypt -> Only solution is to decrypt it again and match it to the hashedPassword
//     const password = "Vichea is my fav"
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log(password);
//     console.log(hashedPassword);
//     const isMatch = await bcrypt.compare(password, hashedPassword)
//     console.log(isMatch);
// }
// myFunction()
// ---------------------------------------------------------------------------------------- //
// // test json web token 
// const jwt = require('jsonwebtoken')
// const myFunction = async()=>{
//     // sign(obj,string) => return new token(secret)
//     const token = jwt.sign({_id: 'abc123'},'thisismynewcourse',{expiresIn:'2 days'}) //expereIn = amount of time to be valid
//     console.log(token);
// ---------------------------------------------------------------------------------------- //
//     // verify of jwt(verify the token to access the info) -- compare of bcryptjs 
//     const data = jwt.verify(token,'thisismynewcourse')
//     console.log(data);
// }
// myFunction()
// ---------------------------------------------------------------------------------------- //
// // practice route
// router.get('/test',(req,res)=>{
//     res.send('Test from other route')
// })
// app.use(router)
// ---------------------------------------------------------------------------------------- //
// app.post('/users', async (req,res)=>{
//     // // Test the Post method in postman
//     // console.log(req.body);   //we send something from postman and show in terminal of vs code
//     // res.send('Testing!')
//     // // assign value to the user collection that already create in user.js which already import here
//     // const user = new User(req.body);    // req.body because we send it into body from postman
//     // user.save().then(()=>{
//     //     res.send(user)  //send back the added data to client side
//     // }).catch((e)=>{
//     //     res.status(400).send(e)
//     // })
//     //Apply async await
//     const user = new User(req.body)
//     try{
//         await user.save()
//         res.status(201).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })
// app.get('/users',async (req,res)=>{   //this GET method will find all data in database and send it to client side
//     // // find all data in the database
//     // User.find({}).then(userData=>{
//     //     res.send(userData)
//     // }).catch(e=>{
//     //     res.status(500).send()
//     // })
//     //Apply async await
//     try{
//         const findUser = await User.find({})
//         res.status(200).send(findUser)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// app.get('/users/:id',async (req,res)=>{
//     // // console.log(req.params);    //check what id we add after /users/.....
//     // const _id = req.params.id;   // find the data of that ID
//     // User.findById(_id).then(userData=>{
//     //     if (!userData){
//     //         return  res.status(404).send()
//     //     }
//     //     res.send(userData)
//     // }).catch(e=>{
//     //     res.status(500).send()
//     // })
//     //Apply async await
//     const _id = req.params.id
//     try{
//         const findUserById = await User.findById(_id)
//         if (!findUserById){
//             return res.status(404).send()
//         }
//         res.send(findUserById)
//     } catch(e){
//         res.status(500).send(e)
//     }
// }) 
// // Update
// app.patch('/users/:id',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name','email','password','age']
//     const isValidOperation = updates.every(update=> allowedUpdates.includes(update))
//     if (!isValidOperation){
//         return res.status(400).send({error: "Invalid update"})
//     }
//     try{
//         // new => return new user as an existing one that found befor update
//         // runValidator => can fails if we update something that doesn't exist
//         const findUpdateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
//         if (!findUpdateUser){
//             return res.status(404).send()
//         }
//         res.status(205).send(findUpdateUser)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })
// // delete
// app.delete('/users/:id',async (req,res)=>{
//     try{
//         const deleteUser = await User.findByIdAndDelete(req.params.id)
//         if(!deleteUser){
//             return res.status(404).send()
//         }
//         res.send(deleteUser)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// // ---------------------------------------------------------------------------------------------------------------------------- // 
// app.post('/tasks',async (req,res)=>{
//     // const task = new Task(req.body);
//     // task.save().then(()=>{
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(400).send(e)
//     // })

//     //Apply async await
//     const task = new Task(req.body)
//     try{
//         await task.save()
//         res.status(201).send(task)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })
// app.get('/tasks',async (req,res)=>{
//     // Task.find({}).then(taskData=>{
//     //     res.send(taskData)
//     // }).catch(e=>{
//     //     res.status(500).send()
//     // })

//     //Apply async await
//     try{
//         const findTask = await Task.find({})
//         res.status(200).send(findTask)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// app.get('/tasks/:id',async (req,res)=>{
//     // const _id = req.params.id;
//     // Task.findById({_id}).then(taskData=>{
//     //     if (!taskData){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(taskData)
//     // }).catch(e=>{
//     //     res.status(500).send()
//     // })

//     //Apply async await
//     const _id = req.params.id
//     try{
//         const findTaksById = await Task.findById({_id})
//         if (!findTaksById){
//             return res.status(404).send()
//         }
//         res.status(200).send(findTaksById)
//     }catch(e){
//         res.status(500).send(e)
//     } 
// })

// app.patch('/tasks/:id',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every(update=> allowedUpdates.includes(update))
//     if(!isValidOperation){
//         res.status(400).send()
//     }
//     try{
//         const findUpdateTask = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
//         if (!findUpdateTask){
//             return res.status(404).send()
//         }
//         res.send(findUpdateTask)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// app.delete('/tasks/:id',async (req,res)=>{
//     try{
//         const deleteTask = await Task.findByIdAndDelete(req.params.id)
//         if(!deleteTask){
//             return res.status(404).send()
//         }
//         res.send(deleteTask)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })
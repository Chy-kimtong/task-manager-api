// we use express.Router as a function that we will export this module to main index.js
// it can help the main index.js to reduce their code line

const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth'); //use auth here as middleware
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        // user.tokens = user.tokens.concat({token})
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/users/login',async (req,res)=>{   //verify login user
    // try{
    //     const user = await User.findByCredentials(req.body.email, req.body.password)
    //     res.send(user)
    // }catch(e){
    //     res.status(400).send(e)
    // }
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token})
        await user.save()
        res.send({user, token}) //user -> normal user info, token-> is a secret code
    }catch(e){
        res.status(400).send(e)
    }

})
router.post('/users/logout', auth, async(req,res,next)=>{    //logout
    try{
        // logout one 
        // user.tokens from db
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async(req,res,next)=>{    // logout all
    try{
        // To logout all session we need to clear our tokens as empty list
        req.user.tokens = []
        await req.user.save()
        res.send
    }catch(e){
        res.status(500).send(e)
    }
})
// upload profile avatar
const upload = multer({
    // dest: 'avatars',    //destination, 'avatars' folder will be create in our coding folder after adding first file
    limits:{
        fileSize: 1000000, //standard size is bite
    },
    fileFilter(req,file, cb){   //cb= callback
        // // if(!file.originalname.endsWith('.pdf')){
        // //     return cb(new Error('Please upload a PDF'))
        // // }
        // if(!file.originalname.match(/\.(doc | docx)$/)){    //use regex
        //     return cb(new Error('Please upload a doc or docx file'))
        // }
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("This is not image file"))
        }
        // cb(new Error('File must be pdf'))   //use callback func to catch an error
        cb(undefined, true)     //accept 
        // cb(undefined, false)    //except
    }
})
router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=>{   //avatar in single() need to be the same name as the input in form-data
    // req.user.avatar = req.file.buffer   //passing the fill to avatar in user models
    
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()  
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//this GET method will find all data in database and send it to client side
router.get('/users', auth,async (req,res)=>{    // auth here work as middleware which mean we can stop the running if we don't use next() in auth and also to provide something before doing get methods
    try{
        const findUser = await User.find({})
        res.status(200).send(findUser)
    }catch(e){
        res.status(500).send(e)
    }
})
// get individual user
router.get('/users/me', auth,async (req,res)=>{    // auth here work as middleware which mean we can stop the running if we don't use next() in auth and also to provide something before doing get methods
    // try{
    //     res.status(200).send(req.user)
    // }catch(e){
    //     res.status(500).send(e)
    // }

    res.send(req.user)
})

router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const findUserById = await User.findById(_id)
        if (!findUserById){
            return res.status(404).send()
        }
        res.send(findUserById)
    } catch(e){
        res.status(500).send(e)
    }
}) 

router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')  //set == name of what we want to set follow by its value
        res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})
// // Update
// router.patch('/users/:id',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name','email','password','age']
//     const isValidOperation = updates.every(update=> allowedUpdates.includes(update))
//     if (!isValidOperation){
//         return res.status(400).send({error: "Invalid update"})
//     }
//     try{
//         // const findUpdateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
//         const findUpdateUser = await User.findById(req.params.id)
//         updates.forEach(update => findUpdateUser[update] = req.body[update])
//         await findUpdateUser.save()

//         if (!findUpdateUser){
//             return res.status(404).send()
//         }
//         res.status(205).send(findUpdateUser)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })
router.patch('/users/me', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every(update=> allowedUpdates.includes(update))
    if (!isValidOperation){
        return res.status(400).send({error: "Invalid update"})
    }
    try{
        const findUpdateUser = req.user
        updates.forEach(update => findUpdateUser[update] = req.body[update])
        await findUpdateUser.save()
        res.status(205).send(findUpdateUser)
    }catch(e){
        res.status(400).send(e)
    }
})

// // delete
// delete user by passing id in the params
// router.delete('/users/:id', auth,async (req,res)=>{
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
// delete user from the auth by removing them 
router.delete('/users/me', auth, async (req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
module.exports = router
const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = express.Router();

router.post('/tasks', auth, async (req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,    // copy all prop in body if provided
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// req.params.id -- /tasks/:id
// req.query.id -- /tasks?id=...

// GET-- /tasks?completed=true
// limit and skip(iterate over page) option: GET-- /tasks?limit=10&skip=10 (load 10 and then skip these 10)
// sorted asc or desc: GET-- /tasks/sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res)=>{
    try{
        // const findTask = await Task.find({})

        // const findTask = await Task.find({owner: req.user._id})
        // res.status(200).send(findTask)

        // await req.user.populate('tasks')
        // res.send(req.user.tasks)
        
        const match = {}    //like searching
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        const sort = {} //sorted the data 
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   //tri- ternary operater
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
                // sort:{
                //     // createdAt: 1, //base on the timestamp we put while creating the task
                //     // completed: -1, //base on the true or false if -1 mean sorted from true to false else (1) reverse 
                // }
            }
        })
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        // const findTaskById = await Task.findById({_id})
        const findTaskById = await Task.findById({_id, owner: req.user._id})    // owner can only access the task for who create the task
        if (!findTaskById){
            return res.status(404).send()
        }
        res.status(200).send(findTaskById)
    }catch(e){
        res.status(500).send(e)
    } 
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update=> allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send()
    }
    try{

        // const findUpdateTask = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})
        // const findUpdateTask = await Task.findById(req.params.id)
        const findUpdateTask = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        // updates.forEach(update=> findUpdateTask[update] = req.body[update])
        // await findUpdateTask.save()

        if (!findUpdateTask){
            return res.status(404).send()
        }
        updates.forEach(update=> findUpdateTask[update] = req.body[update])
        await findUpdateTask.save()
        res.send(findUpdateTask)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        // const deleteTask = await Task.findByIdAndDelete(req.params.id)
        const deleteTask = await Task.findByIdAndDelete({_id: req.params.id, owner: req.user._id})
        if(!deleteTask){
            return res.status(404).send()
        }
        res.send(deleteTask)
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports = router
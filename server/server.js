//requires
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

//Mongoose & Models
const {mongoose, db} = 	require('./db/mongoose')
const {Todo} = require('./models/todo')				
const {User} = require('./models/user')

const app = express()
app.use(bodyParser.json())




app.post('/todos',(req,res)=>{
	// console.log(req.body)

	let todo = new Todo({
		text:req.body.text,
		completed:req.body.completed
 	})
	todo.save().then((added)=> res.send(added) ,
					(err)=> res.status(400).send(err))
})


app.get('/todos',(req,res)=>{
	// console.log(req.body)

	Todo.find().then((todos)=>{
		res.send({todos})
	},(err)=> {
		res.status(400).send(err)
	})
})


app.get('/todos/:id',(req,res)=>{
	let id = req.params.id
	if(!ObjectID.isValid(id)) return res.status(404).send({error:'Bad ID'})

	Todo.findById(id).then((todo)=>{
		if(!todo) return res.status(404).send({error:'Todo not found'})
		res.send({todo})
	}).catch((err)=> res.status(400).send(err))
})


app.listen(3000,()=> console.log('Listening 3000'))



module.exports = {app}
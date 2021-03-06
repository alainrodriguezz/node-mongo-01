require('./config/config')

//requires
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

//Mongoose & Models
const {mongoose, db} = 	require('./db/mongoose')
const {Todo} = require('./models/todo')				
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT
app.use(bodyParser.json())


//=====================
//TODOS
//=====================

app.get('/todos',authenticate,(req,res)=>{

	Todo.find({_creator:req.user._id}).then((todos)=>{
		res.send({todos})
	},(err)=> {
		res.status(400).send(err)
	})
})


app.get('/todos/:id',authenticate,(req,res)=>{
	let id = req.params.id
	if(!ObjectID.isValid(id)) return res.status(404).send({error:'Bad ID'})

	Todo.findOne({_id:id,_creator:req.user._id}).then((todo)=>{
		if(!todo) return res.status(404).send({error:'Todo not found'})
		res.send({todo})
	}).catch((err)=> res.status(400).send(err))
})


app.post('/todos',authenticate,(req,res)=>{

	let todo = new Todo({
		text:req.body.text,
		completed:req.body.completed,
		_creator:req.user._id
 	})
	todo.save().then((added)=> res.send(added) ,
					(err)=> res.status(400).send(err))
})


app.patch('/todos/:id',authenticate,(req,res)=>{
	let id = req.params.id
	let body = _.pick(req.body,['text','completed'])

	if(!ObjectID.isValid(id)) return res.status(404).send()

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime()
	}else{
		body.completed = false
		body.completedAt = null
	}

	Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{
		$set:body
	},
	{
		new:true
	}).then((todo)=>{
		if(!todo) return res.status(404).send()

		res.send({todo})
	}).catch((err)=> res.status(400).send())
})

app.delete('/todos/:id',authenticate,(req,res)=>{
	let id = req.params.id
	if(!ObjectID.isValid(id)) return res.status(404).send()

	Todo.findOneAndDelete({_id:id,_creator:req.user._id}).then((todo)=>{
		if(!todo) return res.status(404).send()
		res.send({deleted:todo})
	}).catch((err)=>res.status(400).send(err))
})


//=====================
//USERS
//=====================

app.post('/users/login',(req,res)=>{
	let body = _.pick(req.body,['email','password'])

	User.findByCredentials(body.email,body.password).then((user)=>{
		user.generateAuthToken().then((token)=>{
			res.header('x-auth',token).send(user)
		})
		.catch((err)=> res.status(400).send())	
	})
	.catch((err)=> res.status(400).send())
})



app.get('/users',(req,res)=>{
	User.find().then((users)=>{
		res.send({users})
	})
	.catch((err)=>res.status(400).send(err))
})

app.get('/users/me',authenticate, (req,res)=>{

	res.send(req.user)
})

app.get('/users/:id',(req,res)=>{

	if(!ObjectID.isValid(req.params.id)) return res.status(404).send()

	User.findById(req.params.id).then((user)=>{
		if(!user) return res.status(404).send()
		res.send({user})
	})
	.catch((err)=>res.status(400).send(err))
})


app.post('/users',(req,res)=>{
	if(!req.body.email || !req.body.password) return res.status(400).send({error:'Email and Password required'})
	let body = _.pick(req.body,['email','password'])
	let user = new User(body)

	user.save().then(()=>{
		return user.generateAuthToken()
	}).then((token)=>{
		res.header('x-auth',token).send({user})
	})	
	.catch((err)=>res.status(400).send())
})

app.patch('/users/:id',(req,res)=>{
	if(!ObjectID.isValid(req.params.id)) return res.status(404).send()

	let id = req.params.id
	let body = _.pick(req.body,['email','password'])

	User.findByIdAndUpdate(id,{ $set:body},{new:true}).then((user)=>{
		if(!user) return res.status(404).send()
		res.send({user})
	})
	.catch((err)=>res.status(400).send())
})


app.delete('/users/:id',(req,res)=>{
	if(!ObjectID.isValid(req.params.id)) return res.status(404).send()

	User.findByIdAndDelete(req.params.id).then((user)=>{
		if(!user) return res.status(404).send()
		res.send({user})
	}).catch((err)=> res.status(400).send(err))
})


app.delete('/users/me/token',authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send()
	},()=>{
		res.status(400).send()
	})
})



app.listen(port,()=> console.log('Listening at',port))



module.exports = {app}
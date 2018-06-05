//requires
const express = require('express')
const bodyParser = require('body-parser')

//Mongoose & Models
const {mongoose, db} = 	require('./db/mongoose')
const {Todo} = require('./models/todo')				
const {User} = require('./models/user')

const app = express()



app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
	console.log(req.body)

	let todo = new Todo({
		text:req.body.text,
		completed:req.body.completed
	})
	todo.save().then((added)=> res.send(added) ,
					(err)=> res.status(400).send(err))
})


app.listen(3000,()=> console.log('Listening 3000'))


/*
db.on('open',()=>{
	console.log('Connected')

	// let newUser = new User({
	// 	email:'alain@gmail.com',
	// 	password:123
	// })
	// newUser.save().then((res)=> console.log(res))
})
db.on('err',(err)=> console.log('Error Connecting',err)
*/
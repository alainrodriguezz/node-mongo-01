const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')
const db = mongoose.connection


const Todo = mongoose.model('Todo',{
	text:{
		type:String,
		required:true,
		minlength:1,
		trim:true
	},
	completed:{
		type:Boolean,
		default:false
	},
	completedAt:{
		type:Number,
		default:null
	}
}) 

const User = mongoose.model('User',
{
	email:{
		type:String,
		required:true,
		trim:true,
		minlength:1
	},
	password:{
		type:String,
		minlength:1,
		required:true
	}
})


db.on('open',()=>{
	console.log('Connected')

	// let newTodo = new Todo({
	// 	text:'Nuevo Pendiente',
	// 	completed:false
	// })
	// newTodo.save().then((res)=>{
	// 	console.log('Saved',res)
	// },
	// (err)=>console.log(err))

	let newUser = new User({
		email:'alain@gmail.com',
		password:123
	})
	newUser.save().then((res)=> console.log(res))

	
})

db.on('err',(err)=>{
	console.log('Error',err)
})
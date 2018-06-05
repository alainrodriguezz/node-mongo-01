const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

let todoId = '6b16c9e733ab2d0489b90ed7'
let	userId = '5b15e310c671f707f88dc19a'

if(!ObjectID.isValid(todoId) || !ObjectID.isValid(userId)) return console.log('Error: ID is not valid')


User.find().then((users)=>{
	console.log('FindUsers:',users)
})
User.findOne({_id:userId}).then((user)=>{
	if(!user) return console.log('FindOneUser:','User not found')
	console.log('FindOneUser:',user)
})
User.findById({_id:userId}).then((user)=>{
	if(!user) return console.log('FindById:','User not found')
	console.log('FindById:',user)
},(err)=>console.log(e))



// Todo.find({_id}).then((todos)=>{
// 	console.log('Find:',todos)
// })

// Todo.findOne({_id}).then((todo)=>{
// 	console.log('FindOne:',todo)
// })

// Todo.findById(_id).then((todo)=>{
// 	if(!todo) return console.log('FindById:','ID not found')
// 	console.log('FindById:',todo)
// }).catch((err)=> console.log(err))
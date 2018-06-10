const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const dummyUsers = [
{
	_id: userOneId,
	email:'user1prueba@gmail.com',
	password:'userOnepass',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
	}]
},
{
	_id:userTwoId,
	email:'user2prueba@gmail.com',
	password:'userTwopass',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
	}]
}]


let dummyTodos = [
{
	text:'1 First Test Todo',
	completed:false,
	_id:new ObjectID(),
	_creator:userOneId
},{
	text:'2 Second Test Todo',
	completed:false,
	_id:new ObjectID(),
	_creator:userTwoId
}]


const populateTodos = (done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(dummyTodos)
	}).then(()=>done())
}

const populateUsers = (done)=>{
	User.remove({}).then(()=>{
		let userOne = new User(dummyUsers[0]).save()
		let userTwo = new User(dummyUsers[1]).save()

		return Promise.all([userOne,userTwo])
	}).then(()=>done())
}

module.exports = {dummyTodos,populateTodos, dummyUsers,populateUsers}
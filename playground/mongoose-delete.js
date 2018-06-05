const {ObjectID} = require('mongodb')
const mongoose = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')


//Todo.deleteOne
//Todo.deleteMany

Todo.findByIdAndDelete('5b17028eef99361dab510b9c').then((res)=>{
	console.log(res)
})

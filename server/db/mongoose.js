const mongoose = require('mongoose')
const db = mongoose.connection



mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

db.on('open',()=>{
	console.log('Mongo Connected')
})
db.on('err',(err)=> console.log('Error Connecting Mongo',err))



module.exports = {mongoose, db}
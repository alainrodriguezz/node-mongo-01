const mongoose = require('mongoose')
const db = mongoose.connection

//HEROKU MONGO URI: 	mongolab-dimensional-93436

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

db.on('open',()=>{
	console.log('Mongo Connected')
})
db.on('err',(err)=> console.log('Error Connecting Mongo',err))



module.exports = {mongoose, db}
const mongoose = require('mongoose')

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
module.exports = {User}
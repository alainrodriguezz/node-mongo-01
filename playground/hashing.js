const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123abc!'
bcrypt.genSalt(10, (err,salt)=>{
	bcrypt.hash(password,salt,(err,hash)=>{
		console.log('HASH',hash)
	})
})

let hashedPassword = '$2a$10$Epqmhs6GfZyG9JwXLox7IeLlbaYT2EG5yOok8jjI3T3GdFIY4N1Rq'

bcrypt.compare(password,hashedPassword,(err,res)=>{
	console.log('MATCH',res)
})






// jwt.sign
// jwt.verify

// let data = {
// 	id:10,
// 	nombre:'alain'
// }

// let token = jwt.sign(data,'secret')
// let decoded = jwt.verify(token,'secret')

// console.log('TOKEN',token)
// console.log('DECODED',decoded)





// const {SHA256} = require('crypto-js')

// let message = 'I am user number 3'
// let hash = SHA256(message).toString()

// console.log('Message:',message)
// console.log('Hash:',hash)
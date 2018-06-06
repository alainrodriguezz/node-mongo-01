const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

// jwt.sign
// jwt.verify

let data = {
	id:10,
	nombre:'alain'
}

let token = jwt.sign(data,'secret')
let decoded = jwt.verify(token,'secret')

console.log('TOKEN',token)
console.log('DECODED',decoded)





// const {SHA256} = require('crypto-js')

// let message = 'I am user number 3'
// let hash = SHA256(message).toString()

// console.log('Message:',message)
// console.log('Hash:',hash)
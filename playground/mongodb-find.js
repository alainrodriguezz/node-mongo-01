const {MongoClient,ObjectID} = require('mongodb')
const _ = require('lodash')

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
	if(err)return console.log('Err')
	console.log('Connected')
	
	const db = client.db('TodoApp')
	db.collection('Todos').find().toArray().then((docs)=>
	{
		let totalTodos = docs.length
		let todosDone = _.filter(docs,{completed:true}).length
		let todosPending = _.filter(docs,{completed:false}).length
		console.log(`Right now I have a list of ${totalTodos} Todos. ${todosDone} of them are done, so I have ${todosPending} pending`)
		//console.log('Todos',JSON.stringify(docs,undefined,2))

	},(err)=>{
		console.log('err',err)
	})

	//Contar
	db.collection('Todos').find().count().then((count)=>{
		//console.log(`Right now I have ${count} Todos`)
	},(err)=>{

	})

	//db.close()
})
const {MongoClient} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
	if(err)return console.log('Err connecting')
	console.log('Connected')

	const db = client.db('TodoApp')
	db.collection('Todos').insertOne(
	{
		text:'Atender el seminario',
		completed:false

	},(err,res)=>{
		if(err)return console.log(err)
		console.log('Inserted',JSON.stringify(res.ops,undefined,2))
	})

	client.close()
})

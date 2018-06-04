const {MongoClient,ObjectID} = require('mongodb')
const _ = require('lodash')

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
	if(err)return console.log('Err')
	console.log('Connected')
	
	const db = client.db('TodoApp')

	//deleteMany
	//db.collection('Todos').deleteMany({text:'Atender el seminario'}).then((res)=> console.log(res))

	//deleteOne
	//db.collection('Todos').deleteOne({text:'Jugar en el parque'}).then((res)=>console.log(res))

	//findOneAndDelete
	//db.collection('Todos').findOneAndDelete({_id:new ObjectID('5b1375bda4bc2f37d0dfd3e0')}).then((res)=>{console.log(res)})
 
	//db.close()
})
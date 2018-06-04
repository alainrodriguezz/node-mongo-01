const {MongoClient,ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
	if(err)return console.log(err)

	const db = client.db('TodoApp')
	db.collection('Users').findOneAndUpdate(
		{
			_id:new ObjectID('5b158936d9976605023f662f')
		},
		{
			$set:{
				name:'Mamut',
				location:'Argentina'
			},
			$inc:{
				age:3
			}
		},
		{
			returnOriginal:false
		}
		).then((res)=>{
			console.log(res)
		})
})
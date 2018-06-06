const {ObjectID} = require('mongodb')
const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

let dummyTodos = [
{
	text:'1 First Test Todo',
	_id:new ObjectID()
},{
	text:'2 Second Test Todo',
	_id:new ObjectID()
}]




beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(dummyTodos)
	}).then(()=>{
		done()
	}).catch((err)=>{
		console.log(err)
	})
})


describe('GET /todos',()=>{
	
	it('Should get all Todos',(done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2)
			})
			.end(done)
	})
})

describe('GET /todos/:ID',()=>{

	it('Should get a Todo by ID',(done)=>{
		request(app)
			.get(`/todos/${dummyTodos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(dummyTodos[0].text)
			})
			.end(done)
	})

	it('Should get 404 BAD ID Error',(done)=>{
		request(app)
			.get('/todos/0000')
			.expect(404)
			.expect((res)=>{
				expect(res.body.error).toBe('Bad ID')
			})
			.end(done)
	})

	it('Should get 404 Not Found',(done)=>{
		let tempId = new ObjectID().toHexString()
		request(app)
			.get(`/todos/${tempId}`)
			.expect(404)
			.expect((res)=>{
				expect(res.body.error).toBe('Todo not found')
			})
			.end(done)
	})
})


describe('POST /todos',()=>{
	it('Should create a new Todo',(done)=>{
		let text = "Test todo text"
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res)=>{
				expect(res.body.text).toBe(text)
			})
			.end((err,res)=>{
				if(err){
					return done(err)
				}
				Todo.find({text}).then((todos)=>{
					expect(todos.length).toBe(1)
					expect(todos[0].text).toBe(text)
					done()
				}).catch((err)=>{
					done(err)
				})
			})
	})

	it('Souldnt create a new Todo and get 400 error because of no-data Sent',(done)=>{
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err,res)=>{
				if(err) return done(err)

				Todo.find().then((todos)=>{
					expect(todos.length).toBe(2)
					done()
				})
				.catch((err)=> done(err))
			})
	})
})

describe('DELETE /todos/:id',()=>{

	it('Should Delete a Todo',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		request(app)
			.delete(`/todos/${id}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.deleted._id).toBe(id)
			})
			.end((err,res)=>{
				if(err) return done(err)

				Todo.findById(id).then((todo)=>{
					expect(todo).toBeNull()
					done()
				}).catch((err)=>done(err))
			})

	})

	it('Should return 404 for Todo Not found',(done)=>{
		let newid = new ObjectID().toHexString()
		request(app)
			.delete(`/todos/${newid}`)
			.expect(404)
			.end(done)
	})

	it('Should return 4040 for Bad ID',(done)=>{
		request(app)
			.delete(`/todos/123abc`)
			.expect(404)
			.end(done)
	})


})
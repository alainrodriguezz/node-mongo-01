const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

let dummyTodos = [
{
	text:'First Test Todo'
},{
	text:'Second Test Todo'
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
const {ObjectID} = require('mongodb')
const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {dummyTodos,populateTodos,dummyUsers,populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)


describe('GET /todos',()=>{
	
	it('Should get all Todos',(done)=>{
		request(app)
			.get('/todos')
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(1)
			})
			.end(done)
	})
})

describe('GET /todos/:ID',()=>{

	it('Should get a Todo by ID and created by this User',(done)=>{
		request(app)
			.get(`/todos/${dummyTodos[0]._id.toHexString()}`)
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(dummyTodos[0].text)
			})
			.end(done)
	})

	it('Should not get a Todo because it was created by other User',(done)=>{
		request(app)
			.get(`/todos/${dummyTodos[1]._id.toHexString()}`)
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.expect(404)
				.end(done)
	})

	it('Should get 404 BAD ID Error',(done)=>{
		request(app)
			.get('/todos/0000')
			.set('x-auth',dummyUsers[0].tokens[0].token)
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
			.set('x-auth',dummyUsers[0].tokens[0].token)
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
			.set('x-auth',dummyUsers[0].tokens[0].token)
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
			.set('x-auth',dummyUsers[0].tokens[0].token)
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



describe('PATCH /todos/:id',()=>{

	it('Should PATCH a Todo with new text',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		let newText = 'Nuevo Texto'
		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.send({text:newText,completed:true})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(newText)
				expect(res.body.todo.completed).toBe(true)
			})
			.end(done)

	})
	
	it('Should remove completedAt when its completed false',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.send({completed:false})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.completedAt).toBeNull()
			})
			.end(done)
	})


	it('Should Not PATCH a Todo from Another User',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		let newText = 'Nuevo Texto'
		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth',dummyUsers[1].tokens[0].token)
			.send({text:newText,completed:true})
			.expect(404)
			.end(done)

	})
	
})



describe('DELETE /todos/:id',()=>{

	it('Should Delete one of my Todos',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		console.log("deleting",id)
		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth',dummyUsers[0].tokens[0].token)
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

	it('Fail Deleting a Todo from other user',(done)=>{
		let id = dummyTodos[0]._id.toHexString()
		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth',dummyUsers[1].tokens[0].token)
			.expect(404)
			.end((err,res)=>{
				if(err) return done(err)

				Todo.findById(id).then((todo)=>{
					expect(todo._id.toHexString()).toBe(id)
					done()
				}).catch((err)=>done(err))
			})

	})

	it('Should return 404 for Todo Not found',(done)=>{
		let newid = new ObjectID().toHexString()
		request(app)
			.delete(`/todos/${newid}`)
			.set('x-auth',dummyUsers[1].tokens[0].token)
			.expect(404)
			.end(done)
	})

	it('Should return 4040 for Bad ID',(done)=>{
		request(app)
			.delete(`/todos/123abc`)
			.set('x-auth',dummyUsers[1].tokens[0].token)
			.expect(404)
			.end(done)
	})
})


describe('GET /users/me',()=>{

	it('Should return user if authenticated',(done)=>{
		request(app)
			.get('/users/me')
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body._id).toBe(dummyUsers[0]._id.toHexString())
				expect(res.body.email).toBe(dummyUsers[0].email)
			})
			.end(done)
	})

	it('Should return 401 because not authenticated',(done)=>{
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res)=>{
				expect(res.body).toEqual({})
			})
			.end(done)
	})
})


describe('POST /users/',()=>{
	it('Should create a user',(done)=>{
		let email = 'example@example.com'
		let password = '123qwe'

		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toBeDefined()
				expect(res.body.user._id).toBeDefined()
				expect(res.body.user.email).toBe(email)
			})
			.end((err)=>{
				if(err) return done(err)

				User.findOne({email}).then((user)=>{
					expect(user).toBeDefined() 
					expect(user.password).not.toBe(password)
					done()
				})
				.catch((err)=>done(err))
			})
	})

	it('Should retur error because of bad Email',(done)=>{
		
		let email = 'Notemail'
		let password = '123qwe'
		
		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done)
	})

	it('Should not create user if email is in use',(done)=>{
		
		let email = dummyUsers[0].email
		let password = '123qwe'

		request(app)
			.post('/users')
			.send({email,password})
			.expect(400)
			.end(done)
	})
})


describe('POST /users/login',()=>{

	
	it('Should login, good credentials',(done)=>{

		let email = dummyUsers[1].email
		let password = dummyUsers[1].password

		request(app)
			.post('/users/login')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toBeDefined()
			})
			.end((err,res)=>{
				if(err) return done(err)

				User.findById(dummyUsers[1]._id).then((user)=>{
					expect(user.tokens[0].access).toBeDefined()
					expect(user.tokens[0].token).toBeDefined()
					done()
				})
				.catch((err)=>done(err))

			})
	})


		it('Should not login because wrong password',(done)=>{
			let email = dummyUsers[1].email
			let password = 'bad'

			request(app)
				.post('/users/login')
				.send({email,password})
				.expect(400)
				.end(done)
		})

})


describe('DELETE /users/me/token',()=>{

	it('Should remove token onlogout',(done)=>{

		request(app)
			.delete('/users/me/token')
			.set('x-auth',dummyUsers[0].tokens[0].token)
			.expect(200)
			.end((err,res)=>{
				if(err) return done (err)

				User.findById(dummyUsers[0]._id).then((user)=>{
					expect(user.tokens.length).toBe(0)
					done()
				})
				.catch((err)=>done(err))
			})
	})
})
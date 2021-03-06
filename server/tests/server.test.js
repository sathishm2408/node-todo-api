const expect=require('expect');
const request=require('supertest');

const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {todo}=require('./../models/Todo');
const {User}=require('./../models/user');
const {todos,populateTodos,users,populateUsers}=require('./seed/seed');

/*const todos=[{
	_id:new ObjectID(),
	text:'First test todo'
},{
	_id:new ObjectID(),
	text:'Second test todo'
}];*/

/*beforeEach((done)=>{
	todo.remove({}).then(()=>{
		return todo.insertMany(todos);
	}).then(()=>done());
});*/

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/todos',()=>{
	it('should create a new todo',(done)=>{
		var text='Test todo text';
		
		request(app)
		.post('/todos')
		.set('x-auth',users[0].tokens[0].token)
		.send({text})
		.expect(200)
		.expect((res)=>{
			expect(res.body.text).toBe(text);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
			todo.find({text}).then((todos)=>{
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e)=>done(e));
		});
		});
		
	it('should not create Todo with invalid body data',()=>{
	
request(app)
		.post('/todos')
		.set('x-auth',users[0].tokens[0].token)
		.send()
		.expect(400)
		/*.expect((res)=>{
			expect(res.body.text).toBe(text);
		})*/
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
			todo.find({}).then((todos)=>{
				expect(todos.length).toBe(2);
				//expect(todos[0].text).toBe(text);
				done();
			}).catch((e)=>done(e));
		});
		
		
	});
	
});

describe('GET/todos',()=>{
	it('should get all todos',(done)=>{
		request(app)
		.get('/todos')
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(1);
			
		})
		.end(done);
	});
});

var idString=todos[0]._id.toHexString();
var idString2=todos[1]._id.toHexString();
var url="/todos/"+idString;
var url2="/todos/"+idString2;

describe('GET/todos/:id',()=>{
	it('should get todos for that id',(done)=>{
		request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.get(url)
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.Todo.text).toBe(todos[0].text);
		})
		.end(done);
	});
	
	it('should not return todo doc created by other user',(done)=>{
	request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.get(url2)
		.set('x-auth',users[0].tokens[0].token)
		.expect(404)
		//.expect((res)=>{
			//expect(res.body.Todo.text).toBe(todos[0].text);
		//})
		.end(done);	
	});
	
	it('shoulg return 404 for non-object ids',(done)=>{
	request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.get("/todos/6b474367c9d")
		.set('x-auth',users[0].tokens[0].token)
		.expect(404)
		//.expect((res)=>{
			//expect(res.body.Todo.text).toBe(todos[0].text);
		//})
		.end(done);	
	});
});


describe('DELETE/todos/:id',()=>{
	it('should delete todos for that id',(done)=>{
		request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.delete(url2)
		.set('x-auth',users[1].tokens[0].token)
		.expect(200)
		
		.expect((res)=>{
		expect(res.body.Todo._id).toBe(idString);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
		todo.findById(idString).then((Todo)=>{
			expect(Todo).toBeFalsy();
			done();
		}).catch((e)=>done(e));
		});
	});
	
	it('should not delete todos for that id',(done)=>{
		request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.delete(url)
		.expect(404)
		.set('x-auth',users[1].tokens[0].token)
		//.expect((res)=>{
			//expect(res.body.Todo._id).toBe(idString);
		//})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
		todo.findById(idString).then((Todo)=>{
			expect(Todo).toBeTruthy();
			done();
		}).catch((e)=>done(e));
		});
	});
	
it('should return 404 if todo not found',(done)=>{
	request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.delete("/todos/64844369d")
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		//.expect((res)=>{
			//expect(res.body.Todo.text).toBe(todos[0].text);
		//})
		.end(done);	
	});
	
	it('shoulg return 404 for non-valid ids',(done)=>{
	request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.delete("/todos/6b474367c9d")
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		//.expect((res)=>{
			//expect(res.body.Todo.text).toBe(todos[0].text);
		//})
		.end(done);	
	});
});

describe('PATCH/todos/:id',()=>{
	it('should update the todo',(done)=>{
		var text="this should be the new text";
		
		request(app)
		.patch(url)
		.set('x-auth',users[0].tokens[0].token)
		.send({
			completed:true,
			text
		})
		.expect(200)
		.expect((res)=>{
			expect(res.body.Todo.text).toBe(text);
			expect(res.body.Todo.completed).toBe(true);
			//expect(res.body.Todo.completedAt).toBeA("number");
		})
		.end(done);
	});
	
	
	it('should not update the todo',(done)=>{
		var text="this should be the new text";
		
		request(app)
		.patch(url)
		.set('x-auth',users[1].tokens[0].token)
		.send({
			completed:true,
			text
		})
		.expect(404)
		.expect((res)=>{
			expect(res.body.Todo.text).toBe(text);
			expect(res.body.Todo.completed).toBe(true);
			//expect(res.body.Todo.completedAt).toBeA("number");
			expect(typeof res.body.Todo.completedAt).toBe("number");
		})
		.end(done);
	});
	
	
	it('should clear completedAt when todo is not completed',(done)=>{
		var hexId=todos[1]._id.toHexString();
		var text="this should be the new text";
		var url2="/todos/"+hexId;
		
		request(app)
		.patch(url2)
		.set('x-auth',users[1].tokens[0].token)
		.send({
			completed:false,
			text
		})
		.expect(200)
		.expect((res)=>{
			expect(res.body.Todo.text).toBe(text);
			expect(res.body.Todo.completed).toBe(false);
			expect(res.body.Todo.completedAt).toBe(null);
		})
		.end(done);
	});
});


describe('GET/users/me',()=>{
	it('should return user if authenticated',(done)=>{
		request(app)
		.get('/users/me')
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done)
	});
	
	it('should return 401 if not authenticated',(done)=>{
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res)=>{
			expect(res.body).toEqual({});
		})
		.end(done);
	});
	
});


describe('POST/users',()=>{
	it('should create a user',(done)=>{
		var email='sachu@gmail.com';
		var password='123abc!'
		
		request(app)
		.post('/users')
		.send({email,password})
		.expect((res)=>{
		//expect(res.headers['x-auth']).toExist();
		//expect(res.body._id).toExist();
		expect(res.headers['x-auth']).toBeTruthy();
		expect(res.body._id).toBeTruthy();
		expect(res.body.email).toBe(email);
		})
		.end((err)=>{
			if(err){
				return done(err);
			}
		User.findOne({email}).then((user)=>{
			expect(user).toBeTruthy();
			expect(user.password).not.toBe(password);
			done();
		});
		});
	});
	
it('should return validation errors if request invalid',(done)=>{
	request(app)
	.post('/users')
	.send({
		email:'dgh',
		password:'fdg'
	})
	.expect(400)
	.end(done);
});
	
	
	it('should not creare user if email in use',(done)=>{
	request(app)
	.post('/users')
	.send({
		email:users[0].email,
		password:'Pdfhh@34'
	})
	.expect(400)
	.end(done);	
	});
	
});


describe('POST/users/login',()=>{
	it('should login user and return auth token',(done)=>{
		request(app)
		.post('/users/login')
		.send({
			email:users[1].email,
			password:users[1].password
		})
		.expect(200)
		.expect((res)=>{
			expect(res.header['x-auth']).toBeTruthy();
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
			User.findById(users[1]._id).then((user)=>{
				expect(user.toObject().tokens[1].toMatchObject({
					access:'auth',
					token:res.headers['x-auth']
				});
			done();	
			}).catch((e)=>done(e));
		});
	});
	
	it('should reject invalid login',(done)=>{
		request(app)
		.post('/users/login')
		.send({
			email:users[1].email,
			password:users[1].password+'1'
		})
		.expect(400)
		.expect((res)=>{
			expect(res.header['x-auth']).toBeFalsy();
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
			User.findById(users[1]._id).then((user)=>{
				expect(user.tokens.length).toBe(1);
			done();	
			}).catch((e)=>done(e));
		});
	});
});


describe('DELETE/users/me/token',()=>{
	it('should remove auth token on logout',(done)=>{
		request(app)
		.delete('/users/me/token')
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			
			User.findById(users[0]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e)=>done(e));
		});
	});
});
const expect=require('expect');
const request=require('supertest');

const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {todo}=require('./../models/Todo');


const todos=[{
	_id:new ObjectID(),
	text:'First test todo'
},{
	_id:new ObjectID(),
	text:'Second test todo'
}];

beforeEach((done)=>{
	todo.remove({}).then(()=>{
		return todo.insertMany(todos);
	}).then(()=>done());
});

describe('POST/todos',()=>{
	it('should create a new todo',(done)=>{
		var text='Test todo text';
		
		request(app)
		.post('/todos')
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
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(2);
			
		})
		.end(done);
	});
});

var idString=todos[0]._id.toHexString();
var url="/todos/"+idString;

describe('GET/todos/:id',()=>{
	it('should get todos for that id',(done)=>{
		request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.get(url)
		.expect(200)
		.expect((res)=>{
			expect(res.body.Todo.text).toBe(todos[0].text);
		})
		.end(done);
	});
	
	it('should return 404 if todo not found',(done)=>{
	request(app)
		//.get('/todos/'+todos[0]._id.toHexString())
		.get("/todos/64844369d")
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
		.expect(404)
		//.expect((res)=>{
			//expect(res.body.Todo.text).toBe(todos[0].text);
		//})
		.end(done);	
	});
});



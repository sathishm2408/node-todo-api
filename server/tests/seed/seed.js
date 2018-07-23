const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const {todo}=require('./../../models/Todo');
const {User}=require('./../../models/user');


const userOneId=new ObjectID();
const userTwoId=new ObjectID();

const users=[{
	_id:userOneId,
	email:'sachu1@gmail.com',
	password:'abc123',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
	}]
},{
_id:userTwoId,
	email:'sachu2@gmail.com',
	password:'abc234',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
}]
}]

const todos=[{
	_id:new ObjectID(),
	text:'First test todo'
},{
	_id:new ObjectID(),
	text:'Second test todo'
}];


const populateTodos=(done)=>{
	todo.remove({}).then(()=>{
		return todo.insertMany(todos);
	}).then(()=>done());
};


const populateUsers=(done)=>{
	User.remove({}).then(()=>{
		var userOne=new User(users[0]).save();
		var userTwo=new User(users[1]).save();
		
		Promise.all([userOne,userTwo])
	}).then(()=>done());
};


module.exports={todos,populateTodos,users,populateUsers};
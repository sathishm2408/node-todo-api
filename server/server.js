
require('./config/config');

const {ObjectID}=require('mongodb');
const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {todo}=require('./models/Todo');
var {User}=require('./models/user');

var app=express();
const port=process.env.PORT||3000

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
//console.log(req.body);
var newTodo=new todo({
	text:req.body.text
});


newTodo.save().then((doc)=>{
	res.send(doc);
},(e)=>{
	res.status(400).send(e);
});
});

app.get('/todos',(req,res)=>{

todo.find({}).then((todos)=>{
				res.send({todos});
			},(e)=>{
			res.status(400).send(e);	
			});
		});


app.get('/todos/:id',(req,res)=>{
var id=req.params.id;
if(!ObjectID.isValid(id)){
	//res.send("the id is not present in db");
	res.status(404).send();
	}
todo.findById(id).then((Todo)=>{
	if(!Todo){
		return res.status(404).send();
	}
				res.send({Todo});
			},(e)=>{
			res.status(400).send(e);	
			});
		});
					

app.delete('/todos/:id',(req,res)=>{
var id=req.params.id;
if(!ObjectID.isValid(id)){
	//res.send("the id is not present in db");
	res.status(404).send();
	}
todo.findByIdAndRemove(id).then((Todo)=>{
	if(!Todo){
		return res.status(404).send();
	}
				res.send({Todo});
			}).catch((e)=>{
			res.status(400).send();	
			});
		});
		
app.patch('/todos/:id',(req,res)=>{
var id=req.params.id;

var body=_.pick(req.body,['text','completed']);

if(!ObjectID.isValid(id)){
	//res.send("the id is not present in db");
	return res.status(404).send();
	}
	
if(_.isBoolean(body.completed)&&body.completed){
	body.completedAt=new Date().getTime();
}else{
	body.completed=false;
	body.completedAt=null;
}
	
todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((Todo)=>{
	if(!Todo){
		return res.status(404).send();
	}
				res.send({Todo});
			}).catch((e)=>{
			res.status(400).send();	
			});
		});

	

	
app.post('/users',(req,res)=>{
	var body=_.pick(req.body,['email','password']);
	var user=new User(body);
	
	user.save().then(()=>{
	return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).send(user);
	//res.send(user);
	}).catch((e)=>{
		res.status(400).send(e);
	});
});
	
app.listen(port,()=>{
	console.log('started on port ');
});



module.exports={app};
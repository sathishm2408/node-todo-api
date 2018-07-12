const {ObjectID}=require('mongodb');

const express=require('express');
const bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {todo}=require('./models/Todo');
var {User}=require('./models/user');

var app=express();

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
	if(!todo){
		return re.status(404).send();
	}
				res.send({Todo});
			},(e)=>{
			res.status(400).send(e);	
			});
		});
					

app.listen(3000,()=>{
	console.log('started on port 3000');
});



module.exports={app};
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
app.listen(3000,()=>{
	console.log('started on port 3000');
});
//const MongoClient=require('mongodb').MongoClient;

const {MongoClient,ObjectID}=require('mongodb');

var obj=new ObjectID();
console.log(obj);

//var user={name:"sachu",age:22};
//var {name}=user;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
		if(err){
			return console.log('Unable to connect MongoDB server');
		}
		console.log('Connected to MongoDB server');
		
		const db=client.db('TodoApp');
		
	/*	db.collection('Todos').insertOne({
			text:'Something to do',
		completed:false
		},(err,result)=>{
			if(err){
				return console.log('Unable to insert todo');
			}
				console.log(JSON.stringify(result.ops,undefined,2));
			});*/
			
	/*	db.collection('Users').insertOne({
			name:"sathish",
			age:"22",
			location:"vanji"
		},(err,result)=>{
			if(err){
				return console.log('Unable to insert todo');
			}
				console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
		});
		*/
	client.close();
});
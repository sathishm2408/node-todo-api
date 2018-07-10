//const MongoClient=require('mongodb').MongoClient;

const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
		if(err){
			return console.log('Unable to connect MongoDB server');
		}
		console.log('Connected to MongoDB server');
		
		const db=client.db('TodoApp');
		
	/*	db.collection('Todos').findOneAndUpdate({
			_id:new ObjectID("5b40b20af76eb72428ff6fa6")
		},{
			$set:{
				completed:false
		}
		},
		{
		returnOriginal:true  
		}).then((result)=>{
			console.log(result);
		});

	*/

	db.collection('Users').findOneAndUpdate({
			_id:new ObjectID("5b406d1aa78f8323f08c9210")
		},{
			$set:{
				name:"sandhiya"
		},
		
			$inc:{
				age:-4
			}
		
		},
		{
		returnOriginal:false  
		}).then((result)=>{
			console.log(result);
			
		});
	client.close();	
});
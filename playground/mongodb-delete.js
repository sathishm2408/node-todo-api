//const MongoClient=require('mongodb').MongoClient;

const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
		if(err){
			return console.log('Unable to connect MongoDB server');
		}
		console.log('Connected to MongoDB server');
		
		const db=client.db('TodoApp');
		
		/*db.collection('Todos').deleteMany({text:"sleep properly"}).then((result)=>{
			console.log(result);
		});*/
		
		/*db.collection('Todos').deleteOne({text:"Something to do"}).then((result)=>{
			console.log(result);
		});*/
	
		db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
			console.log(result);
		});
		
	client.close();	
});
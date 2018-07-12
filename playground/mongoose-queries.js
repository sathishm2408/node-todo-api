const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');

var id="6554b46fb34b12ef72b3820f1e1";

if(!ObjectID.isValid(id)){
	console.log('ID not valid');
}
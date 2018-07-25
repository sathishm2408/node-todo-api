
var mongoose=require('mongoose');

var todo =mongoose.model("todo",{
	text:{
		type:String,
		required:true
	},
	completed:{
		type:Boolean,
		default:false
	},
	completedAt:{
		type:Number,
		default:null
	},
	_creator:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	}
	});
	
		
	module.exports={todo};
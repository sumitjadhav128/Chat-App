const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({

conversationId:{
type: mongoose.Schema.Types.ObjectId,
ref:"Conversation",
required:true
},

senderId:{
type: mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

text:String,

attachments:[String],

replyTo:{
type:mongoose.Schema.Types.ObjectId,
ref:"Message",
default:null
},

seenBy:[{
type: mongoose.Schema.Types.ObjectId,
ref:"User"
}],

reactions:[
{
userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
emoji:String
}
],

isEdited:{
type:Boolean,
default:false
},

isDeleted:{
type:Boolean,
default:false
}

},{timestamps:true});

module.exports = mongoose.model("Message", MessageSchema);
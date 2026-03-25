export default function MessageList({conversation}){

return(

<div style={{
flex:1,
overflowY:"scroll",
padding:"10px"
}}>

<h4>Messages for: {conversation._id}</h4>

</div>

);

}
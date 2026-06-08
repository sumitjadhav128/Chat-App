const User = require('../models/User');

// update profile
exports.updateProfile = async (req, res) => {

  const { avatar } = req.body;

  try {

    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    );

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// select users
exports.searchUsers = async (req,res)=>{

try{

const users = await User.find({
_id: { $ne: req.user.id },

$or:[
{
name:{
$regex:req.params.query,
$options:"i"
}
},
{
email:{
$regex:req.params.query,
$options:"i"
}
}
]
})
.select("_id name email");

res.status(200).json(users);

}catch(error){

res.status(500).json({
error:error.message
});

}

};

// get all users
exports.getAllUsers = async (req, res) => {

try {
  const users = await User.find(
  { _id: { $ne: req.user.id } },
  "name email"
);

res.json(users);
}
catch(error) {
  console.log(error)
}
};
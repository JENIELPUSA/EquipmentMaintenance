
const AsyncErrorHandler = require('../Utils/AsyncErrorHandler');
const CustomError = require('../Utils/CustomError');
const user=require('../Models/usermodel')
const Apifeatures = require('./../Utils/ApiFeatures');

// Halimbawa ng function sa iyong backend
exports.createUser = AsyncErrorHandler(async (req, res) => {
  const newUser = await user.create(req.body);

  res.status(200).json({   
      status: 'success',
      data:
        newUser
  });
});

exports.DisplayAll=AsyncErrorHandler(
    async(req,res)=>{
    const features = new Apifeatures(user.find(),req.query)
                              .filter()
                              .sort()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                              .limitFields()
                              .paginate()
                              
      let displayuser = await features.query;

    if (!displayuser) {
        return res.status(404).json({ message: 'No users found' });
      }

    res.status(200).json({
        status:'success',
        totalUser:displayuser.length,
        data:displayuser
    })

   
})

exports.deleteUser =AsyncErrorHandler(async(req, res) => {

    await user.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status:'success',
        data: null
    })

    
})

exports.Updateuser =AsyncErrorHandler(async (req,res,next) =>{
    const updateuser=await user.findByIdAndUpdate(req.params.id,req.body,{new: true});
     res.status(200).json({
        status:'success',
        data:
          updateuser
     }); 
  })


 exports.Getiduser =AsyncErrorHandler(async (req,res,next) =>{

    const users = await user.findById(req.params.id);
    if(!users){
       const error = new CustomError('User with the ID is not found',404); 
       return next(error);
    }
    res.status(200).json({
       status:'Success',
       data:users
    }); 
 })

 
exports.updatePassword =AsyncErrorHandler(async(req, res, next)=>{
    //GET CURRENT USER DATA FROM DATABASE
   const user = await user.findById(req.user._id).select('+password');

    //CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
    if(!(await user.comparePasswordInDb(req.body.currentPassword, user.password))){
        return next(new CustomError('The current password you provided is wrong',401));
    }


    //IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();


    //LOGIN USER & SEND JWT
    authController.createSendResponse(user, 200, res)
})

exports.signup = AsyncErrorHandler(async (req,res,next)=>{
    const {FirstName,Middle,LastName,email,password} = req.body;
    user.findOne({email:email})
    .then(user =>{
        if(user){
            res.json("Already Have an Account!")
        }else{
            User.create({FirstName:FirstName,Middle:Middle,LastName:LastName,email:email,password:password})
            .then(result => res.json(result))
            
            .catch(err => res.json(err))
        }
       
    }) .catch(err => res.json(err))
})

 


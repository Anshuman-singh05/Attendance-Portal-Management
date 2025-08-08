import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const registerUser= asyncHandler(async(req, res)=>{
    // console.log('--- REGISTER USER FUNCTION CALLED ---')
    const {name,email,password}=req.body;

    const userExist= await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("User already exists ");
    }

    const user= await User.create({
        name,
        email,
        password
    });
    if (user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }else{
        res.status(400);
        throw new Error("Invalid user data");
    }

});

const loginUser= asyncHandler(async (req, res)=>{
    // console.log('--- LOGIN USER FUNCTION CALLED ---');
    const{email,password}=req.body;

    const user= await User.findOne({email});

    if (user && (await user.matchPassword(password))){
        generateToken(res,user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const logoutUser= asyncHandler(async (req, res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'User logged out Successfully'});
});

const getUserProfile= asyncHandler(async (req, res)=>{
    res.status(200).json(req.user);
});

const updateUserProfile= asyncHandler(async (req,res)=>{
    // console.log('--- UPDATE USER PROFILE FUNCTION CALLED ---');
    const user= await User.findById(req.user._id);

    if(user){
        // console.log('User found:', user.name);
        // console.log('Data to update with:', req.body);
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;
        
        if(req.body.password && req.body.password !==''){
            // console.log('Password will be updated.');
            user.password=req.body.password;
        }

        
       try {
            // console.log('Attempting to save user...');
            const updatedUser = await user.save();
            // console.log('User saved successfully!');

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });

        } catch (saveError) {
            // console.error('--- ERROR WHILE SAVING ---:', saveError);
            res.status(400);
            throw new Error('Error while saving user. Email might be taken.');
        }

    } else {
        console.log('User not found with ID:', req.user._id);
        res.status(404);
        throw new Error('User not found');
    }
});

const addFaceDescriptor = asyncHandler(async (req, res) => {
  const { faceDescriptor } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.faceDescriptor = faceDescriptor;
    await user.save();
    res.status(200).json({ message: 'Face descriptor added successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getAllFaceDescriptors= asyncHandler(async(req,res)=>{
    const users= await User.find({faceDescriptor: {$exists: true, $not: {$size:0}}}).select('name email faceDescriptor');
    res.json(users);
});

const loginUserByFace = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('User not found for face login');
  }
});

export {registerUser, loginUser, logoutUser, getUserProfile,updateUserProfile, getAllFaceDescriptors, addFaceDescriptor, loginUserByFace};
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]; // Corrected split
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        }catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if(!token){
        res.status(401);
        throw new Error('No token');
    }
})

export default protect;

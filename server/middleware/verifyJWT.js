import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next)=> {
    const authHeader = req.headers.authorization
<<<<<<< HEAD
    // if(!authHeader?.startsWith('Bearer: ')){
    //     return res.status(401).json({message: 'Unauthorized'})
    // }
=======
    if(!authHeader?.startsWith('Bearer: ')){
        return res.status(401).json({message: 'Unauthorized'})
    }
>>>>>>> main

    const token = authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }

    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                return res.status(403).json({message: 'Forbidden'})
            }
            
            req.id = decoded.user.user_id
            next();
        }
    )
}

export default verifyJWT
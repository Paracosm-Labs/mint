import jwt from "jsonwebtoken";

const generateAuthToken = (userId) => {
    return jwt.sign({id : userId},process.env.SECRET, {noTimestamp:true, expiresIn : 24 * 60 * 60});
}

const verifyAuthToken = (req, res, next) => {
    let authToken = req.headers['x-access-token'];
    if(!authToken){
        console.error('authToken not available in req');
        return res.status(401).send('authToken not available in req');
    }
    jwt.verify(authToken, secret, (error, data) => {
        if(error){
            console.error(`Unauthorized access ${error}`);
            return res.status(402).send(`Unauthorized access ${error}`);
        }
        console.log(`Authorized ${data}`);
        next();
    })
}

const verifyUserByParamId = function(req, res, next){
    if(!req.params.id){
        console.error(`Require userId`);
        return res.status(403).send({auth : false, message : "verifification failed"});
    }
    let authToken = req.headers['x-access-token'];
    if(!authToken){
        console.error('authToken not available in req');
        return res.status(401).send('authToken not available in req');
    }
    jwt.verify(authToken, secret, (error, data) => {
        if(error){
            console.error(`Unauthorized access ${error}`);
            return res.status(402).send(`Unauthorized access ${error}`);
        }
        if(data.id != req.params.id){
            return res.status(403).send(`Unauthorized access ${error}`);
        }
        console.log(`Authorized ${data}`);
        next();
    })    
    next();
}

module.exports = {
    generateAuthToken,
    verifyAuthToken,
    verifyUserByParamId
}

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
    console.log('req.body==>',req.body);
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req,res) => {
    const { email, password, deviceToken } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(req.body.email,req.body.password);
    const tokens = await tokenService.generateAuthTokens(user);
    if (deviceToken) {
        user.deviceToken = deviceToken;
        if (deviceToken) await userService.updateUserById(user._id, user);
    }
    let emailsend;
    if(!!user && !!tokens){
        console.log('Email sent succesfully');
        emailsend = await emailService.sendEmail(user.email,'Login Succesfully','You are login succesfully..!!');
    }
    res.send({ user, tokens, emailsend });
});

module.exports = {
    register,login
};
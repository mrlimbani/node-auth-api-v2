const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const  userSchema = mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true,
        },
        lastName:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            lowercase: true,
            trim:true,
            unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email');
                }
            },
        },
        password:{
            type:String,
            required:true,
            minlength:8,
            validate(value){
                if(!value.match(/\d/) || !value.match(/[a-zA-Z]/) ){
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        role:{
            type:String,
            enum:['user','admin'],
            default:'user',
            required:true,
        },
        displayName:{
            type:String,
            trim:true,
        },
        dob:{
            type:String,
            required:true,
        },
        privacy:{
            type:String,
            required:true,
        },
        deviceToken:{
            type:String,
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(require('mongoose-aggregate-paginate-v2'));

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

/**
 * Check if User is On Some Party
 * @param {string} id - The user's id
 * @returns {Promise<boolean>}
 */
userSchema.statics.isOnParty = async function (id) {
    const user = await this.findOne({ _id: id, onParty: { $ne: false }, party: { $exists: true } });
    if (user && user.partyLeaveReason === 'timeout') {
        return false;
    }
    return !!user;
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

User.aggregatePaginate.options = {
    customLabels: { docs: 'results', totalDocs: 'totalResults' },
};

module.exports = User;

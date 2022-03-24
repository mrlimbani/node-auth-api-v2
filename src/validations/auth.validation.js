const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { password } = require('./custom.validation');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        displayName: Joi.string(),
        dob: Joi.date()
            .format('DD/MM/YYYY')
            .max(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18))
            .message('Age Should be Greater than 18')
            .raw()
            .required(),
        privacy: Joi.string().required(),
        deviceToken: Joi.string()
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        deviceToken: Joi.string(),
    }),
};

const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const changePassword = {
    body: Joi.object().keys({
        password: Joi.string().required(),
    }),
};

const updateUserInfo = {
    body: Joi.object().keys({
        display_name: Joi.string(),
        profileImage: Joi.string(),
    }),
};

const apps = {
    body: Joi.object().keys({
        appname: Joi.string().required(),
        status: Joi.string().required(),
        // bannerImage: Joi.string()
    }),
};

const editapps = {
    body : Joi.object().keys({
        appname : Joi.string().required(),
        status : Joi.string().required(),
        appid : Joi.string().required(),
    }),
};

const deleteapp = {
    body : Joi.object().keys({
        appid : Joi.string().required(),
    }),
};

const groups = {
  body : Joi.object().keys({
     groupname : Joi.string().required(),
     appid : Joi.string().required(),
     status: Joi.string().required(),
  }),
};

const editgroups = {
    body : Joi.object().keys({
        groupid : Joi.string().required(),
        groupname : Joi.string().required(),
        appid : Joi.string().required(),
        status: Joi.string().required(),
    }),
};

const deletegroups = {
    body : Joi.object().keys({
        groupid : Joi.string().required(),
    }),
};

const groupsbyapp = {
    body : Joi.object().keys({
        appid : Joi.string().required(),
    }),
};

const stickers = {
    body : Joi.object().keys({
        groupid : Joi.string().required(),
        appid : Joi.string().required(),
        status: Joi.string().required(),
    }),
};

const editstickers = {
    body : Joi.object().keys({
        groupid : Joi.string().required(),
        stickerid : Joi.string().required(),
        appid : Joi.string().required(),
        status: Joi.string().required(),
    }),
};

const deletestickers = {
    body : Joi.object().keys({
        stickerid : Joi.string().required(),
    }),
};

module.exports = {
    register,
    login,
    refreshTokens,
    forgotPassword,
    resetPassword,
    logout,
    changePassword,
    updateUserInfo,
    apps,
    editapps,
    deleteapp,
    groups,
    groupsbyapp,
    editgroups,
    deletegroups,
    stickers,
    editstickers,
    deletestickers,
};

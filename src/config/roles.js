const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getGames', 'getMarket']);
roleRights.set(roles[1], [
    'getUsers',
    'manageUsers',
    'getGames',
    'getMarket',
    'manageGames',
    'manageMarket',
    'getFeedBacks',
]);

module.exports = {
    roles,
    roleRights,
};

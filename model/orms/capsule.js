const db = require('../db');
const prefix = require('../config').prefix;
let orm = {
    openid: {
        type: db.STRING(20),
        comment: 'Open Id'
    },
    creator: {
        type: db.STRING(20),
        comment: 'Creato Open Id'
    },
    content: {
        type: db.TEXT,
        comment: '内容'
    },
    expiry_time: {
        type: db.INTEGER,
        comment: '到期日'
    },
    readed: {
        type: db.BOOLEAN,
        comment: '已读'
    }
};
let table_name = prefix + 'capsule';
module.exports = db.defineModel(table_name, orm, {
    comment: '胶囊内容表',
});
module.exports.db = db;
module.exports.tb = table_name;
module.exports.keys = function () {
    return Object.keys(orm);
};
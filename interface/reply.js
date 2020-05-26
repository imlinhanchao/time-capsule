const Capsule = require('./capsule');

let replyConfig = {
    text: {
        role: [
            {
                test: /来一颗/,
                reply(content, openid) {
                    return ''
                }
            }
        ],
        key: 'Content'
    },
    event: {
        role: [
            {
                test: 'subscribe',
                reply: `欢迎关注！`
            }
        ],
        key: 'Event'
    },
    action: {

    },
    all: `时间胶囊指令：

    `
};

function newReplyFn(name, openid, fn, type = 'action') {
    if (!replyConfig[type]) replyConfig[type] = {};
    let fnName = `${name}_${openid}`;
    replyConfig[type][fnName] = fn;
    return `${name}_${openid}`;
}

module.exports = replyConfig;
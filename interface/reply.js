let replyConfig = {
    text: {
        role: [

        ],
        key: 'Content'
    },
    event: {
        role: [

        ],
        key: 'Event'
    },
    action: {

    },
    all: `Welcome
    `
};

function newReplyFn(name, openid, fn, type = 'action') {
    if (!replyConfig[type]) replyConfig[type] = {};
    let fnName = `${name}_${openid}`;
    replyConfig[type][fnName] = fn;
    return `${name}_${openid}`;
}

module.exports = replyConfig;
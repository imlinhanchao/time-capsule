const App = require('./app');
const config = require('../config').weixin;
const wechat = require('wechat');
const API = require('wechat-api');
const api = new API(config.appid, config.appsecret);
const replyCfg = require('./reply');

let __error__ = Object.assign({}, App.error);

class Module extends App {
    constructor(session) {
        super([]);
        this.session = session;
    }

    get error() {
        return __error__;
    }

    sign(data, callback) {
        let keys = ['apiList', 'url'];
        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        var param = {
            debug: false,
            jsApiList: data.apiList,
            url: data.url
        };
        api.getJsConfig(param, (err, result) => callback(err || result));
    }

    static loader(req, res, next) {
        return wechat(config, async (req, res/*, next*/) => {
            // 微信输入信息都在req.weixin上
            let message = req.weixin;
            try {
                console.info(JSON.stringify(message));
                console.info(JSON.stringify(req.wxsession));
    
                let replyRole = replyCfg[type] && replyCfg[type].role;
                let content = replyCfg[type] && replyCfg[type].key && message[replyCfg[type].key].replace(/^\s+|\s+$/g, '');
                content = message.EventKey || content;
                let reply = {
                    content: '',
                    type: 'text'
                };
    
                if (type == 'image' && req.wxsession.image) {
                    let imagefn = replyCfg[type][req.wxsession.image];
                    return WxLib.media.upload(message.PicUrl, 'image', async (err, result) => {
                        reply.content = replyCfg['all'];                    
                        if (!imagefn) res.reply(reply);
                        let content = await imagefn(err, result, openid);
                        reply.content = content;
                        res.reply(reply);
                    });
                }
    
                replyCfg['action'][req.wxsession.image] = undefined;
                req.wxsession.image = undefined;
    
                if (req.wxsession.action) {
                    let role = replyCfg['action'][req.wxsession.action];
                    replyCfg['action'][req.wxsession.action] = undefined;
                    req.wxsession.action = undefined;
                    if (typeof role === 'string') {
                        reply.content = role;
                    } else if (typeof role === 'function') {
                        reply.content = await role.apply(req, [content, openid, req.wxsession]);
                    } else if (typeof role === 'object') {
                        reply = role;
                    }
                }
    
                if (reply.content.length <= 0 && replyRole && replyRole.length) {
                    for (let i in replyRole) {
                        let role = replyRole[i].reply;
                        let mats = [];
                        if (replyRole[i].test instanceof RegExp) {
                            mats = replyRole[i].test.exec(content);
                            if (!mats) continue;
                        } else if (typeof replyRole[i].test === 'string') {
                            if (replyRole[i].test.replace(/^\s+|\s+$/g, '') != content)
                                continue;
                        }
                        if (typeof role === 'string') {
                            reply.content = role;
                            for (let j = 1; j < mats.length; j++) {
                                reply.content = role.replace(new RegExp(`#${j}#`, 'g'), mats[j]);
                            }
                        } else if (typeof role === 'function') {
                            let r = await role.apply(req, [content, openid, api]);
                            if (!r) continue;
                            reply.content = r;
                        } else if (typeof role === 'object') {
                            reply = role;
                        }
                        break;
                    }
                }
    
                if (typeof reply.content == 'object' && reply.content.type == 'image') {
                    let mediaid = reply.content.mediaid;
                    reply.content = reply.content.text;
                    return api.sendImage(openid, mediaid, function (err) {
                        if (!err) return res.reply(reply);
                        console.error(`发送图片错误：${err}, mediaid: ${mediaid}`);
                        res.reply({
                            type: 'text',
                            content: 'Ops! 服务器开小差了，请稍后重试~ヾ(;ﾟдﾟ)/'
                        });
                    });
                }
    
                if (reply.content instanceof Array) {
                    reply = reply.content;
                }
    
                if (reply.content != undefined && reply.content.length <= 0) {
                    reply.content = replyCfg['all'];
                }

                res.reply(reply);
            } catch (err) {
                console.error('处理微信回复错误：', err, 'message:', JSON.stringify(message));
                res.reply({
                    type: 'text',
                    content: 'Ops! 服务器开小差了，请稍后重试~ヾ(;ﾟдﾟ)/'
                });
            }
        })(req, res, next);
    }
}
module.exports = Module;

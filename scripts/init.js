const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('../config.json');
const uuidv4 = require('uuid/v4');

const randomStr = () => randomUp(Math.random().toString(36).substr(2));
const randomUp = s => s.split('').map(s => parseInt(Math.random() * 10) % 2 ? s : s.toUpperCase()).join('');

async function main() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let inputData = function (key, defaultVal) {
        return new Promise((resolve, reject) => {
            try {
                rl.question(`${key}: ` + (defaultVal ? `[${defaultVal}]` : ''), function (val) {
                    resolve(val || defaultVal);
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    console.info('Let\'s config website.');

    if (config.base['identityKey'] == ''
        || await inputData('Do you want to reset safe key config (identityKey etc.) ?', 'N') == 'Y') {
        config.base['identityKey'] = '_LIB_SESSION_ID_' + randomStr();
        config.base['secret'] = randomStr() + randomStr();
        config.base['salt'] = randomUp(uuidv4());
    }
    config.base['port'] = parseInt(await inputData('Port', config.base['port']));
    config.base['domain'] = await inputData('Domain', config.base['domain']);

    config.base['name'] = await inputData('Website Name', config.base['name']);
    
    config.file['maxSize'] = await inputData('Max Size File Upload(MB)', config.file['maxSize']);
    
    config.db['port'] = parseInt(await inputData('Database Port', config.db['port']));
    config.db['database'] = await inputData('Database Name', config.db['database']);
    config.db['prefix'] = await inputData('Table Prefix', config.db['prefix']);
    config.db['logging'] = await inputData('Log SQL Execute', config.db['logging'] ? 'Y' : 'N') == 'Y';

    let dbConfig = Object.assign({}, config.db);
    dbConfig['host'] = await inputData('Database Host', 'localhost');
    dbConfig['user'] = await inputData('Database User', 'root');
    dbConfig['password'] = await inputData('Database Password', '');
    
    if (await inputData('Do you config WeiXin? ', 'Y') == 'Y') {
        config.weixin['appid'] = await inputData('App Id', config.weixin['appid']);
        config.weixin['appsecret'] = await inputData('App Secret', config.weixin['appsecret']);
        config.weixin['encodingAESKey'] = await inputData('Encoding AESKey', config.weixin['encodingAESKey']);        
        config.weixin['token'] = await inputData('Token', config.weixin['token']);        
    }

    fs.writeFile(path.join(__dirname, '../config.json'),
        JSON.stringify(config, null, 4),
        (err) => {
            if (err) console.error(`Save website config failed: ${err.message}`);
            else {
                // Save DB Config
                fs.writeFile(path.join(__dirname, '../model/config.json'),
                    JSON.stringify(dbConfig, null, 4),
                    (err) => {
                        if (err) console.error(`Save db config failed: ${err.message}`);
                        else initDB();
                    });        
            }
        });
    rl.close();

}

function initDB () {
    (async () => {
        const model = require('../model');
        try {
            await model.sync();
            console.info('Init all model finish.');
        } catch (err) {
            console.error(`Init model failed: ${err.message}`);                
        }
        console.info('Please execute \'npm run build\' to build frontend, and then execute \'npm  start\' to start the website.');
        process.exit();
    })();
}

main();
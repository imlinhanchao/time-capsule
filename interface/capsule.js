const model = require('../model');
const App = require('./app');
const Capsule = model.capsule;
const path = require('path');

let __error__ = Object.assign({}, App.error);
__error__.notexisted = App.error.existed('胶囊', false);

class Module extends App {
    constructor(session, read) {
        super([]);
        this.name = '胶囊';
        this.session = session;
        this.saftKey = Capsule.keys().concat(['create_time']);
    }

    get error() {
        return __error__;
    }

    async new(data) {
        try {
            return this.okcreate(
                App.filter(await super.new(data, Capsule), this.saftKey)
            );
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async set(data) {
        try {
            let { openid, readed } = data;
            data = { openid, readed };
            return this.okupdate(
                App.filter(await super.set(data, Capsule), this.saftKey));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async get(id, onlyData = false) {
        let book = await Capsule.findOne({
            where: { id }
        });

        if (!book) {
            throw this.error.notexisted;
        }

        if (onlyData) return App.filter(book, this.saftKey);

        return this.okquery(App.filter(book, this.saftKey));
    }
    
    async query(data, onlyData = false) {
        // $ = like
        let ops = {
            openid: App.ops.equal,
            creator: App.ops.equal
        };

        try {
            let queryData = await super.query(
                data, Capsule, ops
            );

            if (onlyData) return queryData;
            return this.okquery(queryData);
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }
}

module.exports = Module;
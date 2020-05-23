# 时间胶囊公众号后端

## 功能

- [ ] Time Capsule

## 目录说明
1. bin - 服务启动入口  
2. interface - 业务接口实现   
4. lib - 公共类库  
5. pubilc - 静态资源  
6. routes - 服务路由  
7. view - 视图  
8. script - 脚本 

## 配置说明
1. 新建数据库`db`(根据需要，第二步配置时填入)；
2. 执行`npm run init`，并根据提示填写信息（仅第一次）；
3. 若需要重新配置数据库，则运行`npm run initdb`。
4. 若需要重置某个表，如：重置`account`表，则执行`npm run initdb -- account`。

# 调试说明
1. 执行`npm install`;
2. 前端执行`npm run dev`，后端使用 Visual Studio Code 运行调试（直接按下`F5`即可）。

## 部署说明
服务器需安装`nodejs`和`npm`。部署执行如下脚本：
```bash
npm install
```

编译前端代码：  
```bash
npm run build
```

启动服务：
```bash
npm start
```

以守护进程方式，启动服务：
```bash
forever start ./bin/www
```
or
```bash
pm2 start ./bin/www
```

## 端口号
- 6789 （可在`config.json`或`npm run init`配置）

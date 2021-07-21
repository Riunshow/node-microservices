# node-microservices
> node koa prisma zookeeper microservices
---
* http svc ->  dependencies-collect-svc
* rpc svc  ->  message-notice-svc

## How to run
1. gateway, svc 进行依赖安装
2. 跑起来 zookeeper -> 端口指向: 127.0.0.1:2181
3. 依次跑svc, 会自动注册到 zk 里,  dependencies-collect-svc: 127.0.0.1:3001, message-notice-svc: 127.0.0.1:3002
4. 然后跑 gateway 去进行服务发现与服务调用, gateway: 127.0.0.1:3000
5. http 服务 dependencies-collect-svc/test/test.http 为对应接口测试, rpc 测试在 ProtoFiles 目录下

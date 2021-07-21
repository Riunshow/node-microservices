export default {
  identity: 'development',
  port: 3001,
  host: "127.0.0.1", //服务部署地址
  rootPath: '/services', //zk 根节点
  serviceName: 'collect', //当前服务名称 全网唯一
  zkHost: '127.0.0.1:2181' //zk 地址
}

import { createClient, CreateMode } from 'node-zookeeper-client'
import { host, port, rootPath, zkHost, serviceName } from '../../configs'

//连接zookeeper服务中心
const CONNECTION_STRING = zkHost
const zk = createClient(CONNECTION_STRING)
zk.connect()
//连接成功后开始注册服务
zk.once('connected', () => {
  registerRootPath()
})

/**
 * 注册根节点
 */
function registerRootPath() {
  //检测根节点是否存在
  zk.exists(rootPath, (err, stat) => {
    if (err) {
      throw err
    }
    if (stat == null) { //根节点不存在，先创建根节点
      zk.create(rootPath, (err, path) => {
        if (err) {
          throw err
        }
        registerService()
      })
    } else {
      registerService()
    }
  })
}

/**
 * 注册服务节点
 */
function registerService() {
  const servicePath = rootPath + '/' + serviceName
  console.log('注册服务: ', servicePath)
  //判断服务节点是否存在
  zk.exists(servicePath, (err, stat) => {
    if (err) {
      throw err
    }
    if (stat == null) { //服务节点不存在，先创建服务节点
      zk.create(servicePath, (err, path) => {
        if (err) {
          throw err
        }
        registerAddressNode()
      })
    } else {
      registerAddressNode()
    }
  })
}

/**
 * 注册地址节点
 */
function registerAddressNode() {
  const addressPath = `${rootPath + '/' + serviceName}/address-`
  const serviceAddress = `${host}:${port}`
  zk.create(addressPath, Buffer.from(serviceAddress), CreateMode.EPHEMERAL_SEQUENTIAL, (err, path) => {
    if (err) {
      throw err
    }
    console.log(addressPath, serviceAddress, 'create over')
  })
}


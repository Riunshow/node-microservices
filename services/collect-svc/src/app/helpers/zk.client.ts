import { ACL, createClient, CreateMode } from 'node-zookeeper-client'
import { zkRootPath, serviceName, ZK_HOST, PORT, HOST } from '../../configs/environments'

//连接zookeeper服务中心
const zk = createClient(ZK_HOST)
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
  zk.exists(zkRootPath, (err, stat) => {
    if (err) {
      throw err
    }
    if (stat == null) { //根节点不存在，先创建根节点
      zk.create(zkRootPath, (err, path) => {
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
  const servicePath = zkRootPath + '/' + serviceName
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
  const addressPath = `${zkRootPath + '/' + serviceName}/address-`
  const serviceAddress = `${HOST}:${PORT || '3000'}`
  zk.create(addressPath, Buffer.from(serviceAddress), CreateMode.EPHEMERAL_SEQUENTIAL, CreateMode.EPHEMERAL_SEQUENTIAL, (err, path) => {
    if (err) {
      throw err
    }
    console.log(addressPath, serviceAddress, 'create over')
  })
}


import { createClient, Client } from 'node-zookeeper-client'
import * as Environments from '../../configs/environments'

const promisify = require('util').promisify

//连接zookeeper服务中心
const zk: Client = createClient(Environments.ZK_HOST)

// 让zkClient支持promise
const proto = Object.getPrototypeOf(zk)

Object.keys(proto).forEach(fnName => {
  const fn = proto[fnName]
  if (proto.hasOwnProperty(fnName) && typeof fn === 'function') {
    zk[`${fnName}Async`] = promisify(fn).bind(zk)
  }
})

zk.connect()

//连接成功后共享服务
zk.once('connected', () => {
  (global as any).zk = zk
})

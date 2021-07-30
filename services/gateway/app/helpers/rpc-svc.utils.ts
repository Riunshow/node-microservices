import * as config from '../../configs/environments'

export default async function getServiceAddress(serviceName) {
  return new Promise(async (resolve, reject) => {
    const zk = (global as any).zk

    const servicePath = `${config.zkRootPath}/${serviceName}`
    const addressNodes = await zk.getChildrenAsync(servicePath)
    const size = addressNodes.length

    if (size === 0) {
      return reject({
        code: 400004,
        msg: 'no service found.'
      })
    }
    let addressPath = `${servicePath}/`
    if (size === 1) {
      addressPath += addressNodes[0]
    } else {
      // 这里可以做负载均衡
      addressPath += addressNodes[parseInt(String(Math.random() * size))]
    }
    const serviceAddress = await zk.getDataAsync(addressPath)
    if (!serviceAddress) {
      return reject({
        code: 400004,
        msg: 'no service found.'
      })
    }
    resolve(serviceAddress.toString('utf-8'))
  })
}
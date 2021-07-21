import getServiceAddress from '../helpers/rpc-svc.utils'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import ProtoPath from '../helpers/protoPath'

const ServiceName = 'message'

async function rpcSvc(packageName, svcName) {
  let serviceAddress = await getServiceAddress(ServiceName)
  const packageDefinition = protoLoader.loadSync(ProtoPath.message, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })

  const rpcPackage = grpc.loadPackageDefinition(packageDefinition)[packageName]
  return new rpcPackage[svcName](serviceAddress, grpc.credentials.createInsecure())
}

export async function msgListHistory () {
  return new Promise(async(resolve, reject) => {
    const client = await rpcSvc('Message', 'msgService')

    client.msgListHistory({ pageNo: 10, pageSize: 1 }, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

import { RpcRegistry, Settings } from '../../rpcContainer'
import { PORT, HOST, GRPC_PORT } from '../../configs'

const settings = {
  PORT: GRPC_PORT,
  HOST
}

@Settings(settings)
class RPC extends RpcRegistry {
}

RPC.start()
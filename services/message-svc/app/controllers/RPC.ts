import { RpcRegistry, Settings } from '../../rpcContainer'
import { PORT, HOST } from '../../configs'

const settings = {
  PORT,
  HOST
}

@Settings(settings)
class RPC extends RpcRegistry {
}

RPC.start()
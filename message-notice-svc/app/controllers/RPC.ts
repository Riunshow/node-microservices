import { RpcRegistry, Settings } from '../../rpcContainer'
import { port, host } from '../../configs'

const settings = {
  port,
  host
}

@Settings(settings)
class RPC extends RpcRegistry {
}

RPC.start()
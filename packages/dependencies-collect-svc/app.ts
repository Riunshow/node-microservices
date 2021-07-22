import { Server } from 'http'
import { print } from 'configs/utils'
import { port, identity } from 'configs/environments'
import createServer from 'configs/application'

import 'app/helpers/zk.client'

module.exports = (async (): Promise<Server> => {
  try {
    const app = await createServer()
    return app.listen(port, () => {
      print.log(`server listening on ${port}, in ${identity} mode.`)
    })
  } catch (e) {
    console.error(e)
  }
})()

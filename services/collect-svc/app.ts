import { Server } from 'http'
import { print } from 'configs/utils'
import { PORT, identity } from 'configs/environments'
import createServer from 'configs/application'

import 'app/helpers/zk.client'

module.exports = (async (): Promise<Server> => {
  try {
    const app = await createServer()
    return app.listen(PORT, () => {
      print.log(`server listening on ${PORT}, in ${identity} mode.`)
    })
  } catch (e) {
    console.error(e)
  }
})()

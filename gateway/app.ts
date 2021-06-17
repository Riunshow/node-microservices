import { Server } from 'http'
import { print } from 'configs/utils'
import Environment from 'configs/environments'
import createServer from 'configs/application'
import * as bootstrap from 'configs/bootstrap'

import './app/hepler/zk.client'


const app = async (): Promise<Server> => {
  try {
    const app = await createServer()

    return app.listen(Environment.port, () => {
      print.tip(`server listening on ${Environment.port}, in ${Environment.identity} mode.`)
      bootstrap.after()
    })
  } catch (e) {
    console.log(e)
  }
}

(async () => {
  let interval
  let interval_index: number = 0

  if ((global as any).zk) {
    await app()
  } else {
    interval = setInterval(() => {
      console.log(`try connect zk and run service  ${interval_index + 1} times`)
      if (interval_index >= 5) {
        return clearInterval(interval as any)
      }
      interval_index++
      if ((global as any).zk) {
        clearInterval(interval as any)
        app()
      }
    }, 1000)
  }
})()

import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { identity } from './environments'

export const useMiddlewares = <T extends Koa>(app: T): T => {
  identity !== 'test' && app.use(logger())

  app.use(bodyParser())

  return app
}

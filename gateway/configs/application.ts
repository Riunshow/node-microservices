import 'reflect-metadata'
import Koa from 'koa'
import { Container } from 'typedi'
import { routingConfigs } from './routing.options'
import { useMiddlewares } from './koa.middlewares'
import { useContainer, useKoaServer } from 'routing-controllers'

const createServer = async (): Promise<Koa> => {
  const koa: Koa = new Koa()

  useMiddlewares(koa)

  useContainer(Container)

  return useKoaServer<Koa>(koa, routingConfigs)
}

export default createServer

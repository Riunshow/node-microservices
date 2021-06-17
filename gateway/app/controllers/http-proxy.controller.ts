/**
 * http 服务代理
 */
import { JsonController, Get, Ctx } from 'routing-controllers'
import { Service } from 'typedi'
import * as Koa from 'koa'
import httpProxy from 'http-proxy'

import Environments from 'configs/environments'

@JsonController('/users')
@JsonController('/user2')
@Service()
export class httpProxyController {
  private proxy: any
  private readonly cacheServices: {}

  constructor() {
    // 已发现的服务 缓存起来
    this.cacheServices = {}

    //创建代理服务器对象并监听错误事件
    this.proxy = httpProxy.createProxyServer()
    this.proxy.on('error', (err, req, res) => {
      console.log('proxy error: ', err)
      return {
        success: false,
        message: 'proxy error: ' + err
      }
    })
  }

  @Get('/*')
  async query(@Ctx() ctx: Koa.Context) {
    // 获取服务名称
    const serviceName = ctx.request.url.split('/')[2] || ''

    // 生成服务地址
    const servicePath = Environments.zkRootPath + '/' + serviceName

    if (this.cacheServices[serviceName]) {
      console.log('-----------cache---------------' + this.cacheServices[serviceName])
      this.proxy.web(ctx.req, ctx.res, {
        target: Environments.identity === 'production' ? 'https://' : 'http://' + this.cacheServices[serviceName] //目标地址
      })
    } else {
      //获取服务路径下的地址节点
      const addressNodes = await (global as any).zk.getChildrenAsync(servicePath)

      const size: number = addressNodes.length
      if (size === 0) {
        console.log('address node error: address node is not exist')
        return {
          success: false,
          message: 'address node error: address node is not exist'
        }
      }
      //生成地址容器
      let addressPath = servicePath + '/'
      if (size === 1) {
        //若只有唯一地址，则获取该地址
        addressPath += addressNodes[0]
      } else {
        //若存在多个地址，则随机获取一个地址
        addressPath += addressNodes[parseInt(String(Math.random() * size), 10)]
      }
      console.log('addressPath:%s', addressPath)

      const serviceAddress = await (global as any).zk.getDataAsync(addressPath)

      console.log('serviceAddress:%s', serviceAddress)

      if (!serviceAddress) {
        console.log('serviceAddress is not exist')
        return {
          success: false,
          message: 'serviceAddress is not exist'
        }
      }

      this.cacheServices[serviceName] = serviceAddress

      const target = Environments.identity === 'production' ? 'https://' : 'http://' + this.cacheServices[serviceName] //目标地址
      console.log('proxy target: ', target)

      return this.proxy.web(ctx.req, ctx.res, { target })
    }
  }
}

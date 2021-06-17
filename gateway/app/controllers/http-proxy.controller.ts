/**
 * http 服务代理
 */
import { JsonController, All, Ctx } from 'routing-controllers'
import { Service } from 'typedi'
import * as Koa from 'koa'
import httpProxy from 'http-proxy'

import { print } from 'configs/utils'
import Environments from 'configs/environments'

@JsonController('/users')
@JsonController('/user2')
@Service()
export class httpProxyController {
  private readonly cacheServices: {}
  private proxy: any

  constructor() {
    // 已发现的服务 缓存起来
    this.cacheServices = {}
    this.proxy = httpProxy.createProxyServer()
  }

  @All('/*')
  async query(@Ctx() ctx: Koa.Context) {
    ctx.respond = false

    this.proxy.on('error', (err, req, res) => {
      print.danger('proxy error: ' + err)
      return {
        success: false,
        message: 'proxy error: ' + err
      }
    })

    // 获取服务名称
    const serviceName = ctx.request.url.split('/')[2] || ''

    // 生成服务地址
    const servicePath = Environments.zkRootPath + '/' + serviceName

    if (!this.cacheServices[serviceName]){
      //获取服务路径下的地址节点
      const addressNodes = await (global as any).zk.getChildrenAsync(servicePath)

      const size: number = addressNodes.length
      if (size === 0) {
        print.danger('address node error: address node is not exist')
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
      print.log('addressPath: ' + addressPath)

      const serviceAddress = await (global as any).zk.getDataAsync(addressPath)

      print.log('serviceAddress:' + serviceAddress)

      if (!serviceAddress) {
        print.danger('serviceAddress is not exist')
        return {
          success: false,
          message: 'serviceAddress is not exist'
        }
      }

      this.cacheServices[serviceName] = serviceAddress
    }

    print.log('-----------cache---------------' + this.cacheServices[serviceName])
    //目标地址
    const target = 'http://' + this.cacheServices[serviceName]

    this.proxy.web(ctx.req, ctx.res, { target })
  }
}

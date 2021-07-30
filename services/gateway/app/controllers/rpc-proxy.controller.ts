import {
  JsonController,
  Get,
  QueryParam,
  Ctx
} from 'routing-controllers'
import { Service } from 'typedi'
import { msgListHistory } from '../rpc-services/msg.svc'
import * as Koa from 'koa'

@JsonController('/message')
@Service()
export class rpcProxyController {

  @Get('/list')
  async queryList(
    @QueryParam('pageNo') pageNo: number = 1,
    @QueryParam('pageSize') pageSize: number = 1000,
    @Ctx() ctx: Koa.Context
  ): Promise<any> {
    return await msgListHistory()
  }
}

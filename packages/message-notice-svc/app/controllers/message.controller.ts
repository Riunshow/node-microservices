import { Route, Service } from '../../rpcContainer'
import ProtoPath from '@turbine/proto-files'
import prisma from '../helpers/client'
import { Prisma } from '@prisma/client'

type msgListHistoryReq = {
  pageSize: number
  pageNo: number
}

@Service(ProtoPath.message)
export class MessageController {
  @Route
  public async pushMsg(req) {
    console.log('req: ', req)

    const createArgs: Prisma.MessageCreateArgs = {
      data: { sender: 'sender-1', gitlabProjectId: 0, msgType: 'FEATURE', contentType: 'TEXT', content: '' }
    }
    const createRes = prisma.message.create(createArgs)

    return {
      success: true,
      msg: '消息推送成功',
      data: createRes
    }
  }

  @Route
  public async msgListHistory(req: msgListHistoryReq) {
    console.log('req: ', req)
    const { pageSize = 1000, pageNo = 1 } = req

    const take = pageSize
    const skip = (pageNo - 1) * pageSize
    const where = {
    }
    const include = {
    }

    const args: Prisma.MessageFindManyArgs = { where, take, skip }

    const data = prisma.message.findMany(args)

    return {
      success: true,
      msg: '历史列表获取成功',
      list: data
    }
  }
}
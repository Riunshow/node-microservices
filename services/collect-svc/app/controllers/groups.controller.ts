import {
  BadRequestError,
  JsonController,
  Get,
  Post,
  BodyParam,
  QueryParam,
  Params
} from 'routing-controllers'
import { Prisma } from '@turbine/schema'
import { Service } from 'typedi'

// types
import { Response, ListResponse } from 'types'

// services
import { GroupsService } from '../services'

@JsonController('/groups')
@Service()
export class GroupsController {
  constructor(private groupsService: GroupsService) {
  }

  /**
   * 分页查找全部 group
   * @param name group name
   * @param pageNo
   * @param pageSize
   */
  @Get('/list')
  async queryList(
    @QueryParam('name') name?: string,
    @QueryParam('pageNo') pageNo: number = 1,
    @QueryParam('pageSize') pageSize: number = 1000
  ): Promise<ListResponse<Prisma.GroupUncheckedCreateInput>> {
    const take = pageSize
    const skip = (pageNo - 1) * pageSize
    const where = {
      name: {
        contains: name || '',
      },
      parentId: {
        not: 1
      }
    }
    const include = {
      parentGroup: true,
      subGroup: true,
      project: true
    }

    const data = await this.groupsService.findAll({ where, include, take, skip })

    return {
      pageNo,
      pageSize,
      total: 0,
      success: true,
      message: '获取group列表成功',
      data
    }
  }

  /**
   * 根据Id获取单个 group 信息
   * @param params
   */
  @Get('/:id')
  async queryOneById(
    @Params() params: { id: string }
  ): Promise<Response<Prisma.GroupWhereUniqueInput>> {
    if (!params.id) {
      throw new BadRequestError('id is required')
    }

    const where = {
      id: parseInt(params.id, 10)
    }

    const include = {
      parentGroup: true,
      subGroup: true,
      project: true
    }

    const data = await this.groupsService.findOne({ where, include })

    return {
      success: true,
      message: '获取 group 信息成功',
      data
    }
  }

  /**
   * 创建 group(默认跑脚本去新增)
   * @param id
   * @param name
   * @param path
   * @param parentId 不传默认为根节点
   */
  @Post('/')
  async create(
    @BodyParam('id') id: number,
    @BodyParam('name') name: string,
    @BodyParam('path') path: string,
    @BodyParam('parentId') parentId: number = 1
  ): Promise<Response<Prisma.GroupUncheckedCreateInput>> {

    console.log(name, path, parentId)
    if (!name || !path || !parentId) {
      throw new BadRequestError('params is required')
    }
    const createArgs = {
      data: { id, name, path, parentId }
    }

    const data = await this.groupsService.create(createArgs)

    return {
      success: true,
      message: '新增 group 成功',
      data
    }
  }
}

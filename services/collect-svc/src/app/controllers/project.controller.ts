import {
  BadRequestError,
  JsonController,
  Get,
  Post,
  BodyParam,
  QueryParam,
  Params, Body
} from 'routing-controllers'
import { Prisma } from '@turbine/schema'
import { Service } from 'typedi'

// types
import { Response, ListResponse } from '../../types'

// services
import { ProjectService } from '../services'

@JsonController('/projects')
@Service()
export class ProjectController {
  constructor(private projectService: ProjectService) {
  }

  /**
   * 分页查找全部 project
   * @param name project name
   * @param pageNo
   * @param pageSize
   */
  @Get('/list')
  async queryList(
    @QueryParam('name') name?: string,
    @QueryParam('pageNo') pageNo: number = 1,
    @QueryParam('pageSize') pageSize: number = 1000
  ): Promise<ListResponse<any>> {
    const take = pageSize
    const skip = (pageNo - 1) * pageSize
    const where = {
      name: {
        contains: name
      }
    }
    const include = {
      group: true,
      dependencies: true
    }

    const data = await this.projectService.findAll({ where, include, take, skip })

    return {
      pageNo,
      pageSize,
      total: 0,
      success: true,
      message: '获取 project 列表成功',
      data
    }
  }

  /**
   * 根据Id获取单个 project 信息
   * @param params
   */
  @Get('/:id')
  async queryOneById(
    @Params() params: { id: string }
  ): Promise<Response<Prisma.ProjectWhereUniqueInput>> {
    if (!params.id) {
      throw new BadRequestError('id is required')
    }

    const where = {
      id: parseInt(params.id, 10)
    }

    const include = {
      group: true,
      dependencies: true
    }

    const data = await this.projectService.findOne({ where, include })

    return {
      success: true,
      message: '获取 project 信息成功',
      data
    }
  }

  /**
   * 创建 group(默认跑脚本去新增)
   * @param id
   * @param name
   * @param path
   * @param gid  groupId
   */
  @Post('/')
  async create(
    @BodyParam('id') id: number,
    @BodyParam('name') name: string,
    @BodyParam('path') path: string,
    @BodyParam('gid') gid: number
  ): Promise<Response<Prisma.ProjectUncheckedCreateInput>> {
    if (!name || !path || !gid) {
      throw new BadRequestError('params is required')
    }
    const createArgs = {
      data: { id, name, path, gid }
    }

    const data = await this.projectService.create(createArgs)

    return {
      success: true,
      message: '新增 project 成功',
      data
    }
  }
}
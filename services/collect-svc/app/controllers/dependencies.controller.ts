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
import { DependenciesService } from '../services'

@JsonController('/dependencies')
@Service()
export class DependenciesController {
  constructor(private dependenciesService: DependenciesService) {
  }

  /**
   * 分页查找全部 dependencies
   * @param name dependencies name
   * @param pageNo
   * @param pageSize
   */
  @Get('/list')
  async queryList(
    @QueryParam('name') name?: string,
    @QueryParam('pageNo') pageNo: number = 1,
    @QueryParam('pageSize') pageSize: number = 1000
  ): Promise<ListResponse<Prisma.DependenciesUncheckedCreateInput>> {
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
      project: true
    }

    const data = await this.dependenciesService.findAll({ where, include, take, skip })

    return {
      pageNo,
      pageSize,
      total: 0,
      success: true,
      message: '获取 dependencies 列表成功',
      data
    }
  }

  /**
   * 根据Id获取单个 dependencies 信息
   * @param params
   */
  @Get('/:id')
  async queryOneById(
    @Params() params: { id: string }
  ): Promise<Response<Prisma.DependenciesWhereInput>> {
    if (!params.id) {
      throw new BadRequestError('id is required')
    }

    const where = {
      id: parseInt(params.id, 10)
    }

    const include = {
      project: true
    }

    const data = await this.dependenciesService.findOne({ where, include })

    return {
      success: true,
      message: '获取 dependencies 信息成功',
      data
    }
  }

  @Post('/one')
  async queryByQuery(
    @BodyParam('pid') pid: number,
    @BodyParam('name') name: string,
    @BodyParam('version') version: string
  ): Promise<Response<Prisma.DependenciesWhereInput>> {
    if (!pid || !name || !version) {
      throw new BadRequestError('params is required')
    }

    const where = {
      pid,
      name,
      version
    }

    const include = {
      project: true
    }

    const data = await this.dependenciesService.findMany({ where, include })

    return {
      success: true,
      message: '获取 dependencies 信息成功',
      data: data[0]
    }
  }

  /**
   * 创建 group(默认跑脚本去新增)
   * @param id
   * @param name
   * @param pid
   * @param version
   * @param isDev    是否是 devDependencies
   */
  @Post('/')
  async create(
    @BodyParam('name') name: string,
    @BodyParam('pid') pid: number,
    @BodyParam('version') version: string,
    @BodyParam('isDev') isDev: boolean = false
  ): Promise<Response<Prisma.DependenciesUncheckedCreateInput>> {
    console.log(name, pid, version)
    if (!name || !pid || !version) {
      throw new BadRequestError('params is required')
    }
    const createArgs = {
      data: { name, pid, version, isDev }
    }

    const data = await this.dependenciesService.create(createArgs)

    return {
      success: true,
      message: '新增 group 成功',
      data
    }
  }
}

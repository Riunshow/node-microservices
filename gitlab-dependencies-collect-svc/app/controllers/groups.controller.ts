import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  QueryParam,
  Get,
} from 'routing-controllers'
import { GroupsService } from '../services'
import { Prisma } from '@prisma/client'
import { Service } from 'typedi'

@JsonController('/groups')
@Service()
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get('/groups')
  async query(
    @QueryParam('name') name: string,
    @QueryParam('pageNo') pageNo: number,
    @QueryParam('pageSize') pageSize: number
  ): Promise<Prisma.GroupUncheckedCreateInput[]> {
    const take = pageSize
    const skip = pageNo * pageSize
    return await this.groupsService.findAll(name, take, skip)
  }

  @Post('/group')
  async create(
    @BodyParam('name') name: string,
    @BodyParam('path') path: string,
    @BodyParam('parentId') parentId: number
  ): Promise<Prisma.GroupGetPayload<any>> {
    if (!name) {
      throw new BadRequestError('username is required')
    }
    return await this.groupsService.create({ name, path, parentId })
  }
}

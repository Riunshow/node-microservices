import { Service } from 'typedi'
import prisma from 'app/helpers/client'
import { Prisma } from '@prisma/client'

@Service()
export class GroupsService {
  async create(group: Prisma.GroupUncheckedCreateInput) {
    return prisma.group.create({
      data: group
    })
  }

  async findAll(name: string, take: number, skip: number) {
    return prisma.group.findMany({
      where: {
        name
      },
      include: {
        group: true
      },
      take,
      skip
    })
  }
}

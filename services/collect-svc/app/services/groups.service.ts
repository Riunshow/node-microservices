import { Service } from 'typedi'
import prisma from 'app/helpers/client'
import { Prisma } from '@turbine/schema'

@Service()
export class GroupsService {
  async create(groupCreateArgs: Prisma.GroupCreateArgs) {
    return prisma.group.create(groupCreateArgs)
  }

  async findAll(groupFindManyArgs: Prisma.GroupFindManyArgs) {
    return prisma.group.findMany(groupFindManyArgs)
  }

  async findOne(groupFindUniqueArgs: Prisma.GroupFindUniqueArgs) {
    return prisma.group.findUnique(groupFindUniqueArgs)
  }
}

import { Service } from 'typedi'
import prisma from 'app/helpers/client'
import { Prisma } from '@turbine/schema'

@Service()
export class ProjectService {
  async create(projectCreateArgs: Prisma.ProjectCreateArgs) {
    return prisma.project.create(projectCreateArgs)
  }

  async findAll(projectFindManyArgs: Prisma.ProjectFindManyArgs) {
    return prisma.project.findMany(projectFindManyArgs)
  }

  async findOne(projectFindUniqueArgs: Prisma.ProjectFindUniqueArgs) {
    return prisma.project.findUnique(projectFindUniqueArgs)
  }
}

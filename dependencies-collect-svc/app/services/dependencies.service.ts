import { Service } from 'typedi'
import prisma from 'app/helpers/client'
import { Prisma } from '@prisma/client'

@Service()
export class DependenciesService {
  async create(dependenciesCreateArgs: Prisma.DependenciesCreateArgs) {
    return prisma.dependencies.create(dependenciesCreateArgs)
  }

  async findAll(dependenciesFindManyArgs: Prisma.DependenciesFindManyArgs) {
    return prisma.dependencies.findMany(dependenciesFindManyArgs)
  }

  async findOne(dependenciesFindUniqueArgs: Prisma.DependenciesFindUniqueArgs) {
    return prisma.dependencies.findUnique(dependenciesFindUniqueArgs)
  }

  async findMany(dependenciesFindManyArgs: Prisma.DependenciesFindManyArgs) {
    return prisma.dependencies.findMany(dependenciesFindManyArgs)
  }
}

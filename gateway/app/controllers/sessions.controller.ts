import {
  BadRequestError,
  Post,
  JsonController,
  BodyParam,
  Get,
  Param
} from 'routing-controllers'
import { Service } from 'typedi'

@JsonController('/user')
@Service()
export class SessionsController {
  constructor() {
  }

  @Get('/:id')
  async query(
    @Param('id') id: number
  ) {
    return {
      id,
      success: true
    }
  }

  @Post('/sessions')
  async create(
    @BodyParam('username', { required: true }) name: string
  ): Promise<any> {
    if (!name) {
      throw new BadRequestError('username is required')
    }
    return {
      name,
      success: true
    }
  }
}

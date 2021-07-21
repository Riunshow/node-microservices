import { ServiceContainer } from '../ServiceContainer'

export function Service(path: string) {
  return function (target: Function) {
    ServiceContainer.registryService(target, path)
  }
}

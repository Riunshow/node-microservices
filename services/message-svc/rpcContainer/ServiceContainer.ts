import * as GRPC from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

export class ServiceContainer {
  static services: { service: any, target: Function }[] = []
  static routes: { target: Function, route: Function, func?: Function }[] = []

  /**
   * @static
   * @param {Function} target service constructor
   * @param {string} path proto file path
   * @memberof ServiceContainer
   */
  static registryService(target: Function, path: string) {
    const packageDefinition = protoLoader.loadSync(path, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
    const protoDescriptor = GRPC.loadPackageDefinition(packageDefinition)

    const packages = Object.keys(protoDescriptor)

    for (let packageKey of packages) {
      for (let key in protoDescriptor[packageKey]) {
        this._setServiceClient(protoDescriptor[packageKey][key], target)
      }
    }
  }

  private static _setServiceClient(service: any, target: Function) {
    if (!service || service === '/' || !service.service) {
      return
    }

    this.services.push({ service: service.service, target })
  }

  static registryRoute(target: Function, route: Function) {
    if (this.routes.find(r => (r.target === target && r.route === route))) {
      return
    }

    this.routes.push({ target, route })
  }

  static generateRouteFunc(...args) {
    return this._generateRouteFunc.apply(this, args)
  }

  private static _generateRouteFunc(service: any, key: string, route: Function): Function {
    let rawFunc = service[key]
    let { requestStream, responseStream } = rawFunc

    let func
    if (requestStream && responseStream) {
      // requestStream: true
      // responseStream: true
      func = async function (call) {
        call.on('data', async function (chunk) {
          try {
            let result = await route(chunk)
            call.write(result)
          } catch (e) {
            call.emit('error', e)
          }
        })

        call.on('error', error => {
          console.error('72: ', error)
        })

        call.on('end', () => {
          call.end && call.end()
        })
      }
    } else if (requestStream && !responseStream) {
      // requestStream: true
      // responseStream: false
      func = async function (call, ...args) {
        // @ts-ignore
        let callback = args[0]

        call.on('data', async chunk => {
          try {
            let result = await route(chunk)
            callback(null, result)
          } catch (e) {
            callback(e)
          }
        })

        call.on('error', error => {
          console.error('96: ', error)
        })

        call.on('end', () => {
          call.end && call.end()
        })
      }
    } else if (!requestStream && responseStream) {
      // requestStream: false
      // responseStream: true
      func = async function (call) {
        try {
          let result = await route(call.request)
          call.write(result)
        } catch (e) {
          call.emit('error', e)
        }

        call.on('error', error => {
          console.error('115: ', error)
        })

        call.on('end', () => {
          call.end && call.end()
        })
      }
    } else {
      // requestStream: false
      // responseStream: false
      func = async function (call, ...args) {
        // @ts-ignore
        let callback = args[0]

        try {
          let result = await route(call.request)
          callback(null, result)
        } catch (e) {
          callback(e)
        }
      }
    }

    return func
  }

  static getService(target: Function): any[] {
    let services = this.services.filter(service => service.target === target)
    return services
  }
}

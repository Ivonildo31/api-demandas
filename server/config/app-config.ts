/**
 * This class have all application config
 */
export class AppConfig {

  public static get requestPath(): string {
    return this.getEnv('REQUEST_PATH') || ''
  }

  private static getEnv(key: string): string {
    if (!process.env[key]) {

      console.warn(`a variável ${key} não foi definida`)

      return undefined
    } else {
      return process.env[key]
    }
  }

}

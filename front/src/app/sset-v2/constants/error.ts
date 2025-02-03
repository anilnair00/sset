export enum Error {
  Recaptcha = 'recaptcha', // rejected google recaptcha v3 token / user flaggued as robot
  Server = 'server', // 500
  Timeout = 'timeout', // connectivity issues
  Validation = 'validation' // 400
}

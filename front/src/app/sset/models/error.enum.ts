export enum ErrorType {
  TIMEOUT = 'timeout', // connectivity issues
  SERVER = 'server', // 500
  VALIDATION = 'validation', // 400
  RECAPTCHA = 'recaptcha' // rejected google recaptcha v3 token / user flaggued as robot
}

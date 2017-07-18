export const username = process.env.EMAIL_USERNAME || 'username'
export const password = process.env.EMAIL_PASSWORD || 'password'
export const host = process.env.EMAIL_HOST || 'host'
export const port = process.env.EMAIL_PORT || 10
export const secure = process.env.EMAIL_SECURE === 'true' ? true : false
export const defaultTo = process.env.EMAIL_CETURB_DEMANDS || ''
export const sender = process.env.EMAIL_SENDER || ''
export const rejectUnauthorized = process.env.EMAIL_REJECT_UNAUTHORIZED === 'true' ? true : false

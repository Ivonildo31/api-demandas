export const host = process.env.EMAIL_HOST || 'host'
export const port = process.env.EMAIL_PORT || 10
export const secure = process.env.EMAIL_SECURE === 'true' ? true : false
export const defaultTo = process.env.EMAIL_CETURB_DEMANDS || ''
export const sender = process.env.EMAIL_SENDER || ''

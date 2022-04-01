import * as cookie from "cookie";

export const handle = async ({ event, resolve }) => {
  const { bgColor } = cookie.parse(event.request.headers.get('cookie') || '')
  if (bgColor) {
    event.locals = { bgColor }
  }
  return await resolve(event)
}

export const getSession = async (event) => {
  const { bgColor } = event.locals
  if (!bgColor) return {}
  return { bgColor }
}

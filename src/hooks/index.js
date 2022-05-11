import * as cookie from "cookie";

export const handle = async ({ event, resolve }) => {
  const { bgColor } = cookie.parse(event.request.headers.get('cookie') || '')
  // const { imageURL } = cookie.parse(event.request.headers.get('cookie') || '')

  if (bgColor) event.locals = { bgColor }
  // if (imageURL) event.locals = { imageURL }

  return await resolve(event)
}

export const getSession = async (event) => {
  const { bgColor } = event.locals
  // const { imageURL } = event.locals

  if (!bgColor) return {}
  // if (!imageURL) return {}
  return { bgColor }
}

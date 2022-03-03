import { getCookieValue } from '$lib/functions/getCookieValue';

const getbgColorFromCookie = (cookie) => {
  const bgColor = getCookieValue(cookie, 'bgColor')
  return bgColor
}

export const handle = ({ event, resolve }) => {
  const cookie = event.request.headers.get('cookie')
  event.locals.bgColor = getbgColorFromCookie(cookie)

  return resolve(event)
}

export const getSession = ({ locals }) => {
  // const bgColor = locals.bgColor  
  const bgColor = 'red'

  return { bgColor };
};


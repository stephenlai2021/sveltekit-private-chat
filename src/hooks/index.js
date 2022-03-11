import { getCookieValue } from '$lib/functions/getCookieValue';
import Cookies from 'js-cookie'
import * as cookie from 'cookie'

const getbgColorFromCookie = (cookie) => {
  const bgColor = getCookieValue(cookie, 'bgColor')
  return bgColor ? bgColor : null
}

export const handle = ({ event, resolve }) => {
  const cookie = event.request.headers.get('cookie')
  console.log('cookie:', cookie)

  /* 問題出在這裡, 讀不到 Cookie 的 bgColor 值 !!!!!! */
  // event.locals.bgColor = getbgColorFromCookie(cookie)  
  // const bgColor = Cookies.get('bgColor')
    const bgColor = getCookieValue(cookie, 'bgColor') 
    console.log('color code:', bgColor)
  
  // const response = await resolve(event)
  // return response

  return resolve(event)
}

export const getSession = (event) => {
  const bgColor = event.locals.bgColor  
  return { bgColor };
};


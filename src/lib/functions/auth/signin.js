import { loginState, loginUserEmail } from "$lib/store";

let temploginState= false
let temploginUserEmail = null

export const signinState = () => {
  return new Promise((resolve, reject) => {
    loginState.subscribe(val => temploginState = val)
    loginUserEmail.subscribe(val => temploginUserEmail = val)

    if (temploginState === true && temploginUserEmail != null) {
      resolve('loggedin user is ready !')
    } else {
      reject({
        code: '303',
        message: 'loggedin user is not ready !'
      })
    }
  })
}
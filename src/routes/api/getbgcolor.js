export const put = async ({ request }) => {
  // const bgColor = JSON.parse(body.toString())
  // const bgColor = body.toString()
  const bgColor = await request.text()

  return {
    headers: {
      'Set-Cookie': `bgColor=${bgColor}; SameSite=Strict; HttpOnly; Secure`
    }
  }
}
export const put = async ({ request }) => {
  // const bgColor = JSON.parse(body.toString())
  // const bgColor = body.toString()
  const bgColor = await request.text()

  if (!bgColor) {
    return {
      status: 400,
      body: `not a valid background color value: ${bgColor}`
    }
  }

  return {
    headers: {
      'Set-Cookie': `bgColor=${bgColor}; SameSite=Strict; HttpOnly; Path=/api; Secure`
    }
  }
}

export const del = async () => ({
  status: 204,
  headers: {
    'Set-Cookie': `bgColor= ; Max-Age=0; SameSite=Strict; HttpOnly; Path=/api; Secure`
  }
})
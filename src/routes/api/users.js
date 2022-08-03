import { users } from '$lib/data/users.js'
console.log('users:', users)

export async function GET() {
  return {
    status: 200,
    headers: {
      // 'access-control-allow-origin': '*'
    },
    body: {
      users
    }
  };
}
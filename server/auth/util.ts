import { AuthenticationError } from "apollo-server-express";

import User from './user'


const authenticateUser = (user: User, isProd: boolean) => {
  if (!isProd) return

  if (!user) {
    throw new AuthenticationError("Authentication Error");
  }
}

// Authenticate a user before executing a function
const checkUserAuthThenRunFunc = (func, user: User, isProd: boolean) => {
  authenticateUser(user, isProd)
  
  return func()
}

export { checkUserAuthThenRunFunc }

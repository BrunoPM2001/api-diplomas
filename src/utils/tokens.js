import jwt from 'jsonwebtoken'

const generateToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: "8h"
  })
  return token
}

export { generateToken }

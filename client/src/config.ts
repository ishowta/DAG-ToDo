export const config = (() => {
  if (typeof process.env.REACT_APP_SERVER_ADDRESS !== 'string')
    throw new Error('env file not filled')
  return { SERVER_ADDRESS: process.env.REACT_APP_SERVER_ADDRESS }
})()

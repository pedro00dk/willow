import * as axios from 'axios'

export const serverAddress = process.env['SERVER_ADDRESS']
export const serverApi = axios.default.create({ baseURL: serverAddress, withCredentials: true })

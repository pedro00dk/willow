import * as axios from 'axios'

const apiServerAddress = process.env['SERVER']
const bundleServerIsReverseProxy = process.env['PROXY']

const baseURL = !bundleServerIsReverseProxy ? apiServerAddress : ''

export const serverApi = axios.default.create({ baseURL, withCredentials: true })

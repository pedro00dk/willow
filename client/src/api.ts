import * as axios from 'axios'

// environment variables captured when building by parcel using dotenv
const apiServerAddress = process.env['SERVER']
const bundleServerIsReverseProxy = process.env['PROXY'] ?? false

// uses bundle origin ('') if is bundle server is reverse proxy
const baseURL = bundleServerIsReverseProxy ? '' : apiServerAddress

// enable sending credentials in cross-site access-control requests
// required if client access the api server directly (another domain)
const withCredentials = !bundleServerIsReverseProxy

export const api = axios.default.create({ baseURL, withCredentials })

import {BASE_URL} from './base_api.js'
import {FLOW_URL} from './flow_api.js'
import {RESOURCE_URL} from './resource_api.js'

import BASE_API from './base_api.js'
import FLOW_API from './flow_api.js'
import RESOURCE_API from './resource_api.js'
const URLMAP = Object.assign({}, BASE_URL, FLOW_URL, RESOURCE_URL)
const urls = URLMAP

export default {
  ...BASE_API,
  ...FLOW_API,
  ...RESOURCE_API
}
export {URLMAP, urls}

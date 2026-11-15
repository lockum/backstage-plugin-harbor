import '@testing-library/jest-dom'
import 'cross-fetch/polyfill'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

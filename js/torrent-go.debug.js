const hash1 = globalThis.crypto.subtle ? crypto.subtle.digest.bind(crypto.subtle, 'sha-1') : () => Promise.reject(new Error('no web crypto support'))
  
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const alphabet = '0123456789abcdef'
const encodeLookup = []
const decodeLookup = []
for (let i2 = 0; i2 < 256; i2++) {
  encodeLookup[i2] = alphabet[i2 >> 4 & 15] + alphabet[i2 & 15]
  if (i2 < 16) {
    if (i2 < 10) {
      decodeLookup[48 + i2] = i2
    } else {
      decodeLookup[97 - 10 + i2] = i2
    }
  }
}
const arr2hex = (array) => {
  const length = array.length
  let string = ''
  let i1 = 0
  while (i1 < length) {
    string += encodeLookup[array[i1++]]
  }
  return string
}
const hex2arr = (string) => {
  const sizeof = string.length >> 1
  const length = sizeof << 1
  const array = new Uint8Array(sizeof)
  let n = 0
  let i1 = 0
  while (i1 < length) {
    array[n++] = decodeLookup[string.charCodeAt(i1++)] << 4 | decodeLookup[string.charCodeAt(i1++)]
  }
  return array
}
const binary2hex = (str) => {
  const hex = '0123456789abcdef'
  let res = ''
  let c
  let i1 = 0
  const l = str.length
  for (; i1 < l; ++i1) {
    c = str.charCodeAt(i1)
    res += hex.charAt(c >> 4 & 15)
    res += hex.charAt(c & 15)
  }
  return res
}
const hex2binary = (hex) => {
  let string = ''
  for (let i1 = 0, l = hex.length; i1 < l; i1 += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i1, 2), 16))
  }
  return string
}
const sha1 = (buffer) => hash1(buffer).then(toUint8)
  
const text2arr = (any) => textEncoder.encode(any)
  
const arr2text = (bufferSource) => textDecoder.decode(bufferSource)
  
const toUint8 = (x) => x instanceof ArrayBuffer ? new Uint8Array(x) : ArrayBuffer.isView(x) ? x instanceof Uint8Array && x.constructor.name === Uint8Array.name ? x : new Uint8Array(x.buffer, x.byteOffset, x.byteLength) : text2arr(x)
  
const _arr2hex = arr2hex
const _hex2arr = hex2arr
const _binary2hex = binary2hex
const _hex2binary = hex2binary
const _text2arr = text2arr
const _arr2text = arr2text
const _sha1 = sha1
const _toUint8 = toUint8
const __default = (h = 5) => {
  const K = 65535
  const c = 4 * h
  const b = [
    0
  ]
  let d = performance.now() % 65535 / 250 & 65535 | 0
  let a = 1
  let k = d - 1 & 65535
  return (e) => {
    d = performance.now() % K / 250 & K | 0
    let g = d - k & 65535
    g > c && (g = c)
    for (k = d; g--;)a === c && (a = 0), b[a] = b[a === 0 ? c - 1 : a - 1], a++
    e && (b[a - 1] += e)
    e = b[a - 1]
    g = b.length < c ? 0 : b[a === c ? 0 : a]
    return b.length < 4 ? e : 4 * (e - g) / b.length
  }
}
const __default1 = (chunks, size) => {
  if (!size) {
    size = 0
    let i1 = chunks.length || chunks.byteLength || 0
    while (i1--) size += chunks[i1].length
  }
  const b = new Uint8Array(size)
  let offset = 0
  for (let i1 = 0, l = chunks.length; i1 < l; i1++) {
    const chunk = chunks[i1]
    b.set(chunk, offset)
    offset += chunk.byteLength || chunk.length
  }
  return b
}
const f = new Uint8Array([
  101
])
const g = new Uint8Array([
  100
])
const h = new Uint8Array([
  108
])
const buffer2 = (buffers, chunk) => buffers.push(_toUint8(chunk.length + ':'), chunk)
  
function encode(buffers, data) {
  const bigN = 2147483648
  let c = typeof data
  if (data instanceof Number) c = 'number'
  else if (data instanceof Boolean) c = 'boolean'
  else if (data instanceof String) c = 'string'
  if (Array.isArray(data)) {
    c = 0
    var d = data.length
    for (buffers.push(h); c < d; c++)data[c] != null && encode(buffers, data[c])
    buffers.push(f)
  } else if (c === 'string' || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    buffer2(buffers, _toUint8(data))
  } else if (c === 'object') {
    buffers.push(g)
    c = 0
    for (const k = Object.keys(data).sort(), len = k.length; c < len; c++) {
      d = k[c]
      if (data[d] != null) {
        buffer2(buffers, _toUint8(d))
        encode(buffers, data[d])
      }
    }
    buffers.push(f)
  } else if (c === 'number' || c === 'boolean') {
    buffers.push(_toUint8('i' + (2147483648 * (data / 2147483648 << 0) + (data % 2147483648 << 0)) + 'e'))
  }
  return buffers
}
const __default2 = (b) => __default1(encode([], b))
  
async function blobIterator(blob, chunkSize, cb) {
  let position = 0
  let index = 0
  chunkSize = chunkSize || Math.max(blob.size / 1000, 200 * 1024)
  while (position < blob.size) {
    const chunk = blob.slice(position, position + chunkSize)
    position += chunk.size
    cb(new Uint8Array(await chunk.arrayBuffer()), index++)
  }
}
const announceList = [
  [
    'udp://tracker.leechers-paradise.org:6969'
  ],
  [
    'udp://tracker.coppersurfer.tk:6969'
  ],
  [
    'udp://tracker.opentrackr.org:1337'
  ],
  [
    'udp://explodie.org:6969'
  ],
  [
    'udp://tracker.empire-js.us:1337'
  ],
  [
    'wss://tracker.btorrent.xyz'
  ],
  [
    'wss://tracker.openwebtorrent.com'
  ],
  [
    'wss://tracker.fastcast.nz'
  ]
]
function calcPieceLength(bytes) {
  return 1 << Math.log2(Math.max(bytes / 1024, 16384)) + 0.5 | 0
}
async function createTorrent(input, opts = {
}) {
  opts = Object.assign({
  }, opts)
  const files = input
  if (!opts.name && commonPrefix) {
    opts.name = commonPrefix
  }
  if (!opts.name) {
    input.some((item) => {
      if (typeof item === 'string') {
        opts.name = item.replace(/.*\//, '')
        return true
      } else if (!item.unknownName) {
        opts.name = item.path[item.path.length - 1]
        return true
      }
    })
  }
  if (!opts.name) {
    opts.name = `Unnamed Torrent ${Date.now()}`
  }
  opts.singleFileTorrent = input.length === 1
  const concatenated = new Blob(input.map((input1) => input1.blob
  ))
  const pieceLength = opts.pieceLength || calcPieceLength(files.reduce((sum, file) => {
    const a = sum + file.blob.size
    delete file.blob
    return a
  }, 0))
  let announceList1 = opts.announceList
  if (!announceList1) {
    if (typeof opts.announce === 'string') announceList1 = [
      [
        opts.announce
      ]
    ]
    else if (Array.isArray(opts.announce)) {
      announceList1 = opts.announce.map((u) => [
        u
      ]
      )
    }
  }
  if (!announceList1) announceList1 = []
  if (typeof globalThis.WEBTORRENT_ANNOUNCE === 'string') {
    announceList1.push([
      [
        globalThis.WEBTORRENT_ANNOUNCE
      ]
    ])
  } else if (Array.isArray(globalThis.WEBTORRENT_ANNOUNCE)) {
    announceList1 = announceList1.concat(globalThis.WEBTORRENT_ANNOUNCE.map((u) => [
      u
    ]
    ))
  }
  if (!opts.announce && !opts.announceList) {
    announceList1 = announceList1.concat(_announceList)
  }
  if (typeof opts.urlList === 'string') opts.urlList = [
    opts.urlList
  ]
  const torrent = {
    info: {
      name: opts.name
    },
    'creation date': Math.ceil((Number(opts.creationDate) || Date.now()) / 1000),
    encoding: 'UTF-8'
  }
  if (announceList1.length !== 0) {
    torrent.announce = announceList1[0][0]
    torrent['announce-list'] = announceList1
  }
  opts.comment ?? (torrent.comment = opts.comment)
  opts.createdBy ?? (torrent['created by'] = opts.createdBy)
  opts.private ?? (torrent.info.private = Number(opts.private))
  opts.sslCert ?? (torrent.info['ssl-cert'] = opts.sslCert)
  opts.urlList ?? (torrent['url-list'] = opts.urlList)
  torrent.info['piece length'] = pieceLength
  const pieces = []
  const length = concatenated.size
  await blobIterator(concatenated, pieceLength, (piece, index) => {
    pieces[index] = _sha1(piece).then((hash1) => {
      if (opts.onPiece) opts.onPiece({
        piece,
        index,
        hash: hash1
      })
      return hash1
    })
  })
  torrent.info.pieces = __default1(await Promise.all(pieces))
  if (opts.singleFileTorrent) {
    torrent.info.length = length
  } else {
    torrent.info.files = files
  }
  return __default2(torrent)
}
const _announceList = announceList
const END_OF_TYPE = 101
function getIntFromBuffer(buffer1, start, end) {
  for (var f1 = 0, c = 1, a = start; a < end; a++) {
    const b = buffer1[a]
    if (b < 58 && b >= 48) f1 = 10 * f1 + (b - 48)
    else if (a !== start || b !== 43) {
      if (a === start && b === 45) c = -1
      else {
        if (b === 46) break
        throw Error('not a number: buffer[' + a + '] = ' + b)
      }
    }
  }
  return f1 * c
}
function find(chr, position, data) {
  for (let b = position, e = data.length; b < e;) {
    if (data[b] === chr) return b
    b++
  }
  throw new Error(`Invalid data: Missing delimiter "${String.fromCharCode(chr)}" [0x${chr.toString(16)}]`)
}
function decode(data) {
  if (!data || !data.length) return null
  let position = 0
  function buffer1() {
    let sep = find(58, position, data)
    let length = getIntFromBuffer(data, position, sep)
    position = length = (++sep) + length
    return new Uint8Array(data.subarray(sep, length))
  }
  function next() {
    switch (data[position]) {
      case 100:
        position++
        for (var a = {
        }; 101 !== data[position];) {
          a[_arr2text(buffer1())] = next()
        }
        position++
        return a
      case 108:
        position++
        for (a = []; 101 !== data[position];)a.push(next())
        position++
        return a
      case 105:
        a = find(END_OF_TYPE, position, data)
        var b = getIntFromBuffer(data, position + 1, a)
        position += a + 1 - position
        return b
      default:
        return buffer1()
    }
  }
  return next()
}
var exports = {
}
exports = parseRange
exports.parse = parseRange
exports.compose = composeRange
function composeRange(range) {
  return range.reduce((acc, cur, idx, arr) => {
    if (idx === 0 || cur !== arr[idx - 1] + 1) acc.push([])
    acc[acc.length - 1].push(cur)
    return acc
  }, []).map((cur) => {
    return cur.length > 1 ? `${cur[0]}-${cur[cur.length - 1]}` : `${cur[0]}`
  })
}
function parseRange(range) {
  const generateRange = (start, end = start) => Array.from({
    length: end - start + 1
  }, (cur, idx) => idx + start
  )
    
  return range.reduce((acc, cur, idx, arr) => {
    const r = cur.split("-").map((cur1) => parseInt(cur1)
    )
    return acc.concat(generateRange(...r))
  }, [])
}
var exports$1 = exports
function base32Decode(d) {
  const e = d.length
  const h1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let a = 0
  let b = 0
  let g1 = 0
  const f1 = new Uint8Array(20)
  let c = 0
  for (; c < e; c++)b = b << 5 | h1.indexOf(d[c]), a += 5, a >= 8 && (f1[g1++] = b >>> a - 8 & 255, a -= 8)
  return f1
}
const set = (obj, key) => new Set(Array.isArray(obj[key]) ? obj[key] : obj[key] ? [
  obj[key]
] : [])
  
function magnetURIDecode(uri) {
  const result = {
  }
  const data = uri.split('magnet:?')[1]
  const params = data && data.length >= 0 ? data.split('&') : []
  params.forEach((param) => {
    const keyval = param.split('=')
    if (keyval.length !== 2) return
    const key = keyval[0]
    let val = keyval[1]
    if (key === 'dn') val = decodeURIComponent(val).replace(/\+/g, ' ')
    if (key === 'tr' || key === 'xs' || key === 'as' || key === 'ws') {
      val = decodeURIComponent(val)
    }
    if (key === 'kt') val = decodeURIComponent(val).split('+')
    if (key === 'ix') val = Number(val)
    if (key === 'so') val = exports$1.parse(decodeURIComponent(val).split(','))
    if (result[key]) {
      if (!Array.isArray(result[key])) {
        result[key] = [
          result[key]
        ]
      }
      result[key].push(val)
    } else {
      result[key] = val
    }
  })
  let m
  if (result.xt) {
    set(result, 'xt').forEach((xt) => {
      if (m = xt.match(/^urn:btih:(.{40})/)) {
        result.infoHash = m[1].toLowerCase()
      } else if (m = xt.match(/^urn:btih:(.{32})/)) {
        result.infoHash = _arr2hex(base32Decode(m[1]))
      } else if (m = xt.match(/^urn:btmh:1220(.{64})/)) {
        result.infoHashV2 = m[1].toLowerCase()
      }
    })
  }
  if (result.xs) {
    set(result, 'xs').forEach((xs) => {
      if (m = xs.match(/^urn:btpk:(.{64})/)) {
        result.publicKey = m[1].toLowerCase()
      }
    })
  }
  if (result.infoHash) result.infoHashBuffer = _hex2arr(result.infoHash)
  if (result.infoHashV2) result.infoHashV2Buffer = _hex2arr(result.infoHashV2)
  if (result.publicKey) result.publicKeyBuffer = _hex2arr(result.publicKey)
  if (result.dn) result.name = result.dn
  if (result.kt) result.keywords = result.kt
  result.announce = [
    ...set(result, 'tr')
  ]
  result.urlList = [
    ...set(result, 'as'),
    ...set(result, 'ws')
  ]
  result.peerAddresses = [
    ...set(result, 'x.pe')
  ]
  return result
}
function magnetURIEncode(obj) {
  obj = Object.assign({
  }, obj)
  let xts = new Set()
  if (obj.xt && typeof obj.xt === 'string') xts.add(obj.xt)
  if (obj.xt && Array.isArray(obj.xt)) xts = new Set(obj.xt)
  if (obj.infoHashBuffer) xts.add(`urn:btih:${_arr2hex(obj.infoHashBuffer)}`)
  if (obj.infoHash) xts.add(`urn:btih:${obj.infoHash}`)
  if (obj.infoHashV2Buffer) xts.add(obj.xt = `urn:btmh:1220${_arr2hex(obj.infoHashV2Buffer)}`)
  if (obj.infoHashV2) xts.add(`urn:btmh:1220${obj.infoHashV2}`)
  const xtsDeduped = Array.from(xts)
  if (xtsDeduped.length === 1) obj.xt = xtsDeduped[0]
  if (xtsDeduped.length > 1) obj.xt = xtsDeduped
  if (obj.publicKeyBuffer) obj.xs = `urn:btpk:${_arr2hex(obj.publicKeyBuffer)}`
  if (obj.publicKey) obj.xs = `urn:btpk:${obj.publicKey}`
  if (obj.name) obj.dn = obj.name
  if (obj.keywords) obj.kt = obj.keywords
  if (obj.announce) obj.tr = obj.announce
  if (obj.urlList) {
    obj.ws = obj.urlList
    delete obj.as
  }
  if (obj.peerAddresses) obj['x.pe'] = obj.peerAddresses
  let result = 'magnet:?'
  Object.keys(obj).filter((key) => key.length === 2 || key === 'x.pe'
  ).forEach((key, i1) => {
    const values = Array.isArray(obj[key]) ? obj[key] : [
      obj[key]
    ]
    values.forEach((val, j) => {
      if ((i1 > 0 || j > 0) && (key !== 'kt' && key !== 'so' || j === 0)) result += '&'
      if (key === 'dn') val = encodeURIComponent(val).replace(/%20/g, '+')
      if (key === 'tr' || key === 'as' || key === 'ws') {
        val = encodeURIComponent(val)
      }
      if (key === 'xs' && !val.startsWith('urn:btpk:')) {
        val = encodeURIComponent(val)
      }
      if (key === 'kt') val = encodeURIComponent(val)
      if (key === 'so') return
      if (key === 'kt' && j > 0) result += `+${val}`
      else result += `${key}=${val}`
    })
    if (key === 'so') result += `${key}=${exports$1.compose(values)}`
  })
  return result
}
const encode1 = magnetURIEncode
async function parseTorrent(torrentId) {
  if (torrentId instanceof Request || typeof torrentId === 'string' && /^https?:/.test(torrentId)) {
    torrentId = await fetch(torrentId)
  }
  if (typeof torrentId === 'object' && /^(URL|Request|Location|HTMLAnchorElement)$/.test(torrentId[Symbol.toStringTag])) {
    torrentId = await fetch(torrentId)
  }
  if (typeof torrentId.arrayBuffer === 'function') {
    torrentId = await torrentId.arrayBuffer()
  }
  if (torrentId instanceof ArrayBuffer || ArrayBuffer.isView(torrentId)) {
    torrentId = _toUint8(torrentId)
  }
  if (typeof torrentId === 'string' && /^(stream-)?magnet:/.test(torrentId)) {
    return magnetURIDecode(torrentId)
  } else if (typeof torrentId === 'string' && (/^[a-f0-9]{40}$/i.test(torrentId) || /^[a-z2-7]{32}$/i.test(torrentId))) {
    return magnetURIDecode(`magnet:?xt=urn:btih:${torrentId}`)
  } else if (ArrayBuffer.isView(torrentId)) {
    return torrentId.byteLength === 20 ? magnetURIDecode('magnet:?xt=urn:btih:' + _arr2hex(torrentId)) : decodeTorrentFile(torrentId)
  } else if (torrentId && torrentId.infoHash) {
    torrentId.infoHash = torrentId.infoHash.toLowerCase()
    if (!torrentId.announce) torrentId.announce = []
    if (typeof torrentId.announce === 'string') {
      torrentId.announce = [
        torrentId.announce
      ]
    }
    if (!torrentId.urlList) torrentId.urlList = []
    return torrentId
  } else {
    throw new Error('Invalid torrent identifier')
  }
}
async function decodeTorrentFile(torrent) {
  if (ArrayBuffer.isView(torrent)) {
    torrent = decode(torrent)
  }
  ensure(torrent.info, 'info')
  ensure(torrent.info['name.utf-8'] || torrent.info.name, 'info.name')
  ensure(torrent.info['piece length'], 'info[\'piece length\']')
  ensure(torrent.info.pieces, 'info.pieces')
  if (torrent.info.files) {
    torrent.info.files.forEach((file) => {
      ensure(typeof file.length === 'number', 'info.files[0].length')
      ensure(file['path.utf-8'] || file.path, 'info.files[0].path')
    })
  } else {
    ensure(typeof torrent.info.length === 'number', 'info.length')
  }
  const result = {
    info: torrent.info,
    infoBuffer: __default2(torrent.info),
    name: _arr2text(torrent.info['name.utf-8'] || torrent.info.name),
    announce: []
  }
  result.infoHashBuffer = await _sha1(result.infoBuffer)
  result.infoHash = _arr2hex(result.infoHashBuffer)
  result.private = !!torrent.info.private
  if (torrent['creation date']) result.created = new Date(torrent['creation date'] * 1000)
  if (torrent['created by']) result.createdBy = _arr2text(torrent['created by'])
  if (ArrayBuffer.isView(torrent.comment)) {
    result.comment = _arr2text(torrent.comment)
  }
  if (Array.isArray(torrent['announce-list']) && torrent['announce-list'].length > 0) {
    torrent['announce-list'].forEach((urls) => {
      urls.forEach((url) => {
        result.announce.push(_arr2text(url))
      })
    })
  } else if (torrent.announce) {
    result.announce.push(_arr2text(torrent.announce))
  }
  if (ArrayBuffer.isView(torrent['url-list'])) {
    torrent['url-list'] = torrent['url-list'].length > 0 ? [
      torrent['url-list']
    ] : []
  }
  result.urlList = (torrent['url-list'] || []).map((url) => {
    return typeof url === 'string' ? url : _arr2text(url)
  })
  result.announce = [
    ...new Set([
      ...result.announce
    ])
  ]
  result.urlList = [
    ...new Set([
      ...result.urlList
    ])
  ]
  const files = torrent.info.files || [
    torrent.info
  ]
  result.files = files.map((file, i1) => {
    const parts = [].concat(result.name, file['path.utf-8'] || file.path || []).map((e) => typeof e === 'string' ? e : _arr2text(e)
    )
    return {
      path: parts.join('/').replace(/^\/+/g, ''),
      name: parts[parts.length - 1],
      length: file.length,
      offset: files.slice(0, i1).reduce(sumLength, 0)
    }
  })
  result.length = files.reduce(sumLength, 0)
  const lastFile = result.files[result.files.length - 1]
  result.pieceLength = torrent.info['piece length']
  result.lastPieceLength = (lastFile.offset + lastFile.length) % result.pieceLength || result.pieceLength
  return result
}
function encodeTorrentFile(parsed) {
  const torrent = {
    info: parsed.info
  }
  torrent['announce-list'] = (parsed.announce || []).map((url) => {
    if (!torrent.announce) torrent.announce = url
    return [
      url
    ]
  })
  torrent['url-list'] = parsed.urlList || []
  if (parsed.private !== undefined) {
    torrent.private = Number(parsed.private)
  }
  if (parsed.created) {
    torrent['creation date'] = parsed.created.getTime() / 1000 | 0
  }
  if (parsed.createdBy) {
    torrent['created by'] = parsed.createdBy
  }
  if (parsed.comment) {
    torrent.comment = parsed.comment
  }
  return __default2(torrent)
}
function sumLength(sum, file) {
  return sum + file.length
}
function ensure(bool, fieldName) {
  if (!bool) throw new Error(`Torrent is missing required field: ${fieldName}`)
}
const toMagnetURI = encode1
const toTorrentFile = encodeTorrentFile
var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply1(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args)
}
var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys1(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
  }
} else {
  ReflectOwnKeys = function ReflectOwnKeys1(target) {
    return Object.getOwnPropertyNames(target)
  }
}
function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning)
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN1(value) {
  return value !== value
}
function EventEmitter() {
  EventEmitter.init.call(this)
}
EventEmitter.EventEmitter = EventEmitter
EventEmitter.prototype._events = undefined
EventEmitter.prototype._eventsCount = 0
EventEmitter.prototype._maxListeners = undefined
var defaultMaxListeners = 10
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener)
  }
}
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.')
    }
    defaultMaxListeners = arg
  }
})
EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null)
    this._eventsCount = 0
  }
  this._maxListeners = this._maxListeners || undefined
}
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.')
  }
  this._maxListeners = n
  return this
}
function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners
  return that._maxListeners
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this)
}
EventEmitter.prototype.emit = function emit(type) {
  var args = []
  for (var i1 = 1; i1 < arguments.length; i1++)args.push(arguments[i1])
  var doError = type === 'error'
  var events = this._events
  if (events !== undefined) doError = doError && events.error === undefined
  else if (!doError) return false
  if (doError) {
    var er
    if (args.length > 0) er = args[0]
    if (er instanceof Error) {
      throw er
    }
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''))
    err.context = er
    throw err
  }
  var handler = events[type]
  if (handler === undefined) return false
  if (typeof handler === 'function') {
    ReflectApply(handler, this, args)
  } else {
    var len = handler.length
    var listeners = arrayClone1(handler, len)
    for (var i1 = 0; i1 < len; ++i1)ReflectApply(listeners[i1], this, args)
  }
  return true
}
function _addListener(target, type, listener, prepend) {
  var m
  var events
  var existing
  checkListener(listener)
  events = target._events
  if (events === undefined) {
    events = target._events = Object.create(null)
    target._eventsCount = 0
  } else {
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener)
      events = target._events
    }
    existing = events[type]
  }
  if (existing === undefined) {
    existing = events[type] = listener
    ++target._eventsCount
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = prepend ? [
        listener,
        existing
      ] : [
        existing,
        listener
      ]
    } else if (prepend) {
      existing.unshift(listener)
    } else {
      existing.push(listener)
    }
    m = _getMaxListeners(target)
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit')
      w.name = 'MaxListenersExceededWarning'
      w.emitter = target
      w.type = type
      w.count = existing.length
      ProcessEmitWarning(w)
    }
  }
  return target
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false)
}
EventEmitter.prototype.on = EventEmitter.prototype.addListener
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true)
}
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn)
    this.fired = true
    if (arguments.length === 0) return this.listener.call(this.target)
    return this.listener.apply(this.target, arguments)
  }
}
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  }
  var wrapped = onceWrapper.bind(state)
  wrapped.listener = listener
  state.wrapFn = wrapped
  return wrapped
}
EventEmitter.prototype.once = function once1(type, listener) {
  checkListener(listener)
  this.on(type, _onceWrap(this, type, listener))
  return this
}
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener)
  this.prependListener(type, _onceWrap(this, type, listener))
  return this
}
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i1, originalListener
  checkListener(listener)
  events = this._events
  if (events === undefined) return this
  list = events[type]
  if (list === undefined) return this
  if (list === listener || list.listener === listener) {
    if ((--this._eventsCount) === 0) this._events = Object.create(null)
    else {
      delete events[type]
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener)
    }
  } else if (typeof list !== 'function') {
    position = -1
    for (i1 = list.length - 1; i1 >= 0; i1--) {
      if (list[i1] === listener || list[i1].listener === listener) {
        originalListener = list[i1].listener
        position = i1
        break
      }
    }
    if (position < 0) return this
    if (position === 0) list.shift()
    else {
      spliceOne1(list, position)
    }
    if (list.length === 1) events[type] = list[0]
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener)
  }
  return this
}
EventEmitter.prototype.off = EventEmitter.prototype.removeListener
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i1
  events = this._events
  if (events === undefined) return this
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null)
      this._eventsCount = 0
    } else if (events[type] !== undefined) {
      if ((--this._eventsCount) === 0) this._events = Object.create(null)
      else delete events[type]
    }
    return this
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events)
    var key
    for (i1 = 0; i1 < keys.length; ++i1) {
      key = keys[i1]
      if (key === 'removeListener') continue
      this.removeAllListeners(key)
    }
    this.removeAllListeners('removeListener')
    this._events = Object.create(null)
    this._eventsCount = 0
    return this
  }
  listeners = events[type]
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners)
  } else if (listeners !== undefined) {
    for (i1 = listeners.length - 1; i1 >= 0; i1--) {
      this.removeListener(type, listeners[i1])
    }
  }
  return this
}
function _listeners(target, type, unwrap) {
  var events = target._events
  if (events === undefined) return []
  var evlistener = events[type]
  if (evlistener === undefined) return []
  if (typeof evlistener === 'function') return unwrap ? [
    evlistener.listener || evlistener
  ] : [
    evlistener
  ]
  return unwrap ? unwrapListeners1(evlistener) : arrayClone1(evlistener, evlistener.length)
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true)
}
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false)
}
EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type)
  } else {
    return listenerCount1.call(emitter, type)
  }
}
EventEmitter.prototype.listenerCount = listenerCount1
function listenerCount1(type) {
  var events = this._events
  if (events !== undefined) {
    var evlistener = events[type]
    if (typeof evlistener === 'function') {
      return 1
    } else if (evlistener !== undefined) {
      return evlistener.length
    }
  }
  return 0
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : []
}
function arrayClone1(arr, n) {
  var copy = new Array(n)
  for (var i1 = 0; i1 < n; ++i1)copy[i1] = arr[i1]
  return copy
}
function spliceOne1(list, index) {
  for (; index + 1 < list.length; index++)list[index] = list[index + 1]
  list.pop()
}
function unwrapListeners1(arr) {
  var ret = new Array(arr.length)
  for (var i1 = 0; i1 < ret.length; ++i1) {
    ret[i1] = arr[i1].listener || arr[i1]
  }
  return ret
}
const __default3 = (t) => {
  for (var r, u, e, s, f1 = [], i1 = 0, n = (t = t.split(",")).length; i1 < n; i1++)if (r = t[i1].trim(), /^-?\d+$/.test(r)) f1.push(parseInt(r, 10))
  else if ((e = r.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)) && e[1] && e[3]) for (r = +e[3], u = e[2], s = (e = +e[1]) < r ? 1 : -1, "-" != u && ".." != u && "‥" != u || (r += s), u = e; u != r; u += s)f1.push(u)
  return f1
}
class BitField {
  constructor (data1 = 0) {
    this.have = 0
    if (typeof data1 === 'number') {
      this.buffer = new Uint8Array((data1 >> 3) + (data1 % 8 !== 0))
    } else {
      this.buffer = data1
      let have = 0
      for (let i2 = 0, n = 0, l = data1.length; i2 < l; i2++) {
        n = data1[i2]
        n -= n >> 1 & 1431655765
        n = (n & 858993459) + (n >> 2 & 858993459)
        have += 16843009 * (n + (n >> 4) & 252645135) >> 24
      }
      this.have = have
    }
  }
  get(index) {
    const j = index >> 3
    return j < this.buffer.length && !!(this.buffer[j] & 128 >> index % 8)
  }
  set(index, value = true) {
    const j = index >> 3
    const buf = this.buffer
    this.have += value ? 1 : -1
    if (value) {
      buf[j] |= 128 >> index % 8
    } else {
      buf[j] &= ~(128 >> index % 8)
    }
  }
  forEach(fn, start = 0, end = this.buffer.length * 8) {
    for (let i2 = start, j = i2 >> 3, y = 128 >> i2 % 8, __byte = this.buffer[j]; i2 < end; i2++) {
      fn(!!(__byte & y), i2)
      y = y === 1 ? (__byte = this.buffer[++j], 128) : y >> 1
    }
  }
}
class Storage1 {
  constructor (chunkLength, opts1 = {
  }) {
    this._actions = []
    this._operations = {
    }
    this._db = opts1.db
    this.closed = false
    this._transaction = null
    this.quotaExceeded = false
  }
  _bulkOp() {
    return
    const operations = this._operations
    const actions = this._actions
    if (this._transaction || !actions.length) return
    this._transaction = true
    const transaction = this._db.transaction([
      'chunks'
    ], 'readwrite')
    const store = transaction.objectStore('chunks')
    actions.forEach((index) => {
      const operation = operations[index]
      if (operation.get) {
        const req = store.get(index)
        req.onsuccess = (evt) => {
          delete operations[index]
          const buf = evt.target.result.buf
          operation.callbacks.forEach((args, i2) => {
            const [opts1, cb] = args
            let start, end
            if (opts1) {
              start = opts1.offset || 0
              end = start + (opts1.length || buf.length - start)
            }
            cb(null, opts1 ? buf.subarray(start, end) : buf)
          })
        }
      } else {
        const req = store.put({
          index,
          buf: operation.value
        })
        req.onsuccess = () => {
          delete operations[index]
        }
      }
    })
    this._actions = []
    transaction.onerror = console.log
    transaction.oncomplete = () => {
      this._transaction = false
      this._bulkOp()
    }
  }
  put(index, buf) {
    this._operations[index] = {
      get: false,
      value: buf
    }
    this._actions.push(index)
    if (!this._transaction) this._bulkOp()
  }
  get(index, opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = null
    }
    if (this.closed) return cb(new Error('Storage is closed'))
    let start, end, buf
    const operation = this._operations[index]
    if (!operation) {
      this._operations[index] = {
        get: true,
        callbacks: [
          [
            opts,
            cb
          ]
        ]
      }
      this._actions.push(index)
    } else if (operation.get === false) {
      if (opts) {
        start = opts.offset || 0
        end = start + (opts.length || buf.length - start)
      }
      cb(null, opts ? operation.value.subarray(start, end) : operation.value)
    } else {
      operation.callbacks.push([
        opts,
        cb
      ])
    }
    this._bulkOp()
  }
}
Storage1.prototype.close = Storage1.prototype.destroy = function (cb) {
  if (this.closed) return cb(new Error('Storage is closed'))
  this.closed = true
  cb(null)
}
var exports1 = {
}
var R1 = typeof Reflect === "object" ? Reflect : null
var ReflectApply2 = R1 && typeof R1.apply === "function" ? R1.apply : function ReflectApply3(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args)
}
var ReflectOwnKeys1
if (R1 && typeof R1.ownKeys === "function") {
  ReflectOwnKeys1 = R1.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys1 = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
  }
} else {
  ReflectOwnKeys1 = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target)
  }
}
function ProcessEmitWarning1(warning) {
  if (console && console.warn) console.warn(warning)
}
var NumberIsNaN2 = Number.isNaN || function NumberIsNaN3(value) {
  return value !== value
}
function EventEmitter1() {
  EventEmitter1.init.call(this)
}
exports1 = EventEmitter1
exports1.once = once3
EventEmitter1.EventEmitter = EventEmitter1
EventEmitter1.prototype._events = undefined
EventEmitter1.prototype._eventsCount = 0
EventEmitter1.prototype._maxListeners = undefined
var defaultMaxListeners1 = 10
function checkListener1(listener) {
  if (typeof listener !== "function") {
    throw new TypeError("The \"listener\" argument must be of type Function. Received type " + typeof listener)
  }
}
Object.defineProperty(EventEmitter1, "defaultMaxListeners", {
  enumerable: true,
  get: function () {
    return defaultMaxListeners1
  },
  set: function (arg) {
    if (typeof arg !== "number" || arg < 0 || NumberIsNaN2(arg)) {
      throw new RangeError("The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received " + arg + ".")
    }
    defaultMaxListeners1 = arg
  }
})
EventEmitter1.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null)
    this._eventsCount = 0
  }
  this._maxListeners = this._maxListeners || undefined
}
EventEmitter1.prototype.setMaxListeners = function setMaxListeners1(n) {
  if (typeof n !== "number" || n < 0 || NumberIsNaN2(n)) {
    throw new RangeError("The value of \"n\" is out of range. It must be a non-negative number. Received " + n + ".")
  }
  this._maxListeners = n
  return this
}
function _getMaxListeners1(that) {
  if (that._maxListeners === undefined) return EventEmitter1.defaultMaxListeners
  return that._maxListeners
}
EventEmitter1.prototype.getMaxListeners = function getMaxListeners1() {
  return _getMaxListeners1(this)
}
EventEmitter1.prototype.emit = function emit1(type) {
  var args = []
  for (var i2 = 1; i2 < arguments.length; i2++)args.push(arguments[i2])
  var doError = type === "error"
  var events = this._events
  if (events !== undefined) doError = doError && events.error === undefined
  else if (!doError) return false
  if (doError) {
    var er
    if (args.length > 0) er = args[0]
    if (er instanceof Error) {
      throw er
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""))
    err.context = er
    throw err
  }
  var handler = events[type]
  if (handler === undefined) return false
  if (typeof handler === "function") {
    ReflectApply2(handler, this, args)
  } else {
    var len = handler.length
    var listeners1 = arrayClone2(handler, len)
    for (var i2 = 0; i2 < len; ++i2)ReflectApply2(listeners1[i2], this, args)
  }
  return true
}
function _addListener1(target, type, listener, prepend) {
  var m
  var events
  var existing
  checkListener1(listener)
  events = target._events
  if (events === undefined) {
    events = target._events = Object.create(null)
    target._eventsCount = 0
  } else {
    if (events.newListener !== undefined) {
      target.emit("newListener", type, listener.listener ? listener.listener : listener)
      events = target._events
    }
    existing = events[type]
  }
  if (existing === undefined) {
    existing = events[type] = listener
    ++target._eventsCount
  } else {
    if (typeof existing === "function") {
      existing = events[type] = prepend ? [
        listener,
        existing
      ] : [
        existing,
        listener
      ]
    } else if (prepend) {
      existing.unshift(listener)
    } else {
      existing.push(listener)
    }
    m = _getMaxListeners1(target)
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true
      var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners " + "added. Use emitter.setMaxListeners() to " + "increase limit")
      w.name = "MaxListenersExceededWarning"
      w.emitter = target
      w.type = type
      w.count = existing.length
      ProcessEmitWarning1(w)
    }
  }
  return target
}
EventEmitter1.prototype.addListener = function addListener1(type, listener) {
  return _addListener1(this, type, listener, false)
}
EventEmitter1.prototype.on = EventEmitter1.prototype.addListener
EventEmitter1.prototype.prependListener = function prependListener1(type, listener) {
  return _addListener1(this, type, listener, true)
}
function onceWrapper1() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn)
    this.fired = true
    if (arguments.length === 0) return this.listener.call(this.target)
    return this.listener.apply(this.target, arguments)
  }
}
function _onceWrap1(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  }
  var wrapped = onceWrapper1.bind(state)
  wrapped.listener = listener
  state.wrapFn = wrapped
  return wrapped
}
EventEmitter1.prototype.once = function once2(type, listener) {
  checkListener1(listener)
  this.on(type, _onceWrap1(this, type, listener))
  return this
}
EventEmitter1.prototype.prependOnceListener = function prependOnceListener1(type, listener) {
  checkListener1(listener)
  this.prependListener(type, _onceWrap1(this, type, listener))
  return this
}
EventEmitter1.prototype.removeListener = function removeListener1(type, listener) {
  var list, events, position, i2, originalListener
  checkListener1(listener)
  events = this._events
  if (events === undefined) return this
  list = events[type]
  if (list === undefined) return this
  if (list === listener || list.listener === listener) {
    if ((--this._eventsCount) === 0) this._events = Object.create(null)
    else {
      delete events[type]
      if (events.removeListener) this.emit("removeListener", type, list.listener || listener)
    }
  } else if (typeof list !== "function") {
    position = -1
    for (i2 = list.length - 1; i2 >= 0; i2--) {
      if (list[i2] === listener || list[i2].listener === listener) {
        originalListener = list[i2].listener
        position = i2
        break
      }
    }
    if (position < 0) return this
    if (position === 0) list.shift()
    else {
      spliceOne2(list, position)
    }
    if (list.length === 1) events[type] = list[0]
    if (events.removeListener !== undefined) this.emit("removeListener", type, originalListener || listener)
  }
  return this
}
EventEmitter1.prototype.off = EventEmitter1.prototype.removeListener
EventEmitter1.prototype.removeAllListeners = function removeAllListeners1(type) {
  var listeners2, events, i2
  events = this._events
  if (events === undefined) return this
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null)
      this._eventsCount = 0
    } else if (events[type] !== undefined) {
      if ((--this._eventsCount) === 0) this._events = Object.create(null)
      else delete events[type]
    }
    return this
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events)
    var key
    for (i2 = 0; i2 < keys.length; ++i2) {
      key = keys[i2]
      if (key === "removeListener") continue
      this.removeAllListeners(key)
    }
    this.removeAllListeners("removeListener")
    this._events = Object.create(null)
    this._eventsCount = 0
    return this
  }
  listeners2 = events[type]
  if (typeof listeners2 === "function") {
    this.removeListener(type, listeners2)
  } else if (listeners2 !== undefined) {
    for (i2 = listeners2.length - 1; i2 >= 0; i2--) {
      this.removeListener(type, listeners2[i2])
    }
  }
  return this
}
function _listeners1(target, type, unwrap) {
  var events = target._events
  if (events === undefined) return []
  var evlistener = events[type]
  if (evlistener === undefined) return []
  if (typeof evlistener === "function") return unwrap ? [
    evlistener.listener || evlistener
  ] : [
    evlistener
  ]
  return unwrap ? unwrapListeners2(evlistener) : arrayClone2(evlistener, evlistener.length)
}
EventEmitter1.prototype.listeners = function listeners2(type) {
  return _listeners1(this, type, true)
}
EventEmitter1.prototype.rawListeners = function rawListeners1(type) {
  return _listeners1(this, type, false)
}
EventEmitter1.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type)
  } else {
    return listenerCount2.call(emitter, type)
  }
}
EventEmitter1.prototype.listenerCount = listenerCount2
function listenerCount2(type) {
  var events = this._events
  if (events !== undefined) {
    var evlistener = events[type]
    if (typeof evlistener === "function") {
      return 1
    } else if (evlistener !== undefined) {
      return evlistener.length
    }
  }
  return 0
}
EventEmitter1.prototype.eventNames = function eventNames1() {
  return this._eventsCount > 0 ? ReflectOwnKeys1(this._events) : []
}
function arrayClone2(arr, n) {
  var copy = new Array(n)
  for (var i2 = 0; i2 < n; ++i2)copy[i2] = arr[i2]
  return copy
}
function spliceOne2(list, index) {
  for (; index + 1 < list.length; index++)list[index] = list[index + 1]
  list.pop()
}
function unwrapListeners2(arr) {
  var ret = new Array(arr.length)
  for (var i2 = 0; i2 < ret.length; ++i2) {
    ret[i2] = arr[i2].listener || arr[i2]
  }
  return ret
}
function once3(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver)
      reject(err)
    }
    function resolver() {
      if (typeof emitter.removeListener === "function") {
        emitter.removeListener("error", errorListener)
      }
      resolve([].slice.call(arguments))
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    })
    if (name !== "error") {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      })
    }
  })
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === "function") {
    eventTargetAgnosticAddListener(emitter, "error", handler, flags)
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === "function") {
    if (flags.once) {
      emitter.once(name, listener)
    } else {
      emitter.on(name, listener)
    }
  } else if (typeof emitter.addEventListener === "function") {
    emitter.addEventListener(name, function wrapListener(arg) {
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener)
      }
      listener(arg)
    })
  } else {
    throw new TypeError("The \"emitter\" argument must be of type EventEmitter. Received type " + typeof emitter)
  }
}
var exports$11 = exports1
const MAX_BUFFERED_AMOUNT = 64 * 1024
const buffer1 = new Uint8Array(MAX_BUFFERED_AMOUNT)
class Peer {
  constructor (opts2 = {
  }) {
    this.initiator = !opts2.offer
    this.remoteAddress = this.remotePort = this.localAddress = this.onMessage = this.localPort = this.timestamp = this.sdp = this.onSignal = this.error = this._evtLoopTimer = this._dc = null
    this._bucket = []
    this._queue = []
    this._bulkSend = this.bulkSend.bind(this)
    const pc = new RTCPeerConnection(opts2.config || Peer.config)
    this._pc = pc
    pc.oniceconnectionstatechange = () => {
      switch (pc.iceConnectionState) {
        case 'connected': break
        case 'disconnected':
          this.destroy(new Error('Ice connection disconnected.'))
          break
        case 'failed':
          this.destroy(new Error('Ice connection failed.'))
          break
        default:
      }
    }
    if (this.initiator) {
      this.createSDP()
    } else {
      this.setSDP(opts2.offer)
    }
  }
  _setupData() {
    const dc = this._dc
    dc.onopen = () => {
      this._pc.getStats().then((items) => this._onceStats(items)
      )
    }
    dc.binaryType = 'arraybuffer'
    dc.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
    dc.onmessage = (evt) => {
      if (this.timestamp) {
        this.onMessage(new Uint8Array(evt.data))
      } else {
        this._bucket.push(new Uint8Array(evt.data))
      }
    }
  }
  _onceStats(items) {
    let selected
    items.forEach((item) => {
      if (item.type === 'transport' && item.selectedCandidatePairId) {
        selected = items.get(item.selectedCandidatePairId)
      }
      if (!selected && item.type === 'candidate-pair' && (item.selected || item.nominated)) {
        selected = item
      }
    })
    const local = items.get(selected.localCandidateId) || {
    }
    const remote = items.get(selected.remoteCandidateId) || {
    }
    this.networkType = local.networkType
    this.candidateType = local.candidateType
    this.localAddress = local.ip || local.address || local.ipAddress
    this.localPort = local.port || local.portNumber
    this.remoteAddress = remote.ip || remote.address || remote.ipAddress
    this.remotePort = remote.port || remote.portNumber
    this.onConnect && this.onConnect(this)
    this.timestamp = Date.now() / 1000 | 0
    this._bucket.forEach((msg) => {
      this.onMessage(msg)
    })
    this._bucket = null
  }
  async createSDP() {
    const pc1 = this._pc
    if (!this._dc) {
      this._dc = pc1.createDataChannel('')
      this._setupData()
    }
    const desc = await pc1.createOffer()
    desc.sdp = desc.sdp.replace(/a=ice-options:trickle\s\n/g, '')
    const iceGathering = new Promise((resolve) => {
      setTimeout(resolve, 2000)
      pc1.onicecandidate = (evt) => {
        !evt.candidate && resolve(pc1.onicecandidate = null)
      }
    })
    await pc1.setLocalDescription(desc)
    await iceGathering
    this.sdp = pc1.localDescription
    this.onSignal(this)
  }
  async setSDP(sdp) {
    if (this.destroyed) console.log('cant do this when its closed', this.error)
    const pc1 = this._pc
    await pc1.setRemoteDescription(sdp)
    pc1.ondatachannel = null
    if (!pc1.localDescription) {
      const iceGathering = new Promise((resolve) => {
        pc1.onicecandidate = (evt) => {
          !evt.candidate && resolve(pc1.onicecandidate = null)
        }
      })
      const desc = await pc1.createAnswer()
      desc.sdp = desc.sdp.replace(/a=ice-options:trickle\s\n/g, '')
      await pc1.setLocalDescription(desc)
      await iceGathering
      pc1.ondatachannel = (evt) => {
        this._dc = evt.channel
        this._setupData()
        pc1.oniceconnectionstatechange()
      }
    }
    this.sdp = pc1.localDescription
    this.onSignal && this.onSignal(this)
  }
  signal(sdp) {
    this.setSDP(sdp)
  }
  send(chunk) {
    if (!window.requestIdleCallback) {
      const channel = this._dc
      if (this.destroyed) return
      if (channel.readyState === 'closing') return this.destroy()
      channel.send(chunk)
      return
    }
    if (this.evtLoopTimer) {
      this.queue.push(chunk)
    } else {
      this.queue = [
        chunk
      ]
      this.evtLoopTimer = window.requestIdleCallback(this._bulkSend)
    }
  }
  bulkSend() {
    const dc = this._dc
    if (this.destroyed) return
    if (dc.readyState === 'closing') return this.destroy()
    const chunks = this.queue
    if (chunks.length === 1) {
      dc.send(chunks[0])
      this.evtLoopTimer = this.queue = null
      return
    }
    let offset = 0
    let merged = []
    for (let i2 = 0, l = chunks.length; i2 < l; i2++) {
      const chunk = chunks[i2]
      if (chunk.length + offset >= buffer1.length) {
        if (offset) {
          dc.send(buffer1.subarray(0, offset))
          offset = 0
          merged = []
        } else {
          dc.send(chunk)
          continue
        }
      }
      merged.push(chunk.length)
      buffer1.set(chunk, offset)
      offset += chunk.length
    }
    dc.send(buffer1.subarray(0, offset))
    this.evtLoopTimer = this.queue = null
  }
  destroy(err) {
    if (this.destroyed) return
    this.destroyed = true
    this.error = typeof err === 'string' ? new Error(err) : err || new Error('something closed')
    const channel = this._dc
    const pc1 = this._pc
    if (this._dc) {
      channel.onclose = null
      channel.onerror = null
      channel.onmessage = null
      channel.onopen = null
      if (channel.readyState !== 'closed') channel.close()
    }
    pc1.ondatachannel = null
    pc1.onicecandidate = null
    pc1.oniceconnectionstatechange = null
    pc1.onicegatheringstatechange = null
    pc1.onsignalingstatechange = null
    if (pc1.iceConnectionState === 'new') false && console.log(new Error('dont close this'))
    pc1.close()
    this._channelReady = this._pcReady = this.connected = this.onMessage = this.timestamp = this._dc = this._pc = null
    this.onDestroy && this.onDestroy(err)
  }
}
Peer.config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ]
}
class Tracker extends EventEmitter {
  constructor (client, announceUrl) {
    super()
    this.client = client
    this.announceUrl = announceUrl
    this.interval = null
    this.destroyed = false
  }
  setInterval(intervalMs) {
    if (intervalMs == null) intervalMs = this.DEFAULT_ANNOUNCE_INTERVAL
    clearInterval(this.interval)
    if (intervalMs) {
      this.interval = setInterval(() => {
        this.announce(this.client._defaultAnnounceOpts())
      }, intervalMs)
      if (this.interval.unref) this.interval.unref()
    }
  }
}
const socketPool = {
}
const RECONNECT_MINIMUM = 15 * 1000
const RECONNECT_MAXIMUM = 30 * 60 * 1000
const RECONNECT_VARIANCE = 30 * 1000
const OFFER_TIMEOUT = 50 * 1000
const MAX_BUFFERED_AMOUNT1 = 64 * 1024
class WebSocketTracker extends Tracker {
  constructor (client1, announceUrl1) {
    super(client1, announceUrl1)
    this.peers = {
    }
    this.reusable = {
    }
    this.socket = null
    this.reconnecting = false
    this.retries = 0
    this.reconnectTimer = null
    this.expectingResponse = false
    this._openSocket()
  }
  announce(opts) {
    if (this.destroyed || this.reconnecting) return
    if (this.socket._ws.readyState !== WebSocket.OPEN) {
      this.socket._ws.addEventListener('open', () => {
        this.announce(opts)
      }, {
        once: true
      })
      return
    }
    const params = Object.assign({
    }, opts, {
      action: 'announce',
      info_hash: this.client._infoHashBinary,
      peer_id: this.client._peerIdBinary
    })
    if (this._trackerId) params.trackerid = this._trackerId
    if (opts.event === 'stopped' || opts.event === 'completed') {
      this._send(params)
    } else {
      const numwant = Math.min(opts.numwant, 10)
      this._generateOffers(numwant, (offers) => {
        params.numwant = numwant
        params.offers = offers
        this._send(params)
      })
    }
  }
  scrape(opts) {
    if (this.destroyed || this.reconnecting) return
    if (this.socket._ws.readyState !== WebSocket.OPEN) {
      this.socket._ws.addEventListener('open', () => {
        this.scrape(opts)
      }, {
        once: true
      })
      return
    }
    console.log('how did you not notice this?!')
    const infoHashes = Array.isArray(opts.infoHash) && opts.infoHash.length > 0 ? opts.infoHash.map((infoHash) => {
      return infoHash.toString('binary')
    }) : opts.infoHash && opts.infoHash.toString('binary') || this.client._infoHashBinary
    const params = {
      action: 'scrape',
      info_hash: infoHashes
    }
    this._send(params)
  }
  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    clearInterval(this.interval)
    clearInterval(this.socket.interval)
    clearTimeout(this.reconnectTimer)
    for (const peerId in this.peers) {
      const peer = this.peers[peerId]
      clearTimeout(peer.trackerTimeout)
      peer.destroy()
    }
    this.peers = null
    if (this.socket) {
      this.socket._ws.removeEventListener('open', this._onSocketConnectBound)
      this.socket._ws.removeEventListener('message', this._onSocketDataBound)
      this.socket._ws.removeEventListener('close', this._onSocketCloseBound)
      this.socket._ws.removeEventListener('error', this._onSocketErrorBound)
      this.socket = null
    }
    this._onSocketConnectBound = null
    this._onSocketErrorBound = null
    this._onSocketDataBound = null
    this._onSocketCloseBound = null
    if (socketPool[this.announceUrl]) {
      socketPool[this.announceUrl].consumers -= 1
    }
    if (socketPool[this.announceUrl].consumers > 0) return
    const socket = socketPool[this.announceUrl]
    delete socketPool[this.announceUrl]
    let timeout
    if (!this.expectingResponse) return destroyCleanup()
    timeout = setTimeout(destroyCleanup, 1000)
    socket._ws.addEventListener('data', destroyCleanup)
    function destroyCleanup() {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      socket._ws.removeEventListener('data', destroyCleanup)
      socket._ws.close()
    }
  }
  _openSocket() {
    this.destroyed = false
    if (!this.peers) this.peers = {
    }
    const once4 = {
      once: true
    }
    this._onSocketConnectBound = () => {
      this._onSocketConnect()
    }
    this._onSocketErrorBound = (err) => {
      this._onSocketError(err)
    }
    this._onSocketDataBound = (evt) => {
      this._onSocketData(evt.data)
    }
    this._onSocketCloseBound = () => {
      this._onSocketClose()
    }
    this.socket = socketPool[this.announceUrl]
    if (this.socket) {
      socketPool[this.announceUrl].consumers += 1
    } else {
      console.log('opened', this.announceUrl)
      this.socket = socketPool[this.announceUrl] = {
        _ws: new WebSocket(this.announceUrl),
        consumers: 1,
        buffer: []
      }
      this.socket._ws.addEventListener('open', this._onSocketConnectBound, once4)
    }
    this.socket._ws.addEventListener('message', this._onSocketDataBound)
    this.socket._ws.addEventListener('close', this._onSocketCloseBound, once4)
    this.socket._ws.addEventListener('error', this._onSocketErrorBound, once4)
  }
  _onSocketConnect() {
    console.log('connected')
    if (this.destroyed) return
    if (this.reconnecting) {
      this.reconnecting = false
      this.retries = 0
      this.announce(this.client._defaultAnnounceOpts())
    }
  }
  _onSocketData(data) {
    if (this.destroyed) return
    this.expectingResponse = false
    try {
      data = JSON.parse(data)
    } catch (err) {
      this.client.emit('warning', new Error('Invalid tracker response'))
      return
    }
    if (data.action === 'announce') {
      this._onAnnounceResponse(data)
    } else if (data.action === 'scrape') {
      this._onScrapeResponse(data)
    } else {
      this._onSocketError(new Error(`invalid action in WS response: ${data.action}`))
    }
  }
  _onAnnounceResponse(data) {
    if (data.info_hash !== this.client._infoHashBinary) {
      return
    }
    if (data.peer_id && data.peer_id === this.client._peerIdBinary) {
      return
    }
    const failure = data['failure reason']
    if (failure) return this.client.emit('warning', new Error(failure))
    const warning = data['warning message']
    if (warning) this.client.emit('warning', new Error(warning))
    const interval = data.interval || data['min interval']
    if (interval) this.setInterval(interval * 1000)
    const trackerId = data['tracker id']
    if (trackerId) {
      this._trackerId = trackerId
    }
    if (data.complete != null) {
      const response = Object.assign({
      }, data, {
        announce: this.announceUrl,
        infoHash: _binary2hex(data.info_hash)
      })
      this.client.emit('update', response)
    }
    let peer
    if (data.offer && data.peer_id) {
      const peerId = _binary2hex(data.peer_id)
      if (this.client._filter && !this.client._filter(peerId)) return
      peer = this._createPeer({
        offer: data.offer
      })
      peer.id = peerId
      peer.onSignal = (peer1) => {
        peer1.onSignal = null
        const params = {
          action: 'announce',
          info_hash: this.client._infoHashBinary,
          peer_id: this.client._peerIdBinary,
          to_peer_id: data.peer_id,
          answer: peer1.sdp,
          offer_id: data.offer_id
        }
        if (this._trackerId) params.trackerid = this._trackerId
        this._send(params)
        this.client.emit('peer', peer1)
      }
    }
    if (data.answer && data.peer_id) {
      const offerId = _binary2hex(data.offer_id)
      peer = this.peers[offerId]
      if (peer) {
        peer.id = _binary2hex(data.peer_id)
        const peerId = _binary2hex(data.peer_id)
        if (this.client._filter && !this.client._filter(peerId)) {
          return peer.destroy('filtered')
        }
        this.client.emit('peer', peer)
        peer.signal(data.answer)
        clearTimeout(peer.trackerTimeout)
        peer.trackerTimeout = null
        delete this.peers[offerId]
      } else {
      }
    }
  }
  _onScrapeResponse(data) {
    data = data.files || {
    }
    const keys = Object.keys(data)
    if (keys.length === 0) {
      this.client.emit('warning', new Error('invalid scrape response'))
      return
    }
    keys.forEach((infoHash) => {
      const response = Object.assign(data[infoHash], {
        announce: this.announceUrl,
        infoHash: _binary2hex(infoHash)
      })
      this.client.emit('scrape', response)
    })
  }
  _onSocketClose() {
    if (this.destroyed) return
    this.destroy()
    this._startReconnectTimer()
  }
  _onSocketError(err) {
    if (this.destroyed) return
    this.destroy()
    this.client.emit('warning', err)
    this._startReconnectTimer()
  }
  _startReconnectTimer() {
    const ms = Math.floor(Math.random() * RECONNECT_VARIANCE) + Math.min(Math.pow(2, this.retries) * RECONNECT_MINIMUM, RECONNECT_MAXIMUM)
    this.reconnecting = true
    clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      this.retries++
      this._openSocket()
    }, ms)
  }
  _send(params) {
    if (this.destroyed) return
    this.expectingResponse = true
    const message = JSON.stringify(params)
    const { _ws, buffer: buffer2 } = this.socket
    if (buffer2.length || _ws.readyState !== WebSocket.OPEN || _ws.bufferedAmount > MAX_BUFFERED_AMOUNT1) {
      buffer2.push(message)
      if (!this.socket.interval) {
        this.socket.interval = setInterval(() => {
          while (_ws.readyState === WebSocket.OPEN && buffer2.length && _ws.bufferedAmount < MAX_BUFFERED_AMOUNT1) {
            _ws.send(buffer2.shift())
          }
          if (!buffer2.length) {
            clearInterval(this.socket.interval)
            delete this.socket.interval
          }
        }, 150)
      }
    } else {
      _ws.send(message)
    }
  }
  async _generateOffers(numwant, cb) {
    let offers = []
    let i2 = numwant
    while (i2--) {
      const peer = this._createPeer()
      offers.push(new Promise((resolve) => {
        peer.onSignal = resolve
      }))
    }
    const peers = await Promise.all(offers)
    offers = []
    for (const peer of peers) {
      const offerId = peer.sdp.sdp.match(/a=fingerprint:[\w-]*\s(.*)/)[1].replace(/[^\w]*/g, '').substr(0, 20).toLowerCase()
      peer.onDestroy = () => {
        peer.destroyCalled = true
        delete this.peers[offerId]
      }
      this.peers[offerId] = peer
      offers.push({
        offer: peer.sdp,
        offer_id: _hex2binary(offerId)
      })
      peer.trackerTimeout = setTimeout(() => {
        peer.trackerTimeout = null
        delete this.peers[offerId]
        peer.destroy()
      }, OFFER_TIMEOUT)
    }
    cb(offers)
  }
  _createPeer(opts) {
    opts = Object.assign({
      config: this.client._rtcConfig
    }, opts)
    const peer = new Peer(opts)
    return peer
  }
}
WebSocketTracker.prototype.DEFAULT_ANNOUNCE_INTERVAL = 30 * 1000
WebSocketTracker._socketPool = socketPool
class Client extends exports$11 {
  constructor (opts3) {
    super()
    this._peerIdBinary = String.fromCharCode.apply(null, opts3.peerId)
    this.infoHash = typeof opts3.infoHash === 'string' ? opts3.infoHash.toLowerCase() : _arr2hex(opts3.infoHash)
    this._infoHashBinary = _hex2binary(this.infoHash)
    this.destroyed = false
    this._getAnnounceOpts = opts3.getAnnounceOpts
    this._filter = opts3.filter
    this._rtcConfig = opts3.rtcConfig
    let announce = typeof opts3.announce === 'string' ? [
      opts3.announce
    ] : opts3.announce == null ? [] : opts3.announce
    announce = announce.map((announceUrl2) => {
      announceUrl2 = announceUrl2.toString()
      if (announceUrl2[announceUrl2.length - 1] === '/') {
        announceUrl2 = announceUrl2.substring(0, announceUrl2.length - 1)
      }
      return announceUrl2
    })
    announce = [
      ...new Set(announce)
    ]
    this._trackers = announce.map((announceUrl2) => {
      if (announceUrl2.startsWith('wss:') || announceUrl2.startsWith('ws:')) {
        return new WebSocketTracker(this, announceUrl2)
      } else {
        return null
      }
    }).filter(Boolean)
  }
  start(opts = {
  }) {
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'started'
    this._announce(opts)
    this._trackers.forEach((tracker) => {
      tracker.setInterval()
    })
  }
  stop(opts) {
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'stopped'
    this._announce(opts)
  }
  complete(opts) {
    if (!opts) opts = {
    }
    opts = this._defaultAnnounceOpts(opts)
    opts.event = 'completed'
    this._announce(opts)
  }
  update(opts) {
    opts = this._defaultAnnounceOpts(opts)
    if (opts.event) delete opts.event
    this._announce(opts)
  }
  _announce(opts) {
    this._trackers.forEach((tracker) => {
      tracker.announce(opts)
    })
  }
  scrape(opts = {
  }) {
    this._trackers.forEach((tracker) => {
      tracker.scrape(opts)
    })
  }
  setInterval(intervalMs) {
    this._trackers.forEach((tracker) => {
      tracker.setInterval(intervalMs)
    })
  }
  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    const trackers = this._trackers
    let i2 = trackers.length
    while (i2--) trackers[i2].destroy()
    this._trackers = []
    this._getAnnounceOpts = null
  }
  _defaultAnnounceOpts(opts = {
  }) {
    if (!opts.numwant) opts.numwant = 50
    if (!opts.uploaded) opts.uploaded = 0
    if (!opts.downloaded) opts.downloaded = 0
    if (this._getAnnounceOpts) opts = Object.assign({
    }, opts, this._getAnnounceOpts())
    return opts
  }
}
class Discovery extends EventEmitter {
  constructor (opts4) {
    super()
    this.peerId = opts4.peerId
    this.infoHash = typeof opts4.infoHash === 'string' ? opts4.infoHash.toLowerCase() : _arr2hex(opts4.infoHash)
    this.destroyed = false
    this._announce = opts4.announce || []
    this._intervalMs = opts4.intervalMs || 15 * 60 * 1000
    this._trackerOpts = null
    this._onWarning = (err) => {
      this.emit('warning', err)
    }
    this._onError = (err) => {
      this.emit('error', err)
    }
    this._onTrackerPeer = (peer) => {
      this.emit('peer', peer, 'tracker')
    }
    this._onTrackerAnnounce = () => {
      this.emit('trackerAnnounce')
    }
    if (opts4.tracker === false) {
      this.tracker = null
    } else if (opts4.tracker && typeof opts4.tracker === 'object') {
      this._trackerOpts = Object.assign({
      }, opts4.tracker)
      this.tracker = this._createTracker()
    } else {
      this.tracker = this._createTracker()
    }
  }
  updatePort(port) {
    if (port === this._port) return
    this._port = port
    if (this.tracker) {
      this.tracker.stop()
      this.tracker.destroy(() => {
        this.tracker = this._createTracker()
      })
    }
  }
  complete(opts) {
    if (this.tracker) {
      this.tracker.complete(opts)
    }
  }
  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    if (this.tracker) {
      this.tracker.stop()
      this.tracker.removeListener('warning', this._onWarning)
      this.tracker.removeListener('error', this._onError)
      this.tracker.removeListener('peer', this._onTrackerPeer)
      this.tracker.removeListener('update', this._onTrackerAnnounce)
      this.tracker.destroy()
    }
    this.tracker = null
    this._announce = null
  }
  _createTracker() {
    const opts5 = Object.assign({
    }, this._trackerOpts, {
      infoHash: this.infoHash,
      announce: this._announce,
      peerId: this.peerId,
      port: this._port
    })
    const tracker = new Client(opts5)
    tracker.on('warning', this._onWarning)
    tracker.on('error', this._onError)
    tracker.on('peer', this._onTrackerPeer)
    tracker.on('update', this._onTrackerAnnounce)
    tracker.setInterval(this._intervalMs)
    tracker.start()
    return tracker
  }
}
const BLOCK_LENGTH = 1 << 14
class Piece {
  constructor (length2, index1) {
    this._priority = 0
    this._critical = false
    this._salt = Math.random()
    this._sources = []
    this._index = index1
    this._availability = 0
    this.length = length2
    this._chunks = Math.ceil(length2 / BLOCK_LENGTH)
    this._remainder = length2 % BLOCK_LENGTH || BLOCK_LENGTH
    this.reset()
  }
  reset() {
    this.missing = this.length
    this._buffered = 0
    this._buffer = new Array(this._chunks)
    this._cancellations = []
    this._reservations = 0
    this._flushed = false
  }
  chunkLength(i) {
    return i === this._chunks - 1 ? this._remainder : BLOCK_LENGTH
  }
  chunkLengthRemaining(i) {
    return this.length - i * BLOCK_LENGTH
  }
  chunkOffset(i) {
    return i * BLOCK_LENGTH
  }
  reserve() {
    if (!this._buffer) return -1
    if (this._cancellations.length) return this._cancellations.pop()
    if (this._reservations < this._chunks) return this._reservations++
    return -1
  }
  reserveRemaining() {
    if (this._flushed) return -1
    if (this._reservations < this._chunks) {
      const min = this._reservations
      this._reservations = this._chunks
      return min
    }
    return -1
  }
  cancel(i) {
    if (!this._buffer) return
    this._cancellations.push(i)
  }
  cancelRemaining(i) {
    if (!this._buffer) return
    this._reservations = i
  }
  set(i, data, wire) {
    if (!this._buffer) return false
    const len = data.length
    const blocks = Math.ceil(len / BLOCK_LENGTH)
    for (let j = 0; j < blocks; j++) {
      if (!this._buffer[i + j]) {
        const offset = j * BLOCK_LENGTH
        const splitData = data.subarray(offset, offset + BLOCK_LENGTH)
        this._buffered++
        this._buffer[i + j] = splitData
        this.missing -= splitData.length
        wire.emit('download', splitData.length)
      } else {
        const offset = j * BLOCK_LENGTH
        const splitData = data.subarray(offset, offset + BLOCK_LENGTH)
        console.log('thrown away', splitData.length)
      }
    }
    return this._buffered === this._chunks
  }
  flush() {
    if (!this._buffer || this._chunks !== this._buffered) return null
    const buffer2 = __default1(this._buffer)
    this._buffer = null
    this._cancellations = null
    this._salt *= -1
    this._availability = 0
    return buffer2
  }
}
Object.defineProperty(Piece, 'BLOCK_LENGTH', {
  value: BLOCK_LENGTH
})
const BLOCK_LENGTH1 = 1 << 14
class PieceSelector {
  constructor (torrent4) {
    const l = torrent4.info.pieces.length / 20
    const pieces = new Array(l)
    const piecesIndex = new Array(l)
    for (let i3 = 0; i3 < l; i3++) {
      piecesIndex[i3] = pieces[l - i3 - 1] = new Piece(l - i3 - 1 ? torrent4.pieceLength : torrent4.lastPieceLength, i3)
    }
    this._torrent = torrent4
    this._pieces = pieces
    this._piecesIndex = piecesIndex
    this._reservedPieces = {
    }
    this._strategy = 'sequential'
    this._onWireHave = (i4, wire) => {
      if (this._piecesIndex[i4]) {
        this._piecesIndex[i4]._availability++
        this._updateWire(wire)
      }
    }
    this._onWireBitfield = (newBit, oldBit) => {
      oldBit.forEach((have, i4) => {
        this._piecesIndex[i4] && (this._piecesIndex[i4]._availability -= +have)
      })
      newBit.forEach((have, i4) => {
        this._piecesIndex[i4] && (this._piecesIndex[i4]._availability += have)
      })
      torrent4.wires.forEach(this._updateWire, this)
    }
  }
  _updateWire(wire) {
    if (wire.peerChoking) return
    const minOutstandingRequests = getBlockPipelineLength(wire, 0.5)
    if (wire.requests.length >= minOutstandingRequests) return
    const maxOutstandingRequests = wire.type === 'webSeed' ? Math.min(getPiecePipelineLength(wire, 1.5, this._torrent.pieceLength), this._torrent.maxWebConns) : getBlockPipelineLength(wire, 1.5)
    if (wire.requests.length >= maxOutstandingRequests) return
    let pieces1 = this._pieces
    for (let i4 = pieces1.length; i4--;) {
      const piece = pieces1[i4]
      if (!piece) continue
      if (wire.peerPieces.get(piece._index)) {
        this._piecesIndex[piece._index] && this._request(wire, piece._index, maxOutstandingRequests)
        if (wire.requests.length >= maxOutstandingRequests) return
      }
    }
    pieces1 = Object.values(this._reservedPieces)
    for (let i5 = pieces1.length; i5--;) {
      const piece = pieces1[i5]
      if (wire.peerPieces.get(piece._index)) {
        this._request(wire, piece._index, maxOutstandingRequests)
        if (wire.requests.length >= maxOutstandingRequests) return
      }
    }
  }
  _request(wire, index, maxOutstandingRequests) {
    const isWebSeed = wire.type === 'webSeed'
    const piece = this._piecesIndex[index]
    const torrent1 = this._torrent
    if (wire.destroyed) return false
    if (wire.requests.length >= maxOutstandingRequests) return false
    const reservation = isWebSeed ? piece.reserveRemaining() : piece.reserve()
    if (reservation === -1) {
      return false
    }
    const chunkOffset = piece.chunkOffset(reservation)
    const chunkLength1 = isWebSeed ? piece.chunkLengthRemaining(reservation) : piece.chunkLength(reservation)
    wire.request(index, chunkOffset, chunkLength1, (err, chunk) => {
      if (!this._piecesIndex[index]) {
        console.log(`thrown away chunk #${index}[${chunkOffset}-${chunkOffset + chunkLength1}] (${chunkLength1} bytes)`)
        return this._updateWire(wire)
      }
      if (err) {
        0 && console.log('error getting piece %s (offset: %s length: %s) from %s: %s', index, chunkOffset, chunkLength1, `${wire.remoteAddress}:${wire.remotePort}`, err.message)
        isWebSeed ? piece.cancelRemaining(reservation) : piece.cancel(reservation)
        !wire.destroyed && this._updateWire(wire)
        this._pieces.push(this._piecesIndex[index])
        return
      }
      if (!piece.set(reservation, chunk, wire)) {
        const maxOutstandingRequests = wire.type === 'webSeed' ? Math.min(getPiecePipelineLength(wire, 1.5, this._torrent.pieceLength), this._torrent.maxWebConns) : getBlockPipelineLength(wire, 1.5)
        if (wire.requests.length < maxOutstandingRequests) {
          this._request(wire, index, maxOutstandingRequests) || this._updateWire(wire)
        }
        return
      }
      this._updateWire(wire)
      const buf = piece.flush()
      _sha1(buf).then((hash1) => {
        const start = index * 20
        let equal = true
        let i4 = 20
        const p = torrent1.info.pieces
        if (torrent1.destroyed) return
        for (; equal && i4 < 20; i4++) {
          equal = p[start + i4] === hash1[i4]
        }
        if (equal) {
          this._piecesIndex[index]._priority === 5 && console.log('f', index)
          if (!this._piecesIndex[index]) return
          this._piecesIndex[index] = null
          delete this._reservedPieces[index]
          torrent1.bitfield.set(index, true)
          torrent1.store.put(index, buf)
          torrent1.emit('piece', index)
          torrent1.wires.forEach((wire) => wire.have(index)
          )
          this.updatePieces()
          if (torrent1._checkDone() && !torrent1.destroyed) torrent1.discovery.complete()
        } else {
          const piece1 = this._piecesIndex[index]
          piece1.reset()
          this._pieces.push(piece1)
          console.log('warning', new Error(`Piece ${index} failed verification`))
        }
      })
    })
    return this._request(wire, index, maxOutstandingRequests)
  }
  addWire(wire) {
    wire.peerPieces.forEach((have, i4) => {
      const piece = this._piecesIndex[i4]
      if (piece) {
        piece._availability += have
      }
    })
    wire.on('have', this._onWireHave)
    wire.on('bitfield', this._onWireBitfield)
    wire.once('close', () => {
      this.updatePieces()
      const _pieces = this._piecesIndex
      wire.peerPieces.forEach((have, i4) => {
        if (_pieces[i4]) {
          _pieces[i4]._availability -= have
        }
      })
    })
    setTimeout(() => {
      this._torrent.wires.forEach(this._updateWire, this)
    }, 100)
  }
  get strategy() {
    return this._strategy
  }
  set strategy(value) {
    this._strategy = value
    this.updatePieces()
    return value
  }
  updatePieces() {
    this._pieces.sort((piece1, piece2) => {
      if (piece1._priority < piece2._priority) return -1
      if (piece1._priority > piece2._priority) return 1
      let v1 = piece1._availability === 0 ? piece1._salt - 9999 : piece1._availability
      let v2 = piece2._availability === 0 ? piece2._salt - 9999 : piece2._availability
      if (v1 === v2) {
        v1 = piece1._salt - 9999
        v2 = piece2._salt - 9999
      }
      if (v1 < v2) return 1
      if (v1 > v2) return -1
    })
  }
  destroy() {
    this._wires.forEach((wire) => {
      wire.removeListener('have', (i4) => {
        this._onWireHave(i4, wire)
      })
      wire.removeListener('bitfield', this._onWireBitfield)
      if (wire._onClose) wire.removeListener('close', wire._onClose)
      wire._onClose = null
    })
    this._wires = null
    this._pieces = null
    this._onWireHave = null
    this._onWireBitfield = null
  }
}
function getBlockPipelineLength(wire, duration) {
  return Math.min(400, 2 + Math.ceil(duration * wire.downloadSpeed() / BLOCK_LENGTH1))
}
function getPiecePipelineLength(wire, duration, pieceLength) {
  return 1 + Math.ceil(duration * wire.downloadSpeed() / pieceLength)
}
const PIECE_LENGTH = 1 << 14
class utMetadata extends EventEmitter {
  constructor (wire1) {
    super()
    this._wire = wire1
    this._fetching = false
    this._metadataComplete = false
    this._metadataSize = null
    this._remainingRejects = null
    this._bitfield = null
  }
  onHandshake(infoHash, peerId, extensions) {
    this._infoHash = infoHash
  }
  onExtendedHandshake(handshake) {
    if (!handshake.m || !handshake.m.ut_metadata) {
      return this.emit('warning', new Error('Peer does not support ut_metadata'))
    }
    if (!handshake.metadata_size) {
      return this.emit('warning', new Error('Peer does not have metadata'))
    }
    if (typeof handshake.metadata_size !== 'number' || 10000000 < handshake.metadata_size || handshake.metadata_size <= 0) {
      return this.emit('warning', new Error('Peer gave invalid metadata size'))
    }
    this._metadataSize = handshake.metadata_size
    this._numPieces = Math.ceil(this._metadataSize / PIECE_LENGTH)
    this._remainingRejects = this._numPieces * 2
    this._bitfield = new BitField(this._numPieces)
    if (this._fetching) {
      this._requestPieces()
    }
  }
  onMessage(buf) {
    let trailerIndex = -1
    for (let i4 = 0; i4 < buf.length; ++i4) {
      if (buf[i4] === 101 && buf[i4 + 1] === 101) {
        trailerIndex = i4 + 2
        break
      }
    }
    const dict = decode(buf.slice(0, trailerIndex))
    switch (dict.msg_type) {
      case 0:
        this._onRequest(dict.piece)
        break
      case 1:
        this._onData(dict.piece, buf.subarray(trailerIndex), dict.total_size)
        break
      case 2:
        this._onReject(dict.piece)
        break
    }
  }
  fetch() {
    if (this._metadataComplete) {
      return
    }
    this._fetching = true
    if (this._metadataSize) {
      this._requestPieces()
    }
  }
  cancel() {
    this._fetching = false
  }
  async setMetadata(metadata) {
    if (this._metadataComplete) return true
    try {
      const info = decode(metadata).info
      if (info) {
        metadata = __default2(info)
      }
    } catch (err) {
    }
    this.cancel()
    if (this._infoHash && this._infoHash !== _arr2hex(await _sha1(metadata))) {
      return false
    }
    this.metadata = metadata
    this._metadataComplete = true
    this._metadataSize = this._wire.extendedHandshake.metadata_size = metadata.length
    this.emit('metadata', __default2({
      info: decode(metadata)
    }))
    return true
  }
  _send(dict, trailer) {
    let buf = __default2(dict)
    if (ArrayBuffer.isView(trailer)) {
      buf = __default1([
        buf,
        trailer
      ])
    }
    this._wire.extended('ut_metadata', buf)
  }
  _request(piece) {
    this._send({
      msg_type: 0,
      piece
    })
  }
  _data(piece, buf, totalSize) {
    const msg = {
      msg_type: 1,
      piece
    }
    if (typeof totalSize === 'number') {
      msg.total_size = totalSize
    }
    this._send(msg, buf)
  }
  _reject(piece) {
    this._send({
      msg_type: 2,
      piece
    })
  }
  _onRequest(piece) {
    if (!this._metadataComplete) {
      this._reject(piece)
      return
    }
    const start = piece * PIECE_LENGTH
    let end = start + PIECE_LENGTH
    if (end > this._metadataSize) {
      end = this._metadataSize
    }
    const buf = this.metadata.subarray(start, end)
    this._data(piece, buf, this._metadataSize)
  }
  _onData(piece, buf, totalSize) {
    if (buf.length > PIECE_LENGTH) {
      return
    }
    this.metadata.set(buf, piece * PIECE_LENGTH)
    this._bitfield.set(piece)
    this._checkDone()
  }
  _onReject(piece) {
    if (this._remainingRejects > 0 && this._fetching) {
      this._request(piece)
      this._remainingRejects -= 1
    } else {
      this.emit('warning', new Error('Peer sent "reject" too much'))
    }
  }
  _requestPieces() {
    this.metadata = new Uint8Array(this._metadataSize)
    for (let piece = 0; piece < this._numPieces; piece++) {
      this._request(piece)
    }
  }
  _checkDone() {
    const done = this._bitfield.have === this._numPieces
    if (!done) return
    this.setMetadata(this.metadata).then((success) => {
      if (!success) {
        this._failedMetadata()
      }
    })
  }
  _failedMetadata() {
    this._bitfield = null
    this._remainingRejects -= this._numPieces
    if (this._remainingRejects > 0) {
      this._requestPieces()
    } else {
      this.emit('warning', new Error('Peer sent invalid metadata'))
    }
  }
}
utMetadata.prototype.name = 'ut_metadata'
class File1 extends EventEmitter {
  constructor (torrent1, file) {
    super()
    this._torrent = torrent1
    this._destroyed = false
    this.name = file.name
    this.path = file.path
    this.length = file.length
    this.offset = file.offset
    const start1 = file.offset
    const end1 = start1 + file.length - 1
    this._startPiece = start1 / this._torrent.pieceLength | 0
    this._endPiece = end1 / this._torrent.pieceLength | 0
  }
  get downloaded() {
    if (!this._torrent.bitfield) return 0
    const { pieces: pieces1, bitfield, pieceLength } = this._torrent
    const { _startPiece: start1, _endPiece: end1 } = this
    const piece = pieces1[start1]
    let downloaded = bitfield.get(start1) ? pieceLength - this.offset : Math.max(piece.length - piece.missing - this.offset, 0)
    for (let index2 = start1 + 1; index2 <= end1; ++index2) {
      if (bitfield.get(index2)) {
        downloaded += pieceLength
      } else {
        const piece1 = pieces1[index2]
        downloaded += piece1.length - piece1.missing
      }
    }
    return Math.min(downloaded, this.length)
  }
  get progress() {
    return this.length ? this.downloaded / this.length : 0
  }
  select(priority) {
    if (this.length === 0) return
    this._torrent.select(this._startPiece, this._endPiece, priority)
  }
  deselect() {
    if (this.length === 0) return
    this._torrent.deselect(this._startPiece, this._endPiece, false)
  }
  stream(opts = {
  }) {
    const _torrent = this._torrent
    const { start: start1 = 0, end: end1 = this.length } = opts
    const pieceLength = this._torrent.pieceLength
    const _startPiece = (start1 + this.offset) / pieceLength | 0
    const _endPiece = (end1 + this.offset) / pieceLength | 0
    const _criticalLength = Math.min(1024 * 1024 / pieceLength | 0, 5)
    let _piece = _startPiece
    let _offset = start1 + this.offset - _startPiece * pieceLength
    let _missing = end1 - start1
    _torrent.select(0, this._torrent.pieces.length - 1, 0)
    _torrent.select(_startPiece, _endPiece, 4)
    return new ReadableStream({
      pull(controller) {
        return new Promise(async (resolve, reject) => {
          if (!_torrent.bitfield.get(_piece)) {
            _torrent.critical(_piece, Math.min(_piece + _criticalLength, _endPiece))
            await new Promise((resolve1) => {
              _torrent.on('piece', function listener(index2) {
                if (_piece === index2) {
                  _torrent.removeListener('piece', listener)
                  resolve1()
                }
              })
            })
          }
          if (_torrent.destroyed) return reject(new Error('Torrent removed'))
          _torrent.store.get(_piece++, null, (err, buffer2) => {
            if (err) return reject(err)
            if (_torrent.destroyed) return reject(new Error('Torrent removed'))
            if (_offset) {
              buffer2 = buffer2.slice(_offset)
              _offset = 0
            }
            if (_missing < buffer2.length) {
              buffer2 = buffer2.slice(0, _missing)
            }
            _missing -= buffer2.length
            controller.enqueue(buffer2)
            resolve()
            if (!_missing) controller.close()
          })
        })
      },
      cancel() {
        console.log('user aborted stream')
      }
    })
  }
  async blob() {
    return this._response(await this.mimetype()).blob()
  }
  arrayBuffer() {
    return this._response().arrayBuffer()
  }
  async mimetype() {
    const m = await import('https://ga.jspm.io/npm:mime@2.5.2/index.js')
    return m.default.getType(this.name.toLowerCase())
  }
  _response(type) {
    return new Response(this.stream(), {
      headers: type ? {
        'content-length': this.length,
        'content-type': type || 'application/octet-stream'
      } : {
        'content-length': this.length
      }
    })
  }
  _destroy() {
    this._destroyed = true
    this._torrent = null
  }
}
var exports2 = {
}
exports2 = remove
function remove(arr, i4) {
  if (i4 >= arr.length || i4 < 0) return
  var last = arr.pop()
  if (i4 < arr.length) {
    var tmp = arr[i4]
    arr[i4] = last
    return tmp
  }
  return last
}
var exports$12 = exports2
const KEEP_ALIVE_TIMEOUT = 55000
const MESSAGE_PROTOCOL = _hex2arr('13426974546f7272656e742070726f746f636f6c')
const MESSAGE_KEEP_ALIVE = new Uint8Array([
  0,
  0,
  0,
  0
])
const MESSAGE_CHOKE = new Uint8Array([
  0,
  0,
  0,
  1,
  0
])
const MESSAGE_UNCHOKE = new Uint8Array([
  0,
  0,
  0,
  1,
  1
])
const MESSAGE_INTERESTED = new Uint8Array([
  0,
  0,
  0,
  1,
  2
])
const MESSAGE_UNINTERESTED = new Uint8Array([
  0,
  0,
  0,
  1,
  3
])
const MESSAGE_RESERVED = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
]
const MESSAGE_PORT = [
  0,
  0,
  0,
  3,
  9,
  0,
  0
]
let id1 = 0
class Request1 {
  constructor (piece1, offset1, length1, callback) {
    this.piece = piece1
    this.offset = offset1
    this.length = length1
    this.callback = callback
  }
}
function readUInt16BE(buffer2, offset1) {
  return buffer2[offset1] << 8 | buffer2[offset1 + 1]
}
function readUInt32BE(buffer2, offset1) {
  return buffer2[offset1] * 16777216 + (buffer2[offset1 + 1] << 16 | buffer2[offset1 + 2] << 8 | buffer2[offset1 + 3])
}
function writeUInt32BE(buffer2, value, offset1) {
  buffer2[offset1] = value >>> 24
  buffer2[offset1 + 1] = value >>> 16
  buffer2[offset1 + 2] = value >>> 8
  buffer2[offset1 + 3] = value & 255
}
function writeUInt16BE(buffer2, value, offset1) {
  buffer2[offset1] = value >>> 8
  buffer2[offset1 + 1] = value & 255
}
class Wire extends EventEmitter {
  constructor (opts5 = {
  }) {
    super()
    this.conn = opts5.conn
    this.id = id1++
    this.peerId = null
    this.type = ''
    this.amChoking = true
    this.amInterested = false
    this.peerChoking = true
    this.peerInterested = false
    this.peerPieces = new BitField(0)
    this.peerExtensions = {
    }
    this.requests = []
    this.peerRequests = []
    this.extendedMapping = {
    }
    this.peerExtendedMapping = {
    }
    this.extendedHandshake = {
    }
    this.peerExtendedHandshake = {
    }
    this._ext = {
    }
    this._nextExt = 1
    this.uploaded = 0
    this.downloaded = 0
    this.uploadSpeed = __default()
    this.downloadSpeed = __default()
    this._keepAliveInterval
    this._timeout = null
    this._timeoutMs = 0
    this.destroyed = false
    this._parserSize = 0
    this._parser = null
    this._buffer = []
    this._bufferSize = 0
    this._parseHandshake()
  }
  setKeepAlive(enable) {
    clearInterval(this._keepAliveInterval)
    if (enable === false) return
    this._keepAliveInterval = setInterval(() => {
      this.keepAlive()
    }, KEEP_ALIVE_TIMEOUT)
  }
  setTimeout(ms) {
    this._clearTimeout()
    this._timeoutMs = ms
    this._updateTimeout()
  }
  destroy(err) {
    if (this.destroyed) return
    this.destroyed = true
    clearInterval(this._keepAliveInterval)
    this._parse(Number.MAX_VALUE, () => {
    })
    while (this.peerRequests.length) {
      this.peerRequests.pop()
    }
    while (this.requests.length) {
      this._callback(this.requests.pop(), new Error('wire was closed'))
    }
    this.emit('close')
    this.conn && this.conn.destroy(err)
  }
  end() {
    this._onUninterested()
    this._onChoke()
  }
  use(Extension) {
    const name = Extension.prototype.name
    if (!name) {
      throw new Error('Extension class requires a "name" property on the prototype')
    }
    const ext = this._nextExt
    const handler = new Extension(this)
    function noop() {
    }
    if (typeof handler.onHandshake !== 'function') {
      handler.onHandshake = noop
    }
    if (typeof handler.onExtendedHandshake !== 'function') {
      handler.onExtendedHandshake = noop
    }
    if (typeof handler.onMessage !== 'function') {
      handler.onMessage = noop
    }
    this.extendedMapping[ext] = name
    this._ext[name] = handler
    this[name] = handler
    this._nextExt += 1
  }
  keepAlive() {
    this._push(MESSAGE_KEEP_ALIVE)
  }
  handshake(infoHash, peerIdBuffer, extensions) {
    const infoHashBuffer = typeof infoHash === 'string' ? _hex2arr(infoHash) : infoHash
    if (!(peerIdBuffer instanceof Uint8Array)) throw new Error('use uint8')
    const reserved = Uint8Array.from(MESSAGE_RESERVED)
    reserved[5] |= 16
    if (extensions?.dht) reserved[7] |= 1
    this._push(__default1([
      MESSAGE_PROTOCOL,
      reserved,
      infoHashBuffer,
      peerIdBuffer
    ]))
    this._handshakeSent = true
    if (this.peerExtensions.extended && !this._extendedHandshakeSent) {
      this._sendExtendedHandshake()
    }
  }
  _sendExtendedHandshake() {
    const msg = {
      ...this.extendedHandshake,
      m: {
      }
    }
    for (const ext in this.extendedMapping) {
      const name = this.extendedMapping[ext]
      msg.m[name] = Number(ext)
    }
    this.extended(0, __default2(msg))
    this._extendedHandshakeSent = true
  }
  choke() {
    if (this.amChoking) return
    this.amChoking = true
    while (this.peerRequests.length) {
      this.peerRequests.pop()
    }
    this._push(MESSAGE_CHOKE)
  }
  unchoke() {
    if (!this.amChoking) return
    this.amChoking = false
    this._push(MESSAGE_UNCHOKE)
  }
  interested() {
    if (this.amInterested) return
    this.amInterested = true
    this._push(MESSAGE_INTERESTED)
  }
  uninterested() {
    if (!this.amInterested) return
    this.amInterested = false
    this._push(MESSAGE_UNINTERESTED)
  }
  have(index) {
    this._message(4, [
      index
    ])
  }
  bitfield(bitfield) {
    if (!ArrayBuffer.isView(bitfield)) {
      bitfield = bitfield.buffer
    }
    this._message(5, [], bitfield)
  }
  request(index, offset, length, cb) {
    if (this.destroyed) return cb?.(new Error('wire is closed'), undefined)
    if (this.peerChoking) return cb?.(new Error('peer is choking'), undefined)
    this.requests.push(new Request1(index, offset, length, cb))
    this._updateTimeout()
    this._message(6, [
      index,
      offset,
      length
    ])
  }
  piece(index, offset, buffer) {
    this.uploaded += buffer.length
    this.uploadSpeed(buffer.length)
    this.emit('upload', buffer.length)
    this._message(7, [
      index,
      offset
    ], buffer)
  }
  cancel(index, offset, length) {
    const req = this._pull(this.requests, index, offset, length)
    if (!req) return
    this._callback(req, this._pull(this.requests, index, offset, length), new Error('request was cancelled'))
    this._message(8, [
      index,
      offset,
      length
    ])
  }
  port(port) {
    const message = Uint8Array.from(MESSAGE_PORT)
    writeUInt16BE(message, port, 5)
    this._push(message)
  }
  extended(ext, obj) {
    if (typeof ext === 'string' && this.peerExtendedMapping[ext]) {
      ext = this.peerExtendedMapping[ext]
    }
    if (typeof ext === 'number') {
      const extId = Uint8Array.from([
        ext
      ])
      const buf = ArrayBuffer.isView(obj) ? obj : __default2(obj)
      this._message(20, [], __default1([
        extId,
        buf
      ]))
    } else {
      throw new Error(`Unrecognized extension: ${ext}`)
    }
  }
  _message(id, numbers, data) {
    const dataLength = data ? data.length : 0
    const buffer3 = new Uint8Array(5 + 4 * numbers.length)
    writeUInt32BE(buffer3, buffer3.length + dataLength - 4, 0)
    buffer3[4] = id
    for (let i4 = 0; i4 < numbers.length; i4++) {
      writeUInt32BE(buffer3, numbers[i4], 5 + 4 * i4)
    }
    this._push(buffer3)
    if (data) this._push(data)
  }
  _push(data) {
    if (this.destroyed) return
    return this.conn.send(data)
  }
  _onKeepAlive() {
    this.emit('keep-alive')
  }
  _onHandshake(infoHashBuffer, peerIdBuffer, extensions) {
    const infoHash = _arr2hex(infoHashBuffer)
    const peerId = _arr2hex(peerIdBuffer)
    this.peerId = peerId
    this.peerExtensions = extensions
    this.emit('handshake', infoHash, peerId, extensions)
    let name
    for (name in this._ext) {
      this._ext[name].onHandshake(infoHash, peerId, extensions)
    }
    if (extensions.extended && this._handshakeSent && !this._extendedHandshakeSent) {
      this._sendExtendedHandshake()
    }
  }
  _onChoke() {
    this.peerChoking = true
    this.emit('choke')
    while (this.requests.length) {
      this._callback(this.requests.pop(), new Error('peer is choking'), null)
    }
  }
  _onUnchoke() {
    this.peerChoking = false
    this.emit('unchoke')
  }
  _onInterested() {
    this.peerInterested = true
    this.emit('interested')
  }
  _onUninterested() {
    this.peerInterested = false
    this.emit('uninterested')
  }
  _onHave(index) {
    if (this.peerPieces.get(index)) return
    this.peerPieces.set(index, true)
    this.emit('have', index, this)
  }
  _onBitField(buffer) {
    const old = this.peerPieces
    this.peerPieces = new BitField(buffer)
    this.emit('bitfield', this.peerPieces, old)
  }
  _onRequest(index, offset, length) {
    if (this.amChoking) return
    const respond = (err, buffer3) => {
      if (request !== this._pull(this.peerRequests, index, offset, length)) return
      if (err) return console.error('error satisfying request index=%d offset=%d length=%d (%s)', index, offset, length, err.message)
      this.piece(index, offset, buffer3)
    }
    var request = new Request1(index, offset, length, respond)
    this.peerRequests.push(request)
    this.emit('request', index, offset, length, respond)
  }
  _onPiece(index, offset, buffer) {
    const req = this._pull(this.requests, index, offset, buffer.length)
    if (!req) return
    this._callback(req, null, buffer)
    this.downloaded += buffer.length
    this.downloadSpeed(buffer.length)
    this.emit('piece', index, offset, buffer)
  }
  _onCancel(index, offset, length) {
    this._pull(this.peerRequests, index, offset, length)
    this.emit('cancel', index, offset, length)
  }
  _onPort(port) {
    this.emit('port', port)
  }
  _onExtended(ext, buf) {
    if (ext === 0) {
      let info
      try {
        info = decode(buf)
      } catch (err) {
      }
      if (!info) return
      this.peerExtendedHandshake = info
      let name
      if (typeof info.m === 'object') {
        for (name in info.m) {
          this.peerExtendedMapping[name] = Number(info.m[name].toString())
        }
      }
      for (name in this._ext) {
        if (this.peerExtendedMapping[name]) {
          this._ext[name].onExtendedHandshake(this.peerExtendedHandshake)
        }
      }
      this.emit('extended', 'handshake', this.peerExtendedHandshake)
    } else {
      if (this.extendedMapping[ext]) {
        ext = this.extendedMapping[ext]
        if (this._ext[ext]) {
          this._ext[ext].onMessage(buf)
        }
      }
      this.emit('extended', ext, buf)
    }
  }
  _onTimeout() {
    this._callback(this.requests.shift(), new Error('request has timed out'), null)
    this.emit('timeout')
  }
  _write(data) {
    this._bufferSize += data.length
    this._buffer.push(data)
    while (this._bufferSize >= this._parserSize) {
      const buffer3 = this._buffer.length === 1 ? this._buffer[0] : __default1(this._buffer)
      this._bufferSize -= this._parserSize
      this._buffer = this._bufferSize ? [
        buffer3.subarray(this._parserSize)
      ] : []
      this._parser?.(buffer3.subarray(0, this._parserSize))
    }
  }
  _callback(request, err, buffer) {
    if (!request) return
    this._clearTimeout()
    if (!this.peerChoking && !this.destroyed) this._updateTimeout()
    request.callback(err, buffer)
  }
  _clearTimeout() {
    if (!this._timeout) return
    clearTimeout(this._timeout)
    this._timeout = null
  }
  _updateTimeout() {
    if (!this._timeoutMs || !this.requests.length || this._timeout) return
    this._timeout = setTimeout(() => this._onTimeout()
      , this._timeoutMs)
  }
  _parse(size, parser) {
    this._parserSize = size
    this._parser = parser
  }
  _onMessageLength(buffer) {
    const length3 = readUInt32BE(buffer, 0)
    if (length3 > 0) {
      this._parse(length3, this._onMessage)
    } else {
      this._onKeepAlive()
      this._parse(4, this._onMessageLength)
    }
  }
  _onMessage(buffer) {
    this._parse(4, this._onMessageLength)
    switch (buffer[0]) {
      case 0:
        return this._onChoke()
      case 1:
        return this._onUnchoke()
      case 2:
        return this._onInterested()
      case 3:
        return this._onUninterested()
      case 4:
        return this._onHave(readUInt32BE(buffer, 1))
      case 5:
        return this._onBitField(buffer.subarray(1))
      case 6:
        return this._onRequest(readUInt32BE(buffer, 1), readUInt32BE(buffer, 5), readUInt32BE(buffer, 9))
      case 7:
        return this._onPiece(readUInt32BE(buffer, 1), readUInt32BE(buffer, 5), buffer.subarray(9))
      case 8:
        return this._onCancel(readUInt32BE(buffer, 1), readUInt32BE(buffer, 5), readUInt32BE(buffer, 9))
      case 9:
        return this._onPort(readUInt16BE(buffer, 1))
      case 20:
        return this._onExtended(buffer[1], buffer.subarray(2))
      default:
        return this.emit('unknownmessage', buffer)
    }
  }
  _parseHandshake() {
    this._parse(1, (buffer3) => {
      const pstrlen = buffer3[0]
      this._parse(pstrlen + 48, (handshake) => {
        const protocol = handshake.subarray(0, pstrlen)
        if (_arr2hex(protocol) !== '426974546f7272656e742070726f746f636f6c') {
          console.error('wire not speaking BitTorrent protocol', protocol)
          this.destroy()
          return
        }
        handshake = handshake.subarray(pstrlen)
        this._onHandshake(handshake.slice(8, 28), handshake.slice(28, 48), {
          dht: !!(handshake[7] & 1),
          extended: !!(handshake[5] & 16)
        })
        this._parse(4, this._onMessageLength)
      })
    })
  }
  _pull(requests, piece, offset, length) {
    for (let i4 = 0, len = requests.length; i4 < len; i4++) {
      const req = requests[i4]
      if (req.piece === piece && req.offset === offset && req.length === length) {
        exports$12(requests, i4)
        return req
      }
    }
    return null
  }
}
const VERSION = '1.2.5'
class WebConn extends Wire {
  constructor (url1, torrent2, peerId1) {
    super()
    this.events = {
    }
    this.url = url1
    this._torrent = torrent2
    this.webPeerIdBuffer = peerId1
    this.timestap = Date.now()
    this.setKeepAlive(true)
    this.once('handshake', (infoHash) => {
      if (this.destroyed) return
      this.handshake(infoHash, this.webPeerIdBuffer)
      const numPieces = this._torrent.pieces.length
      const bitfield = new BitField(numPieces)
      bitfield.buffer.fill(255)
      for (let i4 = 0; i4 < 8; i4++) {
        bitfield.set(numPieces + i4, false)
      }
      this.bitfield(bitfield)
    })
    this.once('interested', () => {
      this.unchoke()
    })
    this.on('request', (pieceIndex, offset2, length3, callback1) => {
      this.httpRequest(pieceIndex, offset2, length3, callback1).catch(console.warn)
    })
  }
  async httpRequest(pieceIndex, offset, length, cb) {
    const pieceOffset = pieceIndex * this._torrent.pieceLength
    const rangeStart = pieceOffset + offset
    const rangeEnd = rangeStart + length - 1
    const files = this._torrent.files
    let requests
    if (files.length <= 1) {
      requests = [
        {
          url: this.url,
          start: rangeStart,
          end: rangeEnd
        }
      ]
    } else {
      const requestedFiles = files.filter((file1) => {
        return file1.offset <= rangeEnd && file1.offset + file1.length > rangeStart
      })
      if (requestedFiles.length < 1) {
        return cb(new Error('Could not find file corresponnding to web seed range request'))
      }
      requests = requestedFiles.map((requestedFile) => {
        const fileEnd = requestedFile.offset + requestedFile.length - 1
        const url1 = this.url + (this.url[this.url.length - 1] === '/' ? '' : '/') + requestedFile.path
        return {
          url: url1,
          fileOffsetInRange: Math.max(requestedFile.offset - rangeStart, 0),
          start: Math.max(rangeStart - requestedFile.offset, 0),
          end: Math.min(fileEnd, rangeEnd - requestedFile.offset)
        }
      })
    }
    const chunks = await Promise.all(requests.map(async (request) => {
      const url1 = request.url
      const start1 = request.start
      const end1 = request.end
      const res = await fetch(url1, {
        importance: 'low',
        cache: 'no-store',
        headers: {
          'user-agent': `Torrent-GO/${VERSION} (https://webtorrent.io)`,
          range: `bytes=${start1}-${end1}`
        }
      })
      return res.arrayBuffer().then((ab) => new Uint8Array(ab)
      )
    }))
    cb(null, __default1(chunks))
  }
  destroy() {
    this._torrent = null
  }
}
const CONNECT_TIMEOUT_WEBRTC = 25000
const HANDSHAKE_TIMEOUT = 25000
class Peer1 {
  constructor (id2, type) {
    this.id = id2
    this.type = type
    this.addr = null
    this.conn = null
    this.swarm = null
    this.wire = null
    this.connected = false
    this.destroyed = false
    this.timeout = null
    this.sentHandshake = false
    this.handshakeTimeout = null
    this.connectTimeout = null
  }
  onConnect() {
    if (this.destroyed) return
    this.connected = true
    clearTimeout(this.connectTimeout)
    const conn = this.conn
    let wire1
    if (this.type === 'webSeed') {
      wire1 = this.wire = new Wire({
        conn: {
          send(d) {
            conn._write(d)
          }
        }
      })
      conn.conn = {
        send(d) {
          wire1._write(d)
        }
      }
    } else {
      wire1 = this.wire = new Wire({
        conn
      })
    }
    conn.onMessage = (data2) => {
      wire1._write(data2)
    }
    wire1.type = this.type
    wire1.once('handshake', (infoHash, peerId1) => {
      this.onHandshake(infoHash, peerId1)
    })
    this.startHandshakeTimeout()
    if (this.swarm && !this.sentHandshake) this.handshake()
  }
  onHandshake(infoHash, peerId) {
    if (!this.swarm) return
    if (this.destroyed) return
    if (this.swarm.destroyed) {
      return this.destroy(new Error('swarm already destroyed'))
    }
    if (infoHash !== this.swarm.infoHash) {
      return this.destroy(new Error('unexpected handshake info hash for this swarm'))
    }
    if (peerId === this.swarm.peerId) {
      return this.destroy(new Error('refusing to connect to ourselves'))
    }
    clearTimeout(this.handshakeTimeout)
    this.wire.remoteAddress = this.conn.remoteAddress
    this.wire.remotePort = this.conn.remotePort
    this.swarm._onWire(this.wire)
    if (!this.swarm || this.swarm.destroyed) return
    if (!this.sentHandshake) this.handshake()
  }
  handshake() {
    this.sentHandshake = true
    this.wire.handshake(this.swarm.infoHash, this.swarm.client.peerIdBuffer, {
    })
  }
  startConnectTimeout() {
    clearTimeout(this.connectTimeout)
    this.connectTimeout = setTimeout(() => {
      this.destroy(new Error('connect timeout'))
    }, CONNECT_TIMEOUT_WEBRTC)
  }
  startHandshakeTimeout() {
    clearTimeout(this.handshakeTimeout)
    this.handshakeTimeout = setTimeout(() => {
      this.destroy(new Error('handshake timeout'))
      console.log('this is bad')
    }, HANDSHAKE_TIMEOUT)
  }
  destroy(err) {
    if (err) {
    }
    if (this.destroyed) return
    this.destroyed = true
    this.connected = false
    clearTimeout(this.connectTimeout)
    clearTimeout(this.handshakeTimeout)
    const swarm = this.swarm
    const conn = this.conn
    const wire1 = this.wire
    this.swarm = null
    this.conn = null
    this.wire = null
    if (swarm && wire1) {
      console.log(swarm.wires)
      exports$12(swarm.wires, swarm.wires.indexOf(wire1))
    }
    if (conn) {
      conn.destroy(err)
    }
    if (wire1) wire1.destroy()
    if (swarm) swarm.removePeer(this.id)
  }
}
function createWebRTCPeer(conn, swarm) {
  const peer = new Peer1(conn.id, 'webrtc')
  peer.swarm = swarm
  peer.conn = conn
  conn.onDestroy = peer.destroy.bind(peer)
  if (peer.conn.connected) {
    peer.onConnect()
  } else {
    peer.conn.onConnect = () => peer.onConnect()
      
    peer.startConnectTimeout()
  }
  return peer
}
function createWebSeedPeer(url1, swarm, hash1) {
  const peer = new Peer1(url1, 'webSeed')
  peer.swarm = swarm
  peer.conn = new WebConn(url1, swarm, hash1)
  peer.onConnect()
  return peer
}
const CHOKE_TIMEOUT = 5000
const MAX_BLOCK_LENGTH = 128 * 1024
const RECHOKE_INTERVAL = 10000
const RECHOKE_OPTIMISTIC_DURATION = 2
const VERSION1 = '1.2.5'
const USER_AGENT = `Torrent GO/${VERSION1} (https://github.com/jimmywarting/torrent-go)`
class Torrent extends EventEmitter {
  constructor (parsedTorrent1, client2, opts6 = {
  }) {
    super()
    this.client = client2
    this.announce = opts6.announce
    this.urlList = opts6.urlList
    this.path = opts6.path
    this.skipVerify = !!opts6.skipVerify
    this._getAnnounceOpts = opts6.getAnnounceOpts
    this.strategy = opts6.strategy || 'sequential'
    this.maxWebConns = opts6.maxWebConns || 4
    this._rechokeNumSlots = opts6.uploads === false || opts6.uploads === 0 ? 0 : +opts6.uploads || 10
    this._rechokeOptimisticWire = null
    this._rechokeOptimisticTime = 0
    this._rechokeIntervalId = null
    this.length
    this.ready = false
    this.destroyed = false
    this.paused = false
    this.done = false
    this.db = null
    this.metadata = null
    this.store = null
    this.files = []
    this.pieces = []
    this._amInterested = false
    this._selections = []
    this._critical = []
    this._started = []
    this.wires = []
    this._queue = []
    this._peers = {
    }
    this._peersLength = 0
    this.received = 0
    this.downloaded = 0
    this.uploaded = 0
    this._downloadSpeed = __default()
    this._uploadSpeed = __default()
    this._servers = []
    this._xsRequests = []
    this.infoHash = parsedTorrent1.infoHash
    this.path = '/torrent-go/' + parsedTorrent1.infoHash
    this.db = null
    this._rechokeIntervalId = setInterval(() => {
      this._rechoke()
    }, RECHOKE_INTERVAL)
    const request = indexedDB.open(parsedTorrent1.infoHash)
    request.onupgradeneeded = (evt) => {
      const db = evt.target.result
      db.createObjectStore('chunks', {
        keyPath: 'index',
        autoIncrement: true
      })
      db.createObjectStore('state')
    }
    request.onsuccess = (evt) => {
      this.db = evt.target.result
      const transaction = this.db.transaction([
        'state'
      ], 'readwrite')
      const idbstore = transaction.objectStore('state')
      const req = idbstore.get('parsedTorrent')
      req.onsuccess = () => {
        this._processParsedTorrent(req.result || parsedTorrent1)
        this._onListening()
      }
    }
    request.onerror = () => {
      this._processParsedTorrent(parsedTorrent1)
      this._onListening()
    }
  }
  get timeRemaining() {
    if (this.done) return 0
    if (this.downloadSpeed === 0) return Infinity
    return (this.length - this.downloaded) / this.downloadSpeed * 1000
  }
  get downloadSpeed() {
    return this.done ? 0 : this._downloadSpeed()
  }
  get uploadSpeed() {
    return this._uploadSpeed()
  }
  get progress() {
    return this.length ? this.downloaded / this.length : 0
  }
  get ratio() {
    return this.uploaded / (this.received || 1)
  }
  get numPeers() {
    return this.wires.length
  }
  get torrentFileBlobURL() {
    if (!this.torrentFile) return null
    return URL.createObjectURL(new Blob([
      this.torrentFile
    ], {
      type: 'application/x-bittorrent'
    }))
  }
  get _numQueued() {
    return this._queue.length + (this._peersLength - this._numConns)
  }
  get _numConns() {
    let numConns = 0
    for (const id3 in this._peers) {
      if (this._peers[id3].connected) numConns += 1
    }
    return numConns
  }
  _processParsedTorrent(parsedTorrent) {
    if (!parsedTorrent.info) return
    if (this.announce) {
      parsedTorrent.announce.push(...this.announce)
    }
    if (this.client.tracker && globalThis.WEBTORRENT_ANNOUNCE && !this.private) {
      parsedTorrent.announce.push(...globalThis.WEBTORRENT_ANNOUNCE)
    }
    if (this.urlList) {
      parsedTorrent.urlList.push(...this.urlList)
    }
    parsedTorrent.announce = [
      ...new Set(parsedTorrent.announce)
    ]
    parsedTorrent.urlList = [
      ...new Set(parsedTorrent.urlList)
    ]
    Object.assign(this, parsedTorrent)
    this.magnetURI = toMagnetURI(parsedTorrent)
    this.torrentFile = toTorrentFile(parsedTorrent)
    this._onMetadata(this.torrentFile)
    if (this.db) {
      const transaction = this.db.transaction([
        'state'
      ], 'readwrite')
      const idbstore = transaction.objectStore('state')
      try {
        idbstore.put(parsedTorrent, 'parsedTorrent')
      } catch (err) {
      }
    }
  }
  _onListening() {
    let trackerOpts = this.client.tracker
    if (trackerOpts) {
      trackerOpts = Object.assign({
      }, this.client.tracker, {
        filter: (peerId2) => {
          return !(peerId2 in this._peers) && peerId2 !== this.client.peerId
        },
        getAnnounceOpts: () => {
          const opts7 = {
            uploaded: this.uploaded,
            downloaded: this.downloaded,
            left: Math.max(this.length - this.downloaded, 0)
          }
          if (this.client.tracker.getAnnounceOpts) {
            Object.assign(opts7, this.client.tracker.getAnnounceOpts())
          }
          if (this._getAnnounceOpts) {
            Object.assign(opts7, this._getAnnounceOpts())
          }
          return opts7
        }
      })
    }
    this.discovery = new Discovery({
      infoHash: this.infoHash,
      announce: this.announce,
      peerId: this.client.peerIdBuffer,
      tracker: trackerOpts,
      userAgent: USER_AGENT
    })
    this.discovery.on('error', (err) => {
      this._destroy(err)
    })
    this.discovery.on('peer', this.addPeer.bind(this))
    this.discovery.on('trackerAnnounce', () => {
      this.emit('trackerAnnounce')
      if (this.numPeers === 0) this.emit('noPeers', 'tracker')
    })
    this.discovery.on('warning', this.emit.bind(this, 'warning'))
    if (this.info) {
      this._onMetadata(this)
    } else if (this.xs) {
      this._getMetadataFromServer()
    }
  }
  _getMetadataFromServer() {
    const self = this
    const urls = Array.isArray(this.xs) ? this.xs : [
      this.xs
    ]
    async function getMetadataFromURL(url1) {
      if (!url1.startsWith('https://')) {
        self.emit('warning', new Error(`skipping non-https xs param: ${url1}`))
        return
      }
      const ctrl = new AbortController()
      self._xsRequests.push(ctrl)
      const res = await fetch(url1, {
        headers: {
          'user-agent': USER_AGENT
        },
        signal: ctrl.signal
      })
      if (self.destroyed || self.metadata) return
      if (res.status !== 200) {
        self.emit('warning', new Error(`non-200 status code ${res.status} from xs param: ${url1}`))
        return
      }
      const parsedTorrent2 = await res.arrayBuffer().then(parseTorrent)
      if (!parsedTorrent2) {
        self.emit('warning', new Error(`got invalid torrent file from xs param: ${url1}`))
        return
      }
      if (parsedTorrent2.infoHash !== self.infoHash) {
        self.emit('warning', new Error(`got torrent file with incorrect info hash from xs param: ${url1}`))
        return
      }
      self._onMetadata(parsedTorrent2)
    }
    return urls.map((url1) => getMetadataFromURL(url1)
    )
  }
  async _onMetadata(metadata) {
    if (this.metadata || this.destroyed) return
    this._xsRequests.forEach((req) => {
      req.abort()
    })
    this._xsRequests = []
    let parsedTorrent2
    if (metadata && metadata.infoHash) {
      parsedTorrent2 = metadata
    } else {
      try {
        parsedTorrent2 = await parseTorrent(metadata)
      } catch (err) {
        return this._destroy(err)
      }
    }
    this._processParsedTorrent(parsedTorrent2)
    this.metadata = this.torrentFile
    this._pieceSelector = new PieceSelector(this)
    this.pieces = this._pieceSelector._piecesIndex
    this.bitfield = new BitField(this.pieces.length)
    if (this.db) {
      await new Promise((resolve) => {
        const transaction = this.db.transaction([
          'chunks'
        ], 'readwrite')
        const idbstore = transaction.objectStore('chunks')
        const getAllKeysRequest = idbstore.getAllKeys()
        getAllKeysRequest.onsuccess = () => {
          getAllKeysRequest.result.forEach((index2) => {
            this.pieces[index2] = null
            this.bitfield.set(index2, true)
            this.downloaded += index2 === this.pieces.length - 1 ? this.lastPieceLength : this.pieceLength
          })
          resolve()
        }
      })
    }
    this.store = new Storage1(this.pieceLength, {
      torrent: {
        infoHash: this.infoHash
      },
      files: this.files.map((file1) => ({
        path: this.path + '/' + file1.path,
        length: file1.length,
        offset: file1.offset
      })
      ),
      db: this.db,
      length: this.length,
      name: this.infoHash
    })
    this.files = this.files.map((file1) => new File1(this, file1)
    )
    const l1 = this.info.pieces.length / 20
    if (this.so) {
      const selectOnlyFiles = __default3(this.so)
      this.files.forEach((_, i4) => {
        if (selectOnlyFiles.includes(i4)) this.files[i4].select(true)
      })
    } else {
      this.select(0, l1 - 1, 1)
    }
    this.wires.forEach((wire1) => {
      if (wire1.ut_metadata) wire1.ut_metadata.setMetadata(this.metadata)
      this._onWireWithMetadata(wire1)
      this._pieceSelector.addWire(wire1)
    })
    if (this.client.enableWebSeeds) {
      for (const url1 of this.urlList) {
        const buf = _text2arr(url1)
        const hash1 = await _sha1(buf)
        this.addWebSeed(url1, hash1)
      }
    }
    setTimeout(() => {
      this._onStore()
    })
    this.emit('metadata')
  }
  _markAllVerified() {
    for (let index2 = 0; index2 < this.pieces.length; index2++) {
      this.pieces[index2] = null
      this.bitfield.set(index2, true)
    }
  }
  _onStore() {
    if (this.destroyed) return
    this.ready = true
    this.emit('ready')
    this._checkDone()
    this._updateSelections()
  }
  destroy(cb) {
    this._destroy(null, cb)
  }
  _destroy(err, cb = () => {
  }) {
    if (this.destroyed) return
    this.destroyed = true
    this.removeAllListeners('piece')
    try {
      this.client.remove(this)
    } catch (_) {
    }
    clearInterval(this._rechokeIntervalId)
    this._xsRequests.forEach((req) => {
      req.abort()
    })
    this.db?.close()
    this._rarityMap?.destroy()
    for (const id3 in this._peers) this.removePeer(id3)
    this.files.forEach((file1) => {
      if (file1 instanceof File1) file1._destroy()
    })
    const tasks = []
    if (this.discovery) {
      tasks.push(this.discovery.destroy(() => {
      }))
    }
    if (this.store) {
      tasks.push(this.store.close(() => {
      }))
    }
    Promise.all(tasks).then(() => cb()
      , cb)
    if (err) {
      this.emit('error', err)
    }
    this.emit('close')
    this.files = []
    this._peers = this._rarityMap = this._servers = this._xsRequests = this.client = this.discovery = this.store = null
  }
  addPeer(peer) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (!this.infoHash) throw new Error('addPeer() must not be called before the `infoHash` event')
    if (this.client.blocked) {
      let host
      if (typeof peer.remoteAddress === 'string') {
        host = peer.remoteAddress
      }
      if (host && this.client.blocked.contains(host)) {
        peer.destroy()
        this.emit('blockedPeer', peer)
        return false
      }
    }
    const wasAdded = !!this._addPeer(peer)
    this.emit(wasAdded ? 'peer' : 'invalidPeer', peer)
    return wasAdded
  }
  _addPeer(peer) {
    const id3 = peer && peer.id || peer
    if (this._peers[id3]) {
      console.log(peer)
      console.log(peer.timestamp)
      peer.destroy(new Error('Duplicated peer'))
      return null
    }
    if (this.paused) {
      peer.destroy()
      return null
    }
    const newPeer = createWebRTCPeer(peer, this)
    this._peers[newPeer.id] = newPeer
    this._peersLength += 1
    return newPeer
  }
  addWebSeed(url, hash) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (!/^https?:\/\/.+/.test(url)) {
      this.emit('warning', new Error(`ignoring invalid web seed: ${url}`))
      this.emit('invalidPeer', url)
      return
    }
    if (this._peers[url]) {
      this.emit('warning', new Error(`ignoring duplicate web seed: ${url}`))
      this.emit('invalidPeer', url)
      return
    }
    const newPeer = createWebSeedPeer(url, this, hash)
    this._peers[newPeer.id] = newPeer
    this._peersLength += 1
    this.emit('peer', url)
  }
  _addIncomingPeer(peer) {
    if (this.destroyed) return peer.destroy(new Error('torrent is destroyed'))
    if (this.paused) return peer.destroy(new Error('torrent is paused'))
    this._peers[peer.id] = peer
    this._peersLength += 1
  }
  removePeer(peer) {
    const id3 = peer && peer.id || peer
    peer = this._peers[id3]
    if (!peer) return
    delete this._peers[id3]
    this._peersLength -= 1
    peer.destroy()
  }
  select(start, end, priority = 0, notify = noop) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    if (start < 0 || end < start || this.pieces.length <= end) {
      throw new Error(`invalid selection ${start}:${end}`)
    }
    for (let i4 = start; i4 <= end; i4++) {
      this.pieces[i4] && (this.pieces[i4]._priority = priority)
    }
  }
  deselect(start, end, priority) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    priority = Number(priority) || 0
    for (let i4 = 0; i4 < this._selections.length; ++i4) {
      const s = this._selections[i4]
      if (s.from === start && s.to === end && s.priority === priority) {
        this._selections.splice(i4, 1)
        break
      }
    }
    this._updateSelections()
  }
  critical(start, end) {
    if (this.destroyed) throw new Error('torrent is destroyed')
    this.select(start, end, 5)
  }
  async _onWire(wire) {
    wire.on('download', (downloaded) => {
      if (this.destroyed) return
      this.received += downloaded
      this.downloaded += downloaded
      this._downloadSpeed(downloaded)
      this.client._downloadSpeed(downloaded)
      this.emit('download', downloaded)
    })
    wire.on('upload', (uploaded) => {
      if (this.destroyed) return
      this.uploaded += uploaded
      this._uploadSpeed(uploaded)
      this.client._uploadSpeed(uploaded)
      this.emit('upload', uploaded)
    })
    this.wires.push(wire)
    wire.on('timeout', () => {
      wire.destroy()
    })
    wire.setTimeout(30000)
    wire.setKeepAlive(true)
    wire.use(utMetadata)
    if (ArrayBuffer.isView(this.metadata)) {
      await wire.ut_metadata.setMetadata(this.metadata)
    }
    wire.ut_metadata.on('warning', (err) => {
      console.warn('ut_metadata warning: %s', err.message)
    })
    if (!this.metadata) {
      wire.ut_metadata.on('metadata', (metadata) => {
        this._onMetadata(metadata)
      })
      wire.ut_metadata.fetch()
    }
    this.emit('wire', wire)
    if (this._rarityMap) this._rarityMap.addWire(wire)
    if (this._pieceSelector) this._pieceSelector.addWire(wire)
    if (this.metadata) {
      setTimeout(() => {
        this._onWireWithMetadata(wire)
      }, 1000)
    }
  }
  _onWireWithMetadata(wire) {
    console.log(2, '_onWireWithMetadata')
    let timeoutId
    const onChokeTimeout = () => {
      if (this.destroyed || wire.destroyed) return
      if (this._numQueued > 2 * (this._numConns - this.numPeers) && wire.amInterested) {
        wire.destroy(new Error('choked'))
      } else {
        timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
      }
    }
    const updateSeedStatus = () => {
      if (wire.peerPieces.have !== this.pieces.length) return
      wire.isSeeder = true
      wire.choke()
    }
    wire.on('bitfield', () => {
      updateSeedStatus()
      this._updateInterest()
    })
    wire.on('have', () => {
      updateSeedStatus()
    })
    wire.once('interested', () => {
      wire.unchoke()
    })
    wire.once('close', () => {
      clearTimeout(timeoutId)
    })
    wire.on('choke', () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
    })
    wire.on('unchoke', () => {
      clearTimeout(timeoutId)
      this._pieceSelector._updateWire(wire)
    })
    wire.on('request', (index2, offset2, length3, cb) => {
      if (length3 > MAX_BLOCK_LENGTH) {
        return wire.destroy()
      }
      if (this.pieces[index2]) return console.log('asking for piece i dont have')
      this.store.get(index2, {
        offset: offset2,
        length: length3
      }, cb)
    })
    wire.bitfield(this.bitfield)
    wire.uninterested()
    if (wire.type !== 'webSeed') {
      timeoutId = setTimeout(onChokeTimeout, CHOKE_TIMEOUT)
    }
    wire.isSeeder = false
    updateSeedStatus()
  }
  _updateSelections() {
    if (!this.ready || this.destroyed) return
    setTimeout(() => {
      this._gcSelections()
    })
    this._updateInterest()
  }
  _gcSelections() {
    for (let i4 = 0; i4 < this._selections.length; ++i4) {
      const s = this._selections[i4]
      const oldOffset = s.offset
      while (this.bitfield.get(s.from + s.offset) && s.from + s.offset < s.to) {
        s.offset += 1
      }
      if (oldOffset !== s.offset) s.notify()
      if (s.to !== s.from + s.offset) continue
      if (!this.bitfield.get(s.from + s.offset)) continue
      this._selections.splice(i4, 1)
      i4 -= 1
      s.notify()
      this._updateInterest()
    }
    if (!this._selections.length) this.emit('idle')
  }
  _updateInterest() {
    const prev = this._amInterested
    this._amInterested = !!this._selections.length
    this.wires.forEach((wire2) => {
      let interested = false
      for (let index2 = 0; index2 < this.pieces.length; ++index2) {
        if (this.pieces[index2] && wire2.peerPieces.get(index2)) {
          interested = true
          break
        }
      }
      if (interested) wire2.interested()
      else wire2.uninterested()
    })
    if (prev === this._amInterested) return
    if (this._amInterested) this.emit('interested')
    else this.emit('uninterested')
  }
  _rechoke() {
    if (!this.ready) return
    if (this._rechokeOptimisticTime > 0) this._rechokeOptimisticTime -= 1
    else this._rechokeOptimisticWire = null
    const peers = []
    this.wires.forEach((wire2) => {
      if (!wire2.isSeeder && wire2 !== this._rechokeOptimisticWire) {
        peers.push({
          wire: wire2,
          downloadSpeed: wire2.downloadSpeed(),
          uploadSpeed: wire2.uploadSpeed(),
          salt: Math.random(),
          isChoked: true
        })
      }
    })
    peers.sort(rechokeSort)
    let unchokeInterested = 0
    let i4 = 0
    for (; i4 < peers.length && unchokeInterested < this._rechokeNumSlots; ++i4) {
      peers[i4].isChoked = false
      if (peers[i4].wire.peerInterested) unchokeInterested += 1
    }
    if (!this._rechokeOptimisticWire && i4 < peers.length && this._rechokeNumSlots) {
      const candidates = peers.slice(i4).filter((peer) => peer.wire.peerInterested
      )
      const optimistic = candidates[randomInt(candidates.length)]
      if (optimistic) {
        optimistic.isChoked = false
        this._rechokeOptimisticWire = optimistic.wire
        this._rechokeOptimisticTime = RECHOKE_OPTIMISTIC_DURATION
      }
    }
    peers.forEach((peer) => {
      if (peer.wire.amChoking !== peer.isChoked) {
        if (peer.isChoked) peer.wire.choke()
        else peer.wire.unchoke()
      }
    })
    function rechokeSort(peerA, peerB) {
      if (peerA.downloadSpeed !== peerB.downloadSpeed) {
        return peerB.downloadSpeed - peerA.downloadSpeed
      }
      if (peerA.uploadSpeed !== peerB.uploadSpeed) {
        return peerB.uploadSpeed - peerA.uploadSpeed
      }
      if (peerA.wire.amChoking !== peerB.wire.amChoking) {
        return peerA.wire.amChoking ? 1 : -1
      }
      return peerA.salt - peerB.salt
    }
  }
  _checkDone() {
    if (this.destroyed) return
    this.files.forEach((file1) => {
      if (file1.done) return
      for (let i4 = file1._startPiece; i4 <= file1._endPiece; ++i4) {
        if (!this.bitfield.get(i4)) return
      }
      file1.done = true
      file1.emit('done')
    })
    const done = this.bitfield.have === this.pieces.length
    if (!this.done && done) {
      this.done = true
      this.emit('done')
    }
    this._gcSelections()
    return done
  }
  async load() {
    if (this.destroyed) throw new Error('torrent is destroyed')
  }
  pause() {
    if (this.destroyed) return
    this.paused = true
  }
  resume() {
    if (this.destroyed) return
    this.paused = false
  }
}
function randomInt(high) {
  return Math.random() * high | 0
}
function noop() {
}
var exports3 = {
}
exports3 = rangeParser
function rangeParser(size, str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string")
  }
  var index2 = str.indexOf("=")
  if (index2 === -1) {
    return -2
  }
  var arr = str.slice(index2 + 1).split(",")
  var ranges = []
  ranges.type = str.slice(0, index2)
  for (var i4 = 0; i4 < arr.length; i4++) {
    var range = arr[i4].split("-")
    var start2 = parseInt(range[0], 10)
    var end2 = parseInt(range[1], 10)
    if (isNaN(start2)) {
      start2 = size - end2
      end2 = size - 1
    } else if (isNaN(end2)) {
      end2 = size - 1
    }
    if (end2 > size - 1) {
      end2 = size - 1
    }
    if (isNaN(start2) || isNaN(end2) || start2 > end2 || start2 < 0) {
      continue
    }
    ranges.push({
      start: start2,
      end: end2
    })
  }
  if (ranges.length < 1) {
    return -1
  }
  return options && options.combine ? combineRanges(ranges) : ranges
}
function combineRanges(ranges) {
  var ordered = ranges.map(mapWithIndex).sort(sortByRangeStart)
  for (var j = 0, i4 = 1; i4 < ordered.length; i4++) {
    var range = ordered[i4]
    var current = ordered[j]
    if (range.start > current.end + 1) {
      ordered[++j] = range
    } else if (range.end > current.end) {
      current.end = range.end
      current.index = Math.min(current.index, range.index)
    }
  }
  ordered.length = j + 1
  var combined = ordered.sort(sortByRangeIndex).map(mapWithoutIndex)
  combined.type = ranges.type
  return combined
}
function mapWithIndex(range, index2) {
  return {
    start: range.start,
    end: range.end,
    index: index2
  }
}
function mapWithoutIndex(range) {
  return {
    start: range.start,
    end: range.end
  }
}
function sortByRangeIndex(a, b) {
  return a.index - b.index
}
function sortByRangeStart(a, b) {
  return a.start - b.start
}
var exports$13 = exports3
class Crc32 {
  constructor () {
    this.crc = -1
  }
  append(data) {
    let crc = this.crc | 0
    const table = this.table
    for (let offset2 = 0, len = data.length | 0; offset2 < len; offset2++) {
      crc = crc >>> 8 ^ table[(crc ^ data[offset2]) & 255]
    }
    this.crc = crc
  }
  get() {
    return ~this.crc
  }
}
Crc32.prototype.table = (() => {
  let i4
  let j
  let t
  const table = []
  for (i4 = 0; i4 < 256; i4++) {
    t = i4
    for (j = 0; j < 8; j++) {
      t = t & 1 ? t >>> 1 ^ 3988292384 : t >>> 1
    }
    table[i4] = t
  }
  return table
})()
const getDataHelper = (byteLength) => {
  const uint8 = new Uint8Array(byteLength)
  return {
    array: uint8,
    view: new DataView(uint8.buffer)
  }
}
const pump = (zipObj) => zipObj.reader.read().then((chunk) => {
  if (chunk.done) return zipObj.writeFooter()
  const outputData = chunk.value
  zipObj.crc.append(outputData)
  zipObj.uncompressedLength += outputData.length
  zipObj.compressedLength += outputData.length
  zipObj.ctrl.enqueue(outputData)
})
  
function createWriter(underlyingSource) {
  const files = Object.create(null)
  const filenames = []
  const encoder = new TextEncoder()
  let offset2 = 0
  let activeZipIndex = 0
  let ctrl
  let activeZipObject, closed
  function next() {
    activeZipIndex++
    activeZipObject = files[filenames[activeZipIndex]]
    if (activeZipObject) processNextChunk()
    else if (closed) closeZip()
  }
  const zipWriter = {
    enqueue(fileLike) {
      if (closed) throw new TypeError('Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed')
      let name = fileLike.name.trim()
      const date = new Date(typeof fileLike.lastModified === 'undefined' ? Date.now() : fileLike.lastModified)
      if (fileLike.directory && !name.endsWith('/')) name += '/'
      if (files[name]) throw new Error('File already exists.')
      const nameBuf = encoder.encode(name)
      filenames.push(name)
      const zipObject = files[name] = {
        level: 0,
        ctrl,
        directory: !!fileLike.directory,
        nameBuf,
        comment: encoder.encode(fileLike.comment || ''),
        compressedLength: 0,
        uncompressedLength: 0,
        writeHeader() {
          const header = getDataHelper(26)
          const data2 = getDataHelper(30 + nameBuf.length)
          zipObject.offset = offset2
          zipObject.header = header
          if (zipObject.level !== 0 && !zipObject.directory) {
            header.view.setUint16(4, 2048)
          }
          header.view.setUint32(0, 335546376)
          header.view.setUint16(6, (date.getHours() << 6 | date.getMinutes()) << 5 | date.getSeconds() / 2, true)
          header.view.setUint16(8, (date.getFullYear() - 1980 << 4 | date.getMonth() + 1) << 5 | date.getDate(), true)
          header.view.setUint16(22, nameBuf.length, true)
          data2.view.setUint32(0, 1347093252)
          data2.array.set(header.array, 4)
          data2.array.set(nameBuf, 30)
          offset2 += data2.array.length
          ctrl.enqueue(data2.array)
        },
        writeFooter() {
          const footer = getDataHelper(16)
          footer.view.setUint32(0, 1347094280)
          if (zipObject.crc) {
            zipObject.header.view.setUint32(10, zipObject.crc.get(), true)
            zipObject.header.view.setUint32(14, zipObject.compressedLength, true)
            zipObject.header.view.setUint32(18, zipObject.uncompressedLength, true)
            footer.view.setUint32(4, zipObject.crc.get(), true)
            footer.view.setUint32(8, zipObject.compressedLength, true)
            footer.view.setUint32(12, zipObject.uncompressedLength, true)
          }
          ctrl.enqueue(footer.array)
          offset2 += zipObject.compressedLength + 16
          next()
        },
        fileLike
      }
      if (!activeZipObject) {
        activeZipObject = zipObject
        processNextChunk()
      }
    },
    close() {
      if (closed) throw new TypeError('Cannot close a readable stream that has already been requested to be closed')
      if (!activeZipObject) closeZip()
      closed = true
    }
  }
  function closeZip() {
    let length3 = 0
    let index2 = 0
    let indexFilename, file1
    for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
      file1 = files[filenames[indexFilename]]
      length3 += 46 + file1.nameBuf.length + file1.comment.length
    }
    const data2 = getDataHelper(length3 + 22)
    for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
      file1 = files[filenames[indexFilename]]
      data2.view.setUint32(index2, 1347092738)
      data2.view.setUint16(index2 + 4, 5120)
      data2.array.set(file1.header.array, index2 + 6)
      data2.view.setUint16(index2 + 32, file1.comment.length, true)
      if (file1.directory) {
        data2.view.setUint8(index2 + 38, 16)
      }
      data2.view.setUint32(index2 + 42, file1.offset, true)
      data2.array.set(file1.nameBuf, index2 + 46)
      data2.array.set(file1.comment, index2 + 46 + file1.nameBuf.length)
      index2 += 46 + file1.nameBuf.length + file1.comment.length
    }
    data2.view.setUint32(index2, 1347093766)
    data2.view.setUint16(index2 + 8, filenames.length, true)
    data2.view.setUint16(index2 + 10, filenames.length, true)
    data2.view.setUint32(index2 + 12, length3, true)
    data2.view.setUint32(index2 + 16, offset2, true)
    ctrl.enqueue(data2.array)
    ctrl.close()
  }
  function processNextChunk() {
    if (!activeZipObject) return
    if (activeZipObject.reader) return pump(activeZipObject)
    if (activeZipObject.fileLike.stream) {
      activeZipObject.crc = new Crc32()
      activeZipObject.reader = activeZipObject.fileLike.stream().getReader()
      activeZipObject.writeHeader()
    } else next()
  }
  return new ReadableStream({
    start: (c) => {
      ctrl = c
      underlyingSource.start && Promise.resolve(underlyingSource.start(zipWriter))
    },
    pull() {
      return processNextChunk() || underlyingSource.pull && Promise.resolve(underlyingSource.pull(zipWriter))
    }
  })
}
class Server {
  constructor (client3) {
    const scope = registration.scope.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^${scope}torrent-go\/?([a-f0-9]{40})?\/?(.*)?`)
    self.addEventListener('fetch', (evt) => {
      const url2 = evt.request.url
      const result = url2.match(regex)
      if (!result) return
      evt.respondWith((async () => {
        const [, torrentId, pathname] = result
        if (torrentId) {
          var torrent3 = client3.get(torrentId)
          await client3.add(torrentId)
          torrent3 = client3.get(torrentId)
          if (!torrent3) {
            return new Response('torrent dont exist')
          }
        } else {
          return serveIndexPage(client3)
        }
        if (pathname && pathname[0] !== '?') {
          return serveTorrentFile(torrent3, pathname, evt.request)
        } else {
          return new URL(url2).searchParams.has('dl') ? downloadHoleTorrent(torrent3) : serveTorrentIndexPage(torrent3)
        }
      })())
    })
  }
}
function getPageHTML(title, pageHtml) {
  const body = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${title}</title></head><body>${pageHtml}</body></html>`
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  })
}
function serveIndexPage(client4) {
  const torrents = client4.torrents.map((torrent4) => `<a href="${registration.scope}torrent-go/${torrent4.infoHash}">${torrent4.name}/</a>${torrent4.length.toString().padStart(87 - torrent4.name.length)}\n`
  )
  return getPageHTML('Index of /torrent-go', `<h1>Index of /</h1><hr><pre><a href="../">../</a>\n${torrents}</pre><hr>`)
}
function downloadHoleTorrent(torrent4) {
  const rs = new createWriter({
    start(ctrl) {
      torrent4.files.forEach(ctrl.enqueue, ctrl)
      ctrl.close()
    }
  })
  const filename = encodeURIComponent('sintel.zip').replace(/['()]/g, escape).replace(/\*/g, '%2A')
  return new Response(rs, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': "attachment; filename*=UTF-8''" + filename
    }
  })
}
function serveTorrentIndexPage(torrent4) {
  const list = torrent4.files.map((file1, i4) => `<a href="${registration.scope}torrent-go/${torrent4.infoHash}/${file1.path}">${file1.path}</a>${file1.length.toString().padStart(88 - file1.path.length)}\n`
  )
  return getPageHTML(`Index of /torrent-go/${torrent4.name}`, `<h1>Index of /${torrent4.name}</h1><hr><pre><a href="${registration.scope + 'torrent-go'}">../</a>\n${list.join('')}</pre><hr>`)
}
async function serveTorrentFile(torrent4, pathname, req) {
  const file1 = torrent4.files.find((file2) => file2.path === pathname
  )
  const type1 = await file1.mimetype()
  const res = {
    status: 200,
    headers: {
      'Content-Type': type1,
      'Accept-Ranges': 'bytes'
    }
  }
  let range = exports$13(file1.length, req.headers.get('range') || '')
  if (Array.isArray(range)) {
    res.status = 206
    range = range[0]
    res.headers['Content-Range'] = `bytes ${range.start}-${range.end}/${file1.length}`
    res.headers['Content-Length'] = `${range.end - range.start + 1}`
    range.end++
  } else {
    range = {
    }
    res.headers['Content-Length'] = file1.length
  }
  if (req.method === 'HEAD') return new Response('', res)
  return new Response(file1.stream(range), res)
}
const clients = []
const peers = {
}
let id3 = 0
class LightPeer {
  constructor (opts7 = {
  }) {
    this.initiator = !opts7.offer
    this.remoteAddress = this.remotePort = this.localAddress = this.onMessage = this.localPort = this.timestamp = this.sdp = this.onSignal = this.error = this._client = null
    this._queue = []
    this._mc = new self.MessageChannel()
    this._mc.port1.onmessage = (evt) => {
      Object.assign(this, evt.data)
      this.timestamp = Date.now() / 1000 | 0
      this.sdp = null
      this.onConnect && this.onConnect(this)
      this._mc.port1.onmessage = (evt1) => {
        this.onMessage(new Uint8Array(evt1.data))
      }
    }
    if (!opts7.config) opts7.config = LightPeer.config
    this._lightPeerId = id3++
    peers[this._lightPeerId] = this
    if (clients.length) {
      this._client = clients[0]
      clients[0].postMessage([
        'constructLightPeer',
        this._lightPeerId,
        opts7
      ], [
        this._mc.port2
      ])
    } else {
      console.info('No window client is avalible...')
    }
  }
  send(msg) {
    this._mc.port1.postMessage(msg)
  }
  signal(sdp) {
    this._client.postMessage([
      'signal',
      this._lightPeerId,
      sdp
    ])
  }
  destroy(err) {
    this._client && this._client.postMessage([
      'destroy',
      this._lightPeerId
    ])
    this._mc.port1.close()
    this._mc.port2.close()
    this.onDestroy && this.onDestroy(err)
    delete peers[this._lightPeerId]
    this.error = err
    this.destroyed = true
    this.remoteAddress = this.remotePort = this.localAddress = this.onMessage = this.localPort = this.timestamp = this._lightPeerId = this.sdp = this.onConnected = this.onSignal = this._client = null
  }
}
LightPeer.config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ]
}
self.addEventListener('message', (evt) => {
  const { data: data2, ports } = evt
  if (typeof data2 !== 'string' || !data2.startsWith('TorrentGoWindow')) return
  if (data2 === 'TorrentGoWindowPing') {
    return
  }
  if (data2 === 'TorrentGoWindowCreated') {
    clients.push(ports[0])
    ports[0].onmessage = ({ data: data3 }) => {
      const peer = peers[data3[1]]
      if (!peer) return
      switch (data3[0]) {
        case 'setSDP':
          peer.sdp = data3[2]
          peer.onSignal(peer)
          break
        case 'destroy':
          peer.destroy(new Error(data3[2]))
          break
      }
    }
  }
})
const VERSION2 = '1.2.5'
const VERSION_STR = VERSION2.replace(/\d*./g, (v) => `0${v % 100}`.slice(-2)
).slice(0, 4)
const VERSION_PREFIX = _text2arr(`-WW${VERSION_STR}-`)
const BitFlag = {
  POS: 0,
  DESTROYED: 1,
  READY: 2,
  ENABLE_WEB_SEEDS: 4
}
const BitEnum = {
  MAX_CONNS: 21
}
class WebTorrent extends Uint8Array {
  constructor (opts8 = {
  }) {
    const random = [
      ...Array(12)
    ].map((_) => Math.random() * 16 | 0
    )
    super([
      BitFlag.READY | BitFlag.ENABLE_WEB_SEEDS | (!!opts8.webSeeds && BitFlag.ENABLE_WEB_SEEDS),
      ...VERSION_PREFIX,
      ...random,
      0,
      55
    ])
    this.tracker = opts8.tracker || {
    }
    this.torrents = []
    this._downloadSpeed = __default()
    this._uploadSpeed = __default()
    this.peerIdBuffer = new Uint8Array(this.buffer, 1, 20)
  }
  get maxConns() {
    return this[BitEnum.MAX_CONNS] << 8 | this[BitEnum.MAX_CONNS + 1]
  }
  set maxConns(v) {
    this[BitEnum.MAX_CONNS] = v >>> 8
    this[BitEnum.MAX_CONNS + 1] = v & 255
  }
  get destroyed() {
    return !!(this[BitFlag.POS] & BitFlag.DESTROYED)
  }
  get ready() {
    return !!(this[BitFlag.POS] & BitFlag.READY)
  }
  get enableWebSeeds() {
    return !!(this[BitFlag.POS] & BitFlag.ENABLE_WEB_SEEDS)
  }
  set enableWebSeeds(v) {
    v ? this[BitFlag.POS] |= BitFlag.ENABLE_WEB_SEEDS : this[BitFlag.POS] &= ~BitFlag.ENABLE_WEB_SEEDS
  }
  get peerId() {
    return _arr2hex(this.peerIdBuffer)
  }
  get downloadSpeed() {
    return this._downloadSpeed()
  }
  get uploadSpeed() {
    return this._uploadSpeed()
  }
  get progress() {
    const torrents = this.torrents.filter((torrent4) => torrent4.progress !== 1
    )
    const downloaded = torrents.reduce((total, torrent4) => total + torrent4.downloaded
      , 0)
    const length3 = torrents.reduce((total, torrent4) => total + (torrent4.length || 0)
      , 0) || 1
    return downloaded / length3
  }
  get ratio() {
    const uploaded = this.torrents.reduce((total, torrent4) => total + torrent4.uploaded
      , 0)
    const received = this.torrents.reduce((total, torrent4) => total + torrent4.received
      , 0) || 1
    return uploaded / received
  }
  createServer() {
    return new Server(this)
  }
  get(torrentId) {
    if (torrentId instanceof Torrent) {
      if (this.torrents.includes(torrentId)) return torrentId
    } else {
      if (typeof torrentId === 'object' && typeof torrentId.infoHash === 'string') {
        torrentId = torrentId.infoHash
      }
      for (const torrent4 of this.torrents) {
        if (torrent4.infoHash === torrentId) return torrent4
      }
    }
    return null
  }
  async add(torrentId, opts = {
  }) {
    if (this[BitFlag.POS] & BitFlag.DESTROYED) {
      throw new Error('client is destroyed')
    }
    opts = Object.assign({
    }, opts)
    const parsedTorrent2 = await parseTorrent(torrentId)
    if (this[BitFlag.POS] & BitFlag.DESTROYED) return
    for (const t of this.torrents) {
      if (t.infoHash === parsedTorrent2.infoHash) {
        if (!t.ready) {
          await new Promise((resolve) => torrent5.once('ready', resolve)
          )
        }
        return t
      }
    }
    const torrent5 = new Torrent(parsedTorrent2, this, opts)
    this.torrents.push(torrent5)
    await new Promise((resolve) => torrent5.once('ready', resolve)
    )
    return torrent5
  }
  async seed(input, opts) {
    if (this[BitFlag.POS] & BitFlag.DESTROYED) {
      throw new Error('client is destroyed')
    }
    opts = opts ? Object.assign({
    }, opts) : {
    }
    if (!opts.createdBy) opts.createdBy = `Torrent Go/${VERSION_STR}`
    if (isFileList(input)) input = Array.from(input)
    else if (!Array.isArray(input)) input = [
      input
    ]
    const torrentBuf = await createTorrent(input, opts)
    const torrent5 = await this.add(torrentBuf, opts)
    return torrent5
  }
  remove(torrentId) {
    const torrent5 = this.get(torrentId)
    if (!torrent5) throw new Error(`No torrent with id ${torrentId}`)
    this.torrents.splice(this.torrents.indexOf(torrent5), 1)
    return torrent5.destroy()
  }
  destroy() {
    this[BitFlag.POS] |= BitFlag.DESTROYED
    this.torrents.forEach((t) => t.destroy()
    )
    this.torrents = []
  }
}
function isFileList(obj) {
  return typeof FileList !== 'undefined' && obj instanceof FileList
}
WebTorrent.VERSION = VERSION2
WebTorrent.LightPeer = LightPeer
export { WebTorrent as default }

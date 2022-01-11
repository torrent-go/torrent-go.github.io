importScripts('js/sw-toolbox.js')
importScripts('js/scope.js')
importScripts('js/shimport.js')

const SEPARATOR = '\u2502'; function repeatString(b, a) { return (a || ' ').repeat(b) } function getFormattedString(b, a) { if (!a) { if (typeof b === 'string') return '' + b; if (typeof b === 'function') return 'function' } return b + '' }
function printRows(b) {
  if (b.length) {
    let a; let c; let e = 0; let d = b[0].length; for (c = 0; c < d; c++) { for (a = maxLengthForColumn = 0; a < b.length; a++)maxLengthForColumn = Math.max(getFormattedString(b[a][c], !a || !c).length, maxLengthForColumn); maxLengthForColumn += 2; e += maxLengthForColumn + 1; for (a = 0; a < b.length; a++) { var g = maxLengthForColumn - getFormattedString(b[a][c], !a || !c).length; b[a][c] = ' ' + b[a][c] + repeatString(g - 1) } } e += 0; const f = []; f.push(repeatString(e, '=')); for (a = 0; a < b.length; a++) {
      g = b[a]; d = ''; for (c = 0; c < g.length; c++)d += g[c] + SEPARATOR
      f.push(d); a || f.push(repeatString(e, '-'))
    } f.push(repeatString(e, '=')); return f.join('\n')
  }
}
function printTable(b, a) { let c; const e = []; if (typeof b !== 'object') return b; if (!(b instanceof Array)) { var d = []; var g = Object.keys(b); for (c in b) d.push(b[c]); b = d } a || (a = Object.keys(b[0])); e.push([]); let f = e[e.length - 1]; f.push('#'); for (d = 0; d < a.length; d++)f.push(a[d]); for (c = 0; c < b.length; c++) { const h = b[c]; e.push([]); f = e[e.length - 1]; f.push(g ? g[c] : c); for (d = 0; d < a.length; d++)f.push(h[a[d]]) } return printRows(e) };


const { href } = new URL('path/to/my/module.js', location.href)
__shimport__.load('/js/torrent-go.debug.js').then(({ default: TorrentGo }) => {
  const magnet = 'https://webtorrent.io/torrents/sintel.torrent'
  // const magnet = '08ada5a7a6183aae1e09d831df6748d566095a10'
  const trackers = globalThis.WEBTORRENT_ANNOUNCE = [
    // 'wss://tracker.btorrent.xyz',
    // 'wss://tracker.fastcast.nz',
    'wss://tracker.openwebtorrent.com'
  ]

  const rtcConfig = {
    comment: 'WARNING: This is *NOT* a public endpoint. Do not depend on it in your app',
    iceServers: [
      {
        urls: 'stun:global.stun.twilio.com:3478?transport=udp'
      },
      {
        username: '6c61cdc34f105f6193b6e5bfed85f9d92d891fd526d5b0405c82c0888bc08e13',
        credential: 'idVVNa57DqOHoaHKPDyBVynz+UgRsX1bcDki9ONhHDc=',
        urls: 'turn:global.turn.twilio.com:3478?transport=udp'
      },
      {
        username: '6c61cdc34f105f6193b6e5bfed85f9d92d891fd526d5b0405c82c0888bc08e13',
        credential: 'idVVNa57DqOHoaHKPDyBVynz+UgRsX1bcDki9ONhHDc=',
        urls: 'turn:global.turn.twilio.com:3478?transport=tcp'
      },
      {
        username: '6c61cdc34f105f6193b6e5bfed85f9d92d891fd526d5b0405c82c0888bc08e13',
        credential: 'idVVNa57DqOHoaHKPDyBVynz+UgRsX1bcDki9ONhHDc=',
        urls: 'turn:global.turn.twilio.com:443?transport=tcp'
      }
    ]
  }

  const trackerOpts = { rtcConfig: rtcConfig, announce: trackers }

  const client = new TorrentGo({
    tracker: trackerOpts
  })
  client.enableWebSeeds = true
  client.createServer()

  client.add(magnet, { x_strategy: 'rarest', announce: trackers }).then(ontorrent)

  function ontorrent(torrent) {
    globalThis.torrent = torrent
    const start = performance.now()
    let end

    const hex2binary = hex => {
      for (var string = '', i = 0, l = hex.length; i < l; i += 2) {
        string += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
      }

      return string
    }

    function update() {
      const cycle = Date.now()
      const mem = performance.memory || { jsHeapSizeLimit: 0, totalJSHeapSize: 0, usedJSHeapSize: 0 }
      const outOff = mem.jsHeapSizeLimit
      const value = mem.totalJSHeapSize
      const perc = (value * 100) / outOff
      const pl = torrent.pieces.length
      const a = 0
      const b = 0
      const buf = 0

      // console.log(self.a, self.buf)
      const peers = Object.keys(torrent._peers).map(id => {
        const peer = torrent._peers[id]
        const wire = peer.wire || { uploaded: 0, downloaded: 0 }
        let pieces = 0
        let requests = ''
        let connTime = 0
        if (peer.wire) {
          pieces = peer.wire.peerPieces.have
          if (peer.conn.timestamp) connTime = ((cycle / 1000) | 0) - peer.conn.timestamp
          requests = JSON.stringify([...new Set(peer.wire.requests.map(e => e.piece))])
        }
        progress = pieces / torrent.pieces.length
        if (pieces && pieces !== torrent.pieces.length) progress = progress.toFixed(6)

        const { iceConnectionState, _channnel } = (peer.conn._pc || {})

        return {
          'remote ip': `${peer.conn.remoteAddress || ''}:${peer.conn.remotePort || ''}`,
          'local ip': `${peer.conn.localAddress || ''}:${peer.conn.localPort || ''}`,
          client: /^2d.{12}2d/.test(id) ? hex2binary(id.slice(2, 14)) : 'unknown',
          'peer id': /^2d.{12}2d/.test(id) ? ('...' + peer.id.slice(16)) : peer.id,
          '↑ mb': (wire.uploaded / 1000 / 1000).toFixed(1),
          '↓ mb': (wire.downloaded / 1000 / 1000).toFixed(1),
          initiator: peer.conn.initiator ? 'true' : 'false',
          '↓ kb/s': (peer.wire && peer.wire.downloadSpeed() / 1000 || 0).toFixed(0),
          '↑ kb/s': (peer.wire && peer.wire.uploadSpeed() / 1000 || 0).toFixed(0),
          // "buffered": peer.conn._channel && peer.conn._channel.bufferedAmount || 0,
          pieces,
          progress,
          requests: peer.wire && peer.wire.requests && peer.wire.requests.length || 0,
          isSeeder: !!(peer.wire && peer.wire.isSeeder),
          'ice state': iceConnectionState,
          connected: connTime + ' sec'
        }
      })

      const e = '\n'.repeat(100) +
        '\n\nMEMORY USAGE:\n' +
        printTable([{
          'totalJSHeapSize                  ': `(${mem.totalJSHeapSize / 1024 / 1024 | 0} MiB) (${mem.totalJSHeapSize / 1024 | 0} KiB) ${mem.totalJSHeapSize} b`,
          'usedJSHeapSize                    ': `(${mem.usedJSHeapSize / 1024 / 1024 | 0} MiB) (${mem.usedJSHeapSize / 1024 | 0} KiB) ${mem.usedJSHeapSize} b`,
          'jsHeapSizeLimit                           ': `(${mem.jsHeapSizeLimit / 1024 / 1024 | 0} MiB) (${mem.jsHeapSizeLimit / 1024 | 0} KiB) ${mem.jsHeapSizeLimit} b`,
          used: perc.toFixed(2) + '%'
        }]) +
        '\n\nTORRENT:\n' +
        printTable([{
          Torrent: torrent.name,
          Peers: Object.keys(torrent._peers).length,
          Progress: torrent.progress.toFixed(2),
          'Download speed': `${(torrent.downloadSpeed / 1000).toFixed(0)} kb/s`,
          'Upload speed': `${(torrent.uploadSpeed / 1000).toFixed(0)} kb/s`,
          Uploaded: `${(torrent.uploaded / 1000 / 1000).toFixed(2)} mb`,
          Downloaded: `${(torrent.downloaded / 1000 / 1000).toFixed(2)} mb`,
          TimeRemaining: `${((torrent.timeRemaining / 1000)).toFixed(0)} sec`,
          elapsed: `${((performance.now() - start) / 1000).toFixed(0)} sec`,
          'Completed In': `${end ? ((end - start) / 1000).toFixed(0) : '--'} sec`
        }]) +
        '\n\nPEERS:\n' +
        (peers.length && printTable(peers) || '')
        ; console.log(e)
    }

    update()
    setInterval(update, 1000)

    torrent.on('done', () => {
      end = performance.now()
      update()
    })
  }


})

/******************************************************
  install event
*******************************************************/
toolbox.precache([
  'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/css/material.min.css',
  '/css/main.css'
])

const { router } = toolbox

function fetchAndStore(req) {
  return toolbox.fastest(new Request(req))
}

/******************************************************
  Routing
*******************************************************/

// Home page
router.get('/', async (request, values) => {
  const template = await fetchAndStore('/views/index.html').then(r => r.text())
  const headers = { 'Content-Type': 'text/html' }

  return new Response(new Scope('Torrent GO', template), { headers })
})

// Todo page
router.get('/docs', async (request, values) => {
  const template = await fetchAndStore(`/views/docs.html`).then(r => r.text())
  const headers = { 'Content-Type': 'text/html' }

  return new Response(new Scope('Todos', template), { headers })
})

// Fallback route
router.default = toolbox.cacheFirst
/*
router.default = request => {
  const url = new URL(request.url)

  if (request.url.startsWith(self.registration.scope)) {
    return toolbox.fastest(request)
  }

  if (request.headers.get('accept').includes('image')) {
    return toolbox.cacheFirst(request)
  }

  return fetch(url, request)
}
*/

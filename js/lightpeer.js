// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// @language_out ECMASCRIPT_NEXT
// ==/ClosureCompiler==

const peers = {}
const MAX_BUFFERED_AMOUNT = 64 * 1024
const buffer = new Uint8Array(MAX_BUFFERED_AMOUNT)

class LightPeer {
  constructor (opts, id, port) {
    this._pc = new RTCPeerConnection(opts['config'])
    this._port = port
    this._evtLoopTimer =
      this._dc = null
    this._lightPeerId = id
    this._connected = false
    this._destroyed = false
    this._bucket = [] // holds messages until ipadress have been found
    this._queue = []
    this._bulkSend = this._bulkSending.bind(this)
    this._port['onmessage'] = evt => {
      this._send(evt.data)
    }
    // (sometimes gets retriggerd by ondatachannel)
    this._pc.oniceconnectionstatechange = () => {
      switch (this._pc.iceConnectionState) {
        case 'connected':
          this._dc && this._dc.readyState === 'open' && this._pc.getStats().then(items => this._onceStats(items))
          break
        case 'disconnected':
          this._destroy('Ice connection disconnected.')
          break
        case 'failed':
          this._destroy('Ice connection failed.')
          break
        default:
      }
    }

    if (!opts['offer']) {
      this._createSDP()
    } else {
      this._setSDP(opts['offer'])
    }
  }

  _bulkSending() {
    const dc = this._dc
    if (this._destroyed) return
    if (dc.readyState === 'closing') return this._destroy('closing')
    const chunks = this._queue

    if (chunks.length === 1) {
      dc.send(chunks[0])
      this._evtLoopTimer = this._queue = null
      return
    }

    let offset = 0
    let merged = []
    for (let i = 0, l = chunks.length; i < l; i++) {
      const chunk = chunks[i]
      if (chunk.length + offset >= buffer.length) {
        // Send many small messages as one
        if (offset) {
          dc.send(buffer.subarray(0, offset))
          offset = 0
          merged = []
        } else {
          dc.send(chunk)
          continue
        }
      }
      merged.push(chunk.length)
      buffer.set(chunk, offset)
      offset += chunk.length
    }

    dc.send(buffer.subarray(0, offset))

    this._evtLoopTimer = this._queue = null
  }

  _send(chunk) {
    if (!window.requestIdleCallback) {
      const channel = this._dc
      if (this._destroyed) return
      if (channel.readyState === 'closing') return this._destroy('closing')

      channel.send(chunk)
      return
    }

    if (this._evtLoopTimer) {
      this._queue.push(chunk)
    } else {
      this._queue = [chunk]
      this._evtLoopTimer = window.requestIdleCallback(this._bulkSend)
    }
  }

  _onceStats(items) {
    let selected
    if (this._connected) return
    this._connected = true

    items.forEach(item => {
      // Spec-compliant
      if (item['type'] === 'transport' && item['selectedCandidatePairId']) {
        selected = items.get(item['selectedCandidatePairId'])
      }

      // Old implementations
      if (!selected && item['type'] === 'candidate-pair' && (item['selected'] || item['nominated'])) {
        selected = item
      }
    })

    const local = items.get(selected['localCandidateId']) || {}
    const remote = items.get(selected['remoteCandidateId']) || {}

    this._port.postMessage({
      'localAddress': local['ip'] || local['address'] || local['ipAddress'],
      'localPort': local['port'] || local['portNumber'],
      'remoteAddress': remote['ip'] || remote['address'] || remote['ipAddress'],
      'remotePort': remote['port'] || remote['portNumber']
    })

    this._bucket.forEach(data => {
      this._port.postMessage(data, [data])
    })

    this._bucket = null
  }

  _setupData() {
    const dc = this._dc

    if (!dc) return
    dc.onopen = () => {
      dc.onopen = null
      this._pc.getStats().then(items => this._onceStats(items))
    }

    dc.binaryType = 'arraybuffer'

    dc.onmessage = ({ data }) => {
      this._connected
        ? this._port.postMessage(data, [data])
        : this._bucket.push(data)
    }
  }

  async _setSDP(sdp) {
    if (this._destroyed) console.log('cant do this when its closed')
    const pc = this._pc
    await pc.setRemoteDescription(sdp)
    pc.ondatachannel = null

    if (!pc.localDescription) {
      const iceGathering = new Promise(resolve => {
        pc.onicecandidate = evt => {
          !evt.candidate && resolve(pc.onicecandidate = null)
        }
      })

      const desc = await pc.createAnswer()
      desc.sdp = desc.sdp.replace(/a=ice-options:trickle\s\n/g, '')
      await pc.setLocalDescription(desc)
      await iceGathering
      pc.ondatachannel = evt => {
        this._dc = evt.channel
        this._setupData()
        pc.oniceconnectionstatechange()
      }
    }

    sdp.type === 'offer' && mc.port1.postMessage([
      'setSDP',
      this._lightPeerId,
      pc.localDescription.toJSON()
    ])
  }

  async _createSDP() {
    const pc = this._pc

    if (!this._dc) {
      this._dc = pc.createDataChannel('')
      this._setupData()
    }

    const desc = await pc.createOffer()

    // remove trickle
    desc.sdp = desc.sdp.replace(/a=ice-options:trickle\s\n/g, '')

    // trickle ice
    const iceGathering = new Promise(resolve => {
      pc.onicecandidate = evt => {
        !evt.candidate && resolve(pc.onicecandidate = null)
      }
    })

    await pc.setLocalDescription(desc)
    await iceGathering

    mc.port1.postMessage([
      'setSDP',
      this._lightPeerId,
      pc.localDescription.toJSON()
    ])
  }

  _signal(sdp) {
    this._setSDP(sdp)
  }

  _destroy(err, notifyWorker = 1) {
    if (this._destroyed) return
    this._destroyed = true

    // this.error = err || null
    // this._debug('destroy (error: %s)', err && (err.message || err))
    const channel = this._dc
    const pc = this._pc

    delete peers[this._lightPeerId]

    // Cleanup DataChannel
    if (channel) {
      channel.onclose = null
      channel.onerror = null
      channel.onmessage = null
      channel.onopen = null
      if (channel.readyState !== 'closed') channel.close()
    }

    // Cleanup RTCPeerConnection
    if (pc) {
      pc.ondatachannel = null
      pc.onicecandidate = null
      pc.oniceconnectionstatechange = null
      pc.onicegatheringstatechange = null
      pc.onsignalingstatechange = null
      if (pc.iceConnectionState === 'new') false && console.log(new Error('dont close this'))
      pc.close()
    }

    // Cleanup local variables
    this._channelReady =
      this._pcReady =
      this._connected =
      this._dc =
      this._port =
      this._port.onmessage =
      this._pc = null

    notifyWorker && mc.port1.postMessage(['destroy', this._lightPeerId, err])
  }
}

const mc = new MessageChannel()

mc.port1.onmessage = evt => {
  const { data, ports } = evt

  switch (data[0]) {
    case 'constructLightPeer':
      peers[data[1]] = new LightPeer(data[2], data[1], ports[0])
      break
    case 'signal':
      peers[data[1]]._signal(data[2])
      break
    case 'destroy':
      peers[data[1]] && peers[data[1]]._destroy(data[2], 0)
      break
  }
}

navigator.serviceWorker.getRegistration('./').then(swReg => {
  return swReg || navigator.serviceWorker.register('sw.js', { scope: './' })
}).then(swReg => {
  const swRegTmp = swReg.installing || swReg.waiting

  setTimeout(() => {
    vid.src = '/torrent-go/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel/Sintel.mp4'
    vid.play()
  }, 2000)

  window.addEventListener('beforeunload', function (event) {
    mc.port1.postMessage('TorrentGoWindowClosed')
  })

  setInterval(() => {
    swReg.active.postMessage('TorrentGoWindowPing')
  }, 10000)

  if (swReg.active) {
    swReg.active.postMessage('TorrentGoWindowCreated', [mc.port2])
    return
  }

  swRegTmp.onstatechange = () => {
    if (swRegTmp.state === 'activated') {
      swRegTmp.onstatechange = null
      swReg.active.postMessage('TorrentGoWindowCreated', [mc.port2])
    }
  }
})

// self.postMessage('TorrentGoWindowCreated', [mc.port2])

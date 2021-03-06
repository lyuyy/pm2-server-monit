'use strict'

const os = require('os')

module.exports = class MemoryMetric {
  constructor (io, conf) {
    this.io = io
    this.conf = conf
    this.freeMemory = io.metric({
      name: 'Free memory',
      type: 'os/memory/usage/free',
      unit: '%'
    })
    this.usedMemory = io.metric({
      name: 'Used memory',
      type: 'os/memory/usage/used',
      unit: 'GB'
    })
    this.totalMemory = io.metric({
      name: 'Total memory',
      type: 'os/memory/usage/total',
      unit: 'GB'
    })
    this.refreshInterval = parseInt(conf.memory_refresh_rate) || 2

    this._worker = setInterval(this.fetch.bind(this), this.refreshInterval * 1000)
    this.fetch()
  }

  fetch () {
    const total = os.totalmem()
    const free = os.freemem()
    const used = total - free

    const freePercent = ((free / total) * 100).toFixed(2)
    const usedGB = (used / 1000 / 1000 / 1000).toFixed(2) // in GB
    const totalGB = (total / 1000 / 1000 / 1000).toFixed(2) // in GB
    this.totalMemory.set(totalGB)
    this.usedMemory.set(usedGB)
    this.freeMemory.set(freePercent)
  }
}

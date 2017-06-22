'use babel'

import { CompositeDisposable } from 'atom'
import { writeLessVariable } from './config'
import { join } from 'path'

const config = require('./config.json')
const pack = require('../package.json')
let subscriptions

export default {
  config,
  initialize: () => {
    subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.workspace.addOpener(url => url.startsWith('state:') ? document.createElement('div') : null),
    )
  },
  activate: () => {
    console.info(this)
    let { path } = atom.packages.getLoadedPackage(pack.name)
    let fp = join(path, 'styles', 'conf.less')
    let fn = conf => writeLessVariable(fp, conf)
    let configChange = atom.config.observe(pack.name, fn)
    console.info(path, fp, fn, configChange)
    subscriptions.add(configChange)
  },
  deactivate: () => {
    subscriptions.dispose()
  },
}

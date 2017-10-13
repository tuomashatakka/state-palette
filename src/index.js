'use babel'

import { join } from 'path'
import { CompositeDisposable } from 'atom'
import { writeLessVariable } from './config'
import { observeIconSelectionFields } from './icon-picker'

let subscriptions

export { consumeFileIcons } from './icon-picker'

export const config = require('./config.json')

export const pack = require('../package.json')

const CONF_PATH = join(__dirname, '..', 'styles', 'conf.less')

const opener = url => url.startsWith('state:') ? document.createElement('div') : null

function assertConf () {
  const { existsSync, writeFileSync } = require('fs')
  if (!existsSync(CONF_PATH))
    writeFileSync(CONF_PATH)
}

export function initialize () {
  assertConf()
  subscriptions = new CompositeDisposable()
  subscriptions.add(atom.workspace.addOpener(opener))
}

export function activate () {
  let fn = conf => writeLessVariable(CONF_PATH, conf)
  let listener = observeIconSelectionFields()
  let configChange = atom.config.observe(pack.name, fn)
  subscriptions.add(configChange, listener)
}

export function deactivate () {
  subscriptions.dispose()
}

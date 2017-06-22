'use babel'

import Browser from './escape-navigator'
import { CompositeDisposable, Disposable } from 'atom'
import { writeLessVariable } from './config'
import { join } from 'path'

const config = require('./config.json')
const pack = require('../package.json')
const CONF_PATH = join(__dirname, '..', 'styles', 'conf.less')
let subscriptions

function assertConf () {
  const { existsSync, writeFileSync } = require('fs')
  if (!existsSync(CONF_PATH))
    writeFileSync(CONF_PATH)
}

function observeIconSelectionFields () {
  let views = document.querySelectorAll('.item-views')
  let subscriptions = new CompositeDisposable()

  let callback = (e) => {
    let element = e.path.find(el => ['INPUT', 'LABEL', 'ATOM-TEXT-EDITOR'].indexOf(el.tagName))
    // console.info("element", element)
    // console.log("path   ", ...e.path)
    // console.log("event  ", e)
    if (!element)
      return
    // console.info(element, e)
  }

  views.forEach(view => {
    let bind   = () => view.addEventListener('mousedown', callback)
    let unbind = () => view.removeEventListener('mousedown', callback)
    subscriptions.add(new Disposable(unbind))
    bind()
  })
  return subscriptions
}

export default {

  config,

  initialize: () => {

    assertConf()
    subscriptions = new CompositeDisposable()
    subscriptions.add(
      atom.workspace.addOpener(url => url.startsWith('state:') ? document.createElement('div') : null))
  },

  activate: () => {

    let fn = conf => writeLessVariable(CONF_PATH, conf)
    let explorer = () => (new Browser()).open()
    let listener = observeIconSelectionFields()
    let configChange = atom.config.observe(pack.name, fn)
    let openExplorer = atom.commands.add('atom-workspace', 'application:open-file-browser', explorer)
    subscriptions.add(configChange, listener, openExplorer)
  },

  deactivate: () => {
    subscriptions.dispose()
  },
}

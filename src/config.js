'use babel'

import filesystem from 'fs'
import { extname } from 'path'
import { getBase64FromImageUrl } from './utils'

async function resolveValue (val) {
  if (!val)
    val = ''
  else if (val.toJSON)
    val = val.toJSON()
  else if (val.toJS)
    val = val.toJS()
  else if (val.toString)
    val = val.toString()

  if (val.search('/') > -1) {
    let ext = extname(val)
    try {
      let data = await getBase64FromImageUrl(val)
      val = `url("data:image/${ext};base64,${data}")`
    }
    catch (data) {
      val = `"${data}"`
    }
  }
  else if(!val.startsWith('#'))
    val = `url('atom://stateful/icons/triniti/${val}.svg')`
  return val
}

function prefix (key) {
  let space
  key.unshift('stateful')
  key = key.join('-')
  space = Array(30-key.length).join(' ')
  return `@${key}:${space}`
}

function applyCss (path) {
  let { themes } = atom
  let src = themes.loadLessStylesheet(path)
  themes.applyStylesheet(path, src, 5)
  themes.refreshLessCache()
  return src
}

export async function writeLessVariable (fp, config={}) {

  async function print (val, ...key) {
    let value = await resolveValue(val)
    return `${prefix(key)}${value};`
  }

  async function iterate (cat) {
    let promises = Object
      .keys(config[cat] || {})
      .map(key => print(config[cat][key], cat, key))

    return Promise
      .all(promises)
  }

  let stream = [].concat(
    await iterate('color'),
    await iterate('icon'))

  whenResolved(stream.join("\n"))
  function whenResolved (stream) {
    console.info(`Writing the less config
      to path ${fp}\n---------------------------------\n${stream}`)
    try {
      filesystem.writeFile(fp, stream + '\n', 'utf8', err => err ?
        error(err, "Writing less variables to a file failed") :
        applyCss(fp))
    }
    catch(e) {
      error(e, "Writing less variable failed") }

  }
}

export function error (e, ...msg) {


  let { name } = require('../package.json')
  let title = `${name} Package Error`
  let description = msg.reduce((str, message) => str + `<p>${message}</p>`, `<h4>${e.message}</h4>`)
  let buttons = {
    'Open developer tools': () => atom.openDevTools() }

  if (atom.devMode)
    // eslint-disable-next-line
    console.warn(`${name}: ${e}`)

  atom.notifications.addError(title, {
    description,
    dismissable: true,
    buttons: Object.keys(buttons).map(text => ({ text, onDidClick: () => buttons[text]() }))
  })
}

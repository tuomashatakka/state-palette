'use babel'

import filesystem from 'fs'

function resolveValue (val) {
  if (!val)
    return ''
  if (val.toJSON)
    return val.toJSON()
  if (val.toJS)
    return val.toJS()
  if (val.toString)
    return val.toString()
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

export function writeLessVariable (fp, config={}) {

  console.warn("ARGUMENTS PASSED TO writeLessVariable", arguments)

  const print = (val, ...key) => `${prefix(key)}${resolveValue(val)};`
  const iterate = cat => Object
    .keys(config[cat] || {})
    .map(key => print(config[cat][key], cat, key))
    .join('\n')
  let stream = [ 
    iterate('icon'),
    iterate('color'),
  ].join('\n')

  console.info(`Writing the less config
    to path ${fp}
    ----------------
    ${stream}`)
  try {
    filesystem.writeFile(fp, stream + '\n', 'utf8', err => err ?
      error(err, "Writing less variables to a file failed") :
      applyCss(fp))
  }
  catch(e) {
    error(e, "Writing less variable failed") }

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

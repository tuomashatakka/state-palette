'use babel'

import filesystem from 'fs'
import { sep } from 'path'
import { ASSETS_PATH, getBase64FromImageUrl, prefix, error } from './utils'

async function resolveValue (val) {

  // Handle basic types
  if (!val)
    val = ''
  else if (val.toJSON)
    val = val.toJSON()
  else if (val.toJS)
    val = val.toJS()
  else if (val.toString)
    val = val.toString()

  // Handle file paths
  console.warn("Resolving", { val, sep })
  if (val.search(new RegExp(`\\${sep}`)) > -1) {
    try {
      let data = await getBase64FromImageUrl(val)
      val = `url("${data}")`
    }
    catch (data) {
      val = `"${data}"`
    }
  }
  else if(!val.startsWith('#')) {
    let { name } = require('../package.json')
    let assets   = ASSETS_PATH

    val = `url('atom://${name}/${assets}/${val}.svg')`
  }
  console.warn("Resolved", { val })

  return val
}

function reloadStylesheet (path) {
  let { themes } = atom
  let styleEntry = __dirname + '/../styles/index.less'
  let src        = themes.loadLessStylesheet(styleEntry)

  themes.applyStylesheet(path, src, 5)
  themes.refreshLessCache()
  return src
}

function applyCss (path, content) {

  if (atom.devMode)
    // eslint-disable-next-line
    console.info(`Writing the less config to\npath ${path}\n---------------------------------\n\n${content}\n\n`)

  let raise = (err) =>
    error(err, `Writing less variables to a file ${path} failed`)

  try {
    content = content + '\n'
    filesystem.writeFile(
      path, content, 'utf8', err =>
      err ? raise(err) : reloadStylesheet(path)) }

  catch(e) {
    raise(e) }

}

export async function writeLessVariable (fp, config={}) {

  async function print (val, ...key) {
    let { name } = require('../package.json')
    let value = await resolveValue(val)
    let keyPath = [ name, ...key ]
    let pre = prefix({ keyPath })
    return `${pre}${value};`
  }

  async function iterate (cat) {
    let promises = Object
      .keys(config[cat] || {})
      .map(key => print(config[cat][key], cat, key))

    return Promise
      .all(promises)
  }

  let stream = []
    .concat(
      await iterate('color'),
      await iterate('icon'),
      await iterate('general')
    )
    .join("\n")

  return applyCss(fp, stream)
}

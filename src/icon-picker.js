'use babel'

import { CompositeDisposable, Disposable } from 'atom'
import { resolve, dirname } from 'path'
import { FileIcons } from 'file-explorer'
import FileExplorer from 'file-explorer'


const pack = require('../package.json')

let fileExplorer



export function consumeFileIcons (service) {

  const update = () => getFileExplorer()//.reload()

  FileIcons.setService(service)
  update()

  return new Disposable(() => {
    FileIcons.resetService()
    update()
  })
}



export function resolvePath (path=null) {
  let item = atom.workspace.getActivePaneItem()
  let projectPaths = atom.project.getPaths()

  if (!path && item && item.getPath)
    path = item.getPath()

  else if (!path && projectPaths)
    path = projectPaths.length ? projectPaths[0] : '.'

  else
    path = '~'

  return resolve(dirname(path))
}



export function openFile (uri) {
  return atom.workspace.openURIInPane(uri)
}



export function openFileExplorer () {
  let path = resolvePath()
  return getFileExplorer().open(path)
}



export function getFileExplorer () {
  if (!fileExplorer) {
    let path = resolvePath()
    fileExplorer = new FileExplorer({ path })
  }
  // console.log(fileExplorer)
  return fileExplorer
}



export function observeIconSelectionFields () {
  let views = document.querySelectorAll('.item-views')
  let subscriptions = new CompositeDisposable()

  let setText = (element, path) => element.getModel ?
    element.getModel().setText(path) :
    element.value = path

  let callback = (e) => {
    let element = e.path.find(el => ['INPUT', 'LABEL', 'ATOM-TEXT-EDITOR'].indexOf(el.tagName) !== -1)
    // console.info("element", element)
    // console.log("path   ", ...e.path)
    // console.log("event  ", e)
    if (!element)
      return
    let id = element.getAttribute('id') || ''
    if (!id || !id.startsWith(`${pack.name}.icon`))
      return

    getFileExplorer()
      .requestFile({})
      .then(path => {
        // console.info(path)
        // console.info(element)
        // console.info(setText)
        setText(element, path)
      })
      // .catch(e => alert(e.message || e))
  }

  views.forEach(view => {
    let bind   = () => view.addEventListener('mousedown', callback)
    let unbind = () => view.removeEventListener('mousedown', callback)
    subscriptions.add(new Disposable(unbind))
    bind()
  })
  return subscriptions
}

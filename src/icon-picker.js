'use babel'

import { CompositeDisposable, Disposable } from 'atom'
import { resolve, dirname } from 'path'
import { FileIcons } from 'file-explorer'
import browser from 'file-explorer'


const pack = require('../package.json')

export function consumeFileIcons (service) {

  const update = () => {
    // getFileExplorer()
  }//.reload()

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



// export function openFileExplorer () {
//   let path = resolvePath()
//   return browser.open(path)
// }
//
//
//
// export function getFileExplorer () {
//   browser.open()
//   return browser
// }



export function observeIconSelectionFields () {

  let views = document.querySelectorAll('.item-views')
  let subscriptions = new CompositeDisposable()
  let setText = (element, path) => element.getModel ?
    element.getModel().setText(path) :
    element.value = path

  let callback = async (e) => {
    let element = e.path.find(el => ['INPUT', 'LABEL', 'ATOM-TEXT-EDITOR'].indexOf(el.tagName) !== -1)
    let id = element && element.getAttribute('id') || ''
    if (!(element && id && id.startsWith(`${pack.name}.icon`)))
      return

    browser.requestFile()
      .then(setText.bind(null, element))
      .catch(err => atom.notifications.addError(`Error in file browser's callback (${err})`))
  }

  views.forEach(view => {
    let bind   = () => view.addEventListener('mousedown', callback)
    let unbind = () => view.removeEventListener('mousedown', callback)
    subscriptions.add(new Disposable(unbind))
    bind()
  })

  return subscriptions
}

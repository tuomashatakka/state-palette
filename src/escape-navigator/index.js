'use babel'

import React from 'react'
import prop from 'prop-types'
import App from './App'
import css, { modalCss } from './style'
import { resolve, dirname } from 'path'
import { render } from 'react-dom'
import { readdirSync, statSync } from 'fs'
import { Emitter } from 'atom'

class FileExplorerView {

  static get viewClass () { return App }

  constructor ({ model }) {

    this.element = document.createElement('div')
    this.element.setAttribute('style', ` max-height: 100%; overflow: auto; `)
    this.__defineGetter__('model', () => model)
    this.__defineGetter__('viewClass', () => this.constructor.viewClass)

    atom.styles.addStyleSheet(css)
    model.onPathChanged(() => this.render(this.viewClass))
  }

  get panel () {
    if (this._panel)
      return this._panel
    this._panel = atom.workspace.addModalPanel({
      item: this.element,
    })

    this.render(this.viewClass)
    return this._panel
  }

  show () {
    let view = atom.views.getView(this.panel)
    view.classList.toggle('hidden', false)
    view.setAttribute('style', modalCss)
  }

  hide () {
    atom.views.getView(this.panel).classList.toggle('hidden', true)
  }

  render (View) {
    this.__component = render(
      <View
        close={() => this.hide()}
        open={() => this.show()}
        model={this.model}
      />,
      this.element)
  }
}



export default class FileExplorer extends Emitter {

  constructor (path=null) {

    super()

    let item = atom.workspace.getActivePaneItem()
    let projectPaths = atom.project.getPaths()

    if (!path && item)
      path = item.getPath()
    else if (!path)
      path = projectPaths.length ? projectPaths[0] : '.'

    this.view = new FileExplorerView({ model: this })
    this.open(resolve(dirname(path)))
  }

  onPathChanged = (callback) => this.on('path-changed', callback.bind(this))

  open (path='.') {
    this.path = path
    this.view.show()
  }

  close () {
    this.view.hide()
    this._path = '/'
  }

  openFile (uri, close=true) {
    if (close === true)
      this.close()
    return atom.workspace.openURIInPane(uri)
  }

  get directories () {
    return this.getAbsoluteList().filter(item => statSync(item).isDirectory())
  }

  get files () {
    return this.getAbsoluteList().filter(item => statSync(item).isFile())
  }

  getAbsoluteList () {
    return this.list.map(path => resolve(this._path, path))
  }

  get list () { return this.ls }
  get ls () { return readdirSync(this._path) }
  get path () { return this._path }
  set path (path='.') {
    this._path = resolve(this._path, path)
    this.emit('path-changed', this._path)
  }

}

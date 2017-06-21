'use babel'


export default {
  initialize: () => {
    this.opener = atom.workspace.addOpener(url => url.startsWith('state:') ? document.createElement('div') : null)
    console.info(this.opener, this)
  },
  activate: () => {},
  deactivate: () => {
    this.opener.dispose()
  },
}

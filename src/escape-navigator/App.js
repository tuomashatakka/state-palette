'use babel'

import React from 'react'
import prop from 'prop-types'
import DirectoryView from './DirectoryView'
import { basename } from 'path'
import { DirectoryIcon, FileIcon } from './ListItem'

const App = ({ model, close }) => {

  let directories = model.directories.map(path => ({
    path,
    type: 'directory',
    icon: <DirectoryIcon />,
    title: basename(path),
    onClick: () => model.path = path
  }))

  let files = model.files.map(path => ({
    path,
    type: 'file',
    icon: <FileIcon />,
    title: basename(path),
    onClick: () => model.openFile(path)
  }))

  return <section className='xplrr-root'>
    <a
      className='close-icon icon icon-x'
      onClick={() => close()}></a>

    <DirectoryView
      path={model.path}
      directories={directories}
      files={files}
      setPath={path => model.path = path}
      openFile={path => model.openFile(path)}
    />

  </section>
}

App.propTypes = {
  model: prop.any,
  close: prop.function,
}

export default App

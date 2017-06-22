'use babel'

import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import ListItem from './ListItem'
import prop from 'prop-types'

const DirectoryView = ({ path, directories, files, setPath }) =>
  <article className='file-browser directory-view'>

    <Breadcrumbs
      path={path}
      onClick={setPath} />

    {directories.length ?
      <div>
        <h4>Dirs</h4>
        <ul className='list-group'>
          {directories.map(item => <ListItem key={item.path} {...item} />)}</ul>
      </div>
      : null }

    {files.length ?
      <div>
        <h4>Files</h4>
        <ul className='select-list list-group'>
          {files.map(item => <ListItem key={item.path} {...item} />)}</ul>
      </div> : null }

      {!files.length && !directories.length ? '<empty>' : null}

  </article>


DirectoryView.propTypes = {
  path: prop.string,
  directories: prop.array,
  files: prop.array,
  setPath: prop.function,
  openFile: prop.function,
}

export default DirectoryView

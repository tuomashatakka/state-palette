'use babel'

import React from 'react'
import prop from 'prop-types'

export const DirectoryIcon = () => <i className='icon icon-file-directory' />
export const FileIcon = () => <i className='icon icon-file-text' />

const ListItem = ({ onClick, path, title, icon }) =>
  <li className='list-item' onClick={onClick}>
    {icon} {title} <small>{path}</small>
  </li>

ListItem.propTypes = {
  onClick: prop.function,
  path: prop.string,
  title: prop.title,
  icon: prop.any,
}

export default ListItem

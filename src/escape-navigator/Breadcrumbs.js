'use babel'

import React from 'react'
import prop from 'prop-types'
import { sep } from 'path'

const Breadcrumbs = ({ path, onClick }) => {
  path = path.split(sep)
  path[0] = sep
  const getPath = (n) => sep + path.slice(1, n + 1).join(sep)

  return <ul className='breadcrumbs list-group'>
    {path.map((dir, n) =>
      <li key={n}
        className='list-item'
        onClick={() => onClick(getPath(n))}>
        {dir}
      </li>
    )}
  </ul>
}

Breadcrumbs.propTypes = {
  path: prop.string,
  onClick: prop.function,
}



export default Breadcrumbs

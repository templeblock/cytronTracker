import React from 'react'
// import cx from 'classnames'
// import gStyles from '../styles'
import theme from '../../theme'
import csjs from 'CSJS'

import { IconButton } from '../ui/Button'
import { canvasToDataUrl } from '../../utils/util.files.js'
import notify from '../../utils/util.notify.js'

const debug = require('debug')('cy:ResourceGrid')

const styles = csjs`
.grid {
  margin: 0;
  padding: 5px;
  list-style: none;
}
.item {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  float: left;
  border:solid 1px transparent;
}
.item:hover {
  border-color: ${theme.colorActive};
}
.item:hover .actions, .item:hover .info {
  opacity: 1;
}
.actions {
  opacity: 0;
  position: absolute;
  right: 5px;
  top: 5px;
  transition: opacity 0.3s ease;
}
.info {
  position: absolute;
  bottom: 5px;
  left: 0;
  opacity: 0;
  text-align: center;
  width: 100%;
  transition: opacity 0.3s ease;
}
`
//@TODO: drag resource to stage

export class ResourceGrid extends React.Component {
  static contextTypes = {
    cytron: React.PropTypes.object,
  };

  _toTracker(res) {
    const { cytron } = this.context
    if (!cytron.imgCachePool[res.id]) {
      canvasToDataUrl(res.url, (err, dataUrl, img) => {
        if (err) {
          notify.error('faild to pre process resource, make sure it has proper Access-Control-Allow-Origin header')
          return
        }
        cytron.imgCachePool[res.id] = img
        cytron.resourceMap[res.id] = dataUrl
        this.props.resourceToTracker(res)
      })
    } else {
      this.props.resourceToTracker(res)
    }
  }

  render() {
    let { resourceMap } = this.context.cytron
    const {
      resources, deleteResource, aWidth,
    } = this.props
    if (!resources || resources.length === 0)
      return <div style={{ padding: 10 }}>currently no Resource created</div>
    let itemWidth = (aWidth - 3 - 20) / 2

    return (
      <ul className={styles.grid}>
      {
        resources.map(rr => {
          let src = resourceMap[rr.id] ? resourceMap[rr.id] : rr.url
          let itemStyle = {
            backgroundImage: `url(${src})`,
            width: itemWidth,
            height: itemWidth,
          }
          return (
            <li key={rr.id}
              style={itemStyle}
              onClick={() => this._toTracker(rr)}
              className={styles.item}
            >
            <span className={styles.actions}>
              <IconButton name='delete'
                onClick={() => deleteResource(rr.id)}/>
            </span>
             <div className={styles.info}>{rr.name}</div>
            </li>
          )
        })
      }
      </ul>
    )
  }
}

import { connect } from 'react-redux'
import { resourceActions } from '../../actionCreators'

function mapStateToProps(state) {
  const { root } = state
  return {
    currentFrame: root.currentFrame,
    currentTracker: root.currentResource,
    resources: state.resources,
    aWidth: state.layout.rightSectionWidth,
  }
}

export const CResourceGrid = connect(
  mapStateToProps,
  resourceActions
)(ResourceGrid)
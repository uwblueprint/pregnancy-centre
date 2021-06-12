import React, { FunctionComponent } from 'react'

import BaseMap from '../../assets/kw-region-map.svg'
import ClientImg from '../../assets/client.png'
import { Point } from '../../data/types/donorHomepageConfig'

interface Props {
  points: Array<Point>, 
  onEnterHoverOverMarker: (pointId: number) => void;
  onLeaveHoverOverMarker: () => void;
}

const KWMap: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className='kw-map'>
      <div className="marker-overlay">
        {props.points.map(point => {
          return (<img
            className="map-marker"
            src={ClientImg}
            key="1"
            style={{ 
              top: (point.y * 100).toString() + "%", 
              left: (point.x * 100).toString() + "%" 
            }}
            onMouseEnter={() => props.onEnterHoverOverMarker(point.id)}
            onMouseLeave={props.onLeaveHoverOverMarker}
          />
          )
        })}
      </div>
      <img className="map-base" src={BaseMap} />
    </div>
  )
}

export default KWMap

import React, { FunctionComponent, useState } from "react";

import DonorHomepageConfig from '../../config/donorHompageConfig.json'
import Map from '../atoms/Map'
import { Point } from '../../data/types/donorHomepageConfig'



const MapContainer: FunctionComponent = () => {
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  const points = DonorHomepageConfig.Map;

  return <>
    <Map
      points={points}
      onEnterHoverOverMarker={setSelectedPointId}
      onLeaveHoverOverMarker={() => setSelectedPointId(null)}
    />
    {
      selectedPointId != null &&
      DonorHomepageConfig.Map.find((point: Point) => point.id === selectedPointId)?.testimonial
    }
  </>
};

export default MapContainer;


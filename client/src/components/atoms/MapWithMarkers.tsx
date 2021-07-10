import React, { FunctionComponent } from "react";

import { Point } from "../../data/types/donorHomepageConfig";

export interface MapWithMarkersPoint extends Point {
    id: number;
    imagePath: string;
}

interface Props {
    baseMapPath: string;
    markerSize: string;
    onEnterHoverOverMarker: (pointId: number) => void;
    onLeaveHoverOverMarker: () => void;
    points: Array<MapWithMarkersPoint>;
}

const MapWithMarkers: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="map-with-markers">
            <div className="marker-overlay">
                {props.points.map((point) => {
                    return (
                        <img
                            className="map-marker"
                            key={point.id}
                            onMouseEnter={() => props.onEnterHoverOverMarker(point.id)}
                            onMouseLeave={props.onLeaveHoverOverMarker}
                            src={point.imagePath}
                            style={{
                                top: (point.y * 100).toString() + "%",
                                left: (point.x * 100).toString() + "%",
                                width: props.markerSize
                            }}
                        />
                    );
                })}
            </div>
            <img className="map-base" src={props.baseMapPath} />
        </div>
    );
};

export default MapWithMarkers;

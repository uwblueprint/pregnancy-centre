import React, { FunctionComponent } from "react";

import CircleImage from "../atoms/CircleImage";
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
                        <CircleImage
                            key={point.id}
                            imagePath={point.imagePath}
                            className="map-marker"
                            onMouseEnter={() => props.onEnterHoverOverMarker(point.id)}
                            onMouseLeave={props.onLeaveHoverOverMarker}
                            style={{
                                top: (point.y * 100).toString() + "%",
                                left: (point.x * 100).toString() + "%",
                                width: props.markerSize,
                                height: props.markerSize
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

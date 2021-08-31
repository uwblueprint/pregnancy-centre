import React, { FunctionComponent, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { MapQuote, Statistic } from "../../data/types/donorHomepageConfig";
import MapWithMarkers, { MapWithMarkersPoint } from "../atoms/MapWithMarkers";
import BaseMap from "../../assets/kw-region-map.png";
import Card from "../atoms/CardWithShadow";
import CircleImage from "../atoms/CircleImage";
import Cursor from "../../assets/cursor.png";
import DonorHomepageConfig from "../../config/donorHomepageConfig.json";
import { Testimonial } from "../../data/types/donorHomepageConfig";

interface Statistic {
    icon: string;
    measurement: string;
    stat: string;
    type: string;
}

const DonorImpactSection: FunctionComponent = () => {
    const [selectedMapQuote, _setSelectedMapQuote] = useState<MapQuote | null>(null);
    const mapQuotes = DonorHomepageConfig.map.testimonials;
    const setSelectedTestimonial = (id: number | null) => {
        if (!id) {
            _setSelectedMapQuote(null);
            return;
        }
        const testimonial = mapQuotes.find((testimonial: MapQuote) => testimonial.id === id);
        _setSelectedMapQuote(testimonial ?? null);
    };
    const points = DonorHomepageConfig.map.points;
    const markerSize =
        mapQuotes.length > 0 && mapQuotes.length <= DonorHomepageConfig.map.markerSizes.length
            ? DonorHomepageConfig.map.markerSizes[mapQuotes.length - 1]
            : DonorHomepageConfig.map.defaultMarkerSize;
    const maxPoints = points.length;
    const testimonialPoints: Array<MapWithMarkersPoint> = mapQuotes.reduce(
        (accumulator: Array<MapWithMarkersPoint>, testimonial: MapQuote, index) => {
            if (index >= maxPoints) {
                return accumulator;
            }
            accumulator.push({
                id: testimonial.id,
                imagePath: testimonial.imagePath,
                x: points[index].x,
                y: points[index].y
            });
            return accumulator;
        },
        []
    );

    return (
        <div className="donor-impact-section">
            <h1 className="donor-impact-section-header">Our Impact</h1>
            <Row className="donor-impact-section-content">
                <Col className="map-section" sm={0} xl={1} />
                <Col className="map-section" sm={12} xl={5}>
                    <div className="instructions">
                        <img src={Cursor} />
                        <p>hover over the images for some client testimonials!</p>
                    </div>
                    <MapWithMarkers
                        baseMapPath={BaseMap}
                        markerSize={markerSize}
                        points={testimonialPoints}
                        onEnterHoverOverMarker={setSelectedTestimonial}
                        onLeaveHoverOverMarker={() => setSelectedTestimonial(null)}
                    />
                </Col>
                <Col className="info-section" sm={12} xl={5}>
                    <div className="stats-section">
                        {DonorHomepageConfig.statistics.map((statistic: Statistic) => (
                            <div className="stat" key={statistic.icon}>
                                <div className="stat-top">
                                    <i className={statistic.icon} />
                                    <h1>{statistic.measurement}</h1>
                                </div>
                                <p>{statistic.stat}</p>
                            </div>
                        ))}
                    </div>
                    {selectedMapQuote && (
                        <Card>
                            <CircleImage imagePath={selectedMapQuote.imagePath}/>
                            <p>{selectedMapQuote.testimonial}</p>
                        </Card>
                    )}
                </Col>
                <Col className="map-section" xs={0} xl={1} />
            </Row>
        </div>
    );
};

export default DonorImpactSection;

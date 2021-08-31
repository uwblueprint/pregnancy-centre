import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Spinner } from "react-bootstrap";

import { DonorHomepageConfig, Statistic, Testimonial } from "../../data/types/donorHomepageConfig";
import MapWithMarkers, { MapWithMarkersPoint } from "../atoms/MapWithMarkers";
import BaseMap from "../../assets/kw-region-map.png";
import Card from "../atoms/CardWithShadow";
import CircleImage from "../atoms/CircleImage";
import Cursor from "../../assets/cursor.png";

const DonorImpactSection: FunctionComponent = () => {
    const [selectedTestimonial, _setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [donorHomepageConfig, setDonorHomepageConfig] = useState<DonorHomepageConfig | null>(null);

    const fetchDonorHomepageConfigQuery = gql`
        query FetchDonorHomepageConfig {
            donorHomepage {
                map {
                    defaultMarkerSize
                    markerSizes
                    points {
                        x
                        y
                    }
                    testimonials {
                        id
                        imagePath
                        testimonial
                    }
                }
                statistics {
                    icon
                    measurement
                    stat
                    type
                }
            }
        }
    `;

    useQuery(fetchDonorHomepageConfigQuery, {
        fetchPolicy: "network-only",
        onCompleted: (data: { donorHomepage: DonorHomepageConfig }) => {
            const donorHomepage: DonorHomepageConfig = JSON.parse(JSON.stringify(data.donorHomepage)); // deep-copy since data object is frozen
            setDonorHomepageConfig(donorHomepage);
        }
    });

    const mapQuotes = donorHomepageConfig?.map.testimonials ?? [];
    const setSelectedTestimonial = (id: number | null) => {
        if (!id) {
            _setSelectedTestimonial(null);
            return;
        }
        const testimonial = mapQuotes.find((testimonial: Testimonial) => testimonial.id === id);
        _setSelectedTestimonial(testimonial ?? null);
    };
    const points = donorHomepageConfig?.map.points ?? [];
    let markerSize = "0px";
    if (donorHomepageConfig != null) {
        markerSize =
            mapQuotes.length > 0 && mapQuotes.length <= donorHomepageConfig.map.markerSizes.length
                ? donorHomepageConfig.map.markerSizes[mapQuotes.length - 1]
                : donorHomepageConfig?.map.defaultMarkerSize;
    }
    const maxPoints = points.length;
    const testimonialPoints: Array<MapWithMarkersPoint> = mapQuotes.reduce(
        (accumulator: Array<MapWithMarkersPoint>, testimonial: Testimonial, index) => {
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
                {donorHomepageConfig == null ? (
                    <div className="spinner">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <>
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
                                {donorHomepageConfig.statistics.map((statistic: Statistic) => (
                                    <div className="stat" key={statistic.icon}>
                                        <div className="stat-top">
                                            <i className={statistic.icon} />
                                            <h1>{statistic.measurement}</h1>
                                        </div>
                                        <p>{statistic.stat}</p>
                                    </div>
                                ))}
                            </div>
                            {selectedTestimonial && (
                                <Card>
                                    <CircleImage imagePath={selectedTestimonial.imagePath} />
                                    <p>{selectedTestimonial.testimonial}</p>
                                </Card>
                            )}
                        </Col>
                        <Col className="map-section" xs={0} xl={1} />
                    </>
                )}
            </Row>
        </div>
    );
};

export default DonorImpactSection;

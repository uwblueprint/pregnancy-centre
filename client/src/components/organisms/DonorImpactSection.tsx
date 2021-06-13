import React, { FunctionComponent, useState } from "react";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import MapWithMarkers, { MapWithMarkersPoint } from '../atoms/MapWithMarkers'
import { Statistic, Testimonial } from '../../data/types/donorHomepageConfig'
import BaseMap from '../../assets/kw-region-map.png'
import Card from '../atoms/CardWithShadow'
import Cursor from '../../assets/cursor.png'
import DonorHomepageConfig from '../../config/donorHompageConfig.json'

const DonorImpactSection: FunctionComponent = () => {
  const [selectedTestimonial, _setSelectedTestimonial] = useState<Testimonial | null>(DonorHomepageConfig.mapTestimonials[0]);
  // const [selectedTestimonial, _setSelectedTestimonial] = useState<Testimonial | null>(null);
  const setSelectedTestimonial = (id: number | null) => {
    if (!id) {
      _setSelectedTestimonial(null);
      return;
    }
    const testimonial = DonorHomepageConfig.mapTestimonials.find((testimonial: Testimonial) => testimonial.id === id);
    _setSelectedTestimonial(testimonial ?? null);
  }
  const points = DonorHomepageConfig.mapPoints;
  const maxPoints = points.length;
  const testimonialPoints = DonorHomepageConfig.mapTestimonials.reduce(
    (testimonialPoints: Array<MapWithMarkersPoint>, testimonial, index) => {
      if (index >= maxPoints) {
        return testimonialPoints;
      }

      testimonialPoints.push({
        id: testimonial.id,
        imagePath: testimonial.imagePath,
        x: points[index].x,
        y: points[index].y,
      })

      return testimonialPoints;
    }, [])

  return (
    <div className="donor-impact-section">
      <h1 className="donor-impact-section-header">Our Impact</h1>
      <Row className="donor-impact-section-content">
        <Col className="map-section" xs={12} sm={7}>
          <div className="instructions">
            <img src={Cursor} />
            <p>hover over the images for some client testimonials!</p>
          </div>
          <MapWithMarkers
            baseMapPath={BaseMap}
            points={testimonialPoints}
            onEnterHoverOverMarker={setSelectedTestimonial}
            onLeaveHoverOverMarker={() => setSelectedTestimonial(null)}
          />
        </Col>
        <Col className="info-section" xs={12} sm={5}>
          <div className="stats-section">
            {
              DonorHomepageConfig.statistics.map((stat: Statistic) => (
                <div className="stat" key={stat.icon}>
                  <div className="stat-top">
                    <i className={stat.icon} />
                    <h1>{stat.measurement}</h1>
                  </div>
                  <p>{stat.stat}</p>
                </div>
              ))
            }
          </div>
          {
            selectedTestimonial &&
            <Card>
              <img src={selectedTestimonial.imagePath} />
              <p>
                {selectedTestimonial.testimonial}
              </p>
            </Card>
          }
        </Col>
      </Row>
    </div>
  )
};

export default DonorImpactSection;

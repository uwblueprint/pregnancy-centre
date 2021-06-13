import React, { FunctionComponent, useState } from "react";

import MapWithMarkers, { MapWithMarkersPoint } from '../atoms/MapWithMarkers'
import BaseMap from '../../assets/kw-region-map.svg'
import Card from '../atoms/CardWithShadow'
import DonorHomepageConfig from '../../config/donorHompageConfig.json'
import { Testimonial } from '../../data/types/donorHomepageConfig'

const ClientTestimonialsMap: FunctionComponent = () => {
  const [selectedTestimonial, _setSelectedTestimonial] = useState<Testimonial | null>(DonorHomepageConfig.MapTestimonials[0]);
  const setSelectedTestimonial = (id: number | null) => {
    if(!id){
      _setSelectedTestimonial(null);
      return;
    }
    const testimonial = DonorHomepageConfig.MapTestimonials.find((testimonial: Testimonial) => testimonial.id === id);
    _setSelectedTestimonial(testimonial ?? null);
  }
  const points = DonorHomepageConfig.MapPoints;
  const maxPoints = points.length;
  const testimonialPoints = DonorHomepageConfig.MapTestimonials.reduce(
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

  return <div className="client-testimonials-map">
    <MapWithMarkers
      baseMapPath={BaseMap}
      points={testimonialPoints}
      onEnterHoverOverMarker={setSelectedTestimonial}
      onLeaveHoverOverMarker={() => setSelectedTestimonial(null)}
    />
    {
      selectedTestimonial &&
      <Card>
        <img src={selectedTestimonial.imagePath} />
        <p>
          {selectedTestimonial.testimonial}
        </p>
      </Card>
    }
  </div>
};

export default ClientTestimonialsMap;

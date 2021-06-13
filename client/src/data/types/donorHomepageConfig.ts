export interface Point {
  x: number,
  y: number
}

export interface Testimonial {
  id: number,
  imagePath: string,
  testimonial: string,
}

export interface DonorHompageConfig {
  MapPoints: Array<Point>,
  MapTestimonials: Array<Testimonial>
}

export interface Point {
  x: number,
  y: number
}

export interface Testimonial {
  id: number,
  imagePath: string,
  testimonial: string,
}

export interface Statistic {
  icon: string,
  measurement: string,
  stat: string
}

export interface DonorHompageConfig {
  mapPoints: Array<Point>,
  mapTestimonials: Array<Testimonial>,
  statistics: Array<Statistic>
}

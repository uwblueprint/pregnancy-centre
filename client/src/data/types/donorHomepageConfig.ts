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
  map: {
    points: Array<Point>,
    markerSizes: Array<string>,
    testimonials:Array<Testimonial>,
  },
  statistics: Array<Statistic>
}

export interface SeedService {
  id: string
  name: string
  icon: string
  description: string
  features: string[]
}

export interface SeedReview {
  id: string
  name: string
  rating: number
  text: string
  date: string
  service: string
}

export interface SeedPortfolioProject {
  id: string
  title: string
  description: string
  services: string[]
  beforeImage: string
  afterImage: string
  duration: string
}

export interface SeedBlogPost {
  id: string
  title: string
  excerpt: string
  content?: string
  date: string
  readTime: string
  image?: string
}

export interface SeedFaqItem {
  question: string
  answer: string
}

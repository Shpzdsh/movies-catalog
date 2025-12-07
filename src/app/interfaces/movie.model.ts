interface Image {
  url: string,
  width: string,
  heigth: string,
}

interface Rating {
  aggregateRating: number,
  voteCount: number,
}

export interface Movie {
  id: string,
  type: string,
  primaryTitle: string,
  originalTitle: string,
  primaryImage?: Image,
  startYear?: number,
  runtimeSeconds?: number,
  genres: string[],
  rating?: Rating,
  plot?: string,
}

export interface SearchResult {
  result: Movie[],
  totalCount: number,
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface Annotation {
  id: string;
  text: string;
  elementSelector: string;
  position: {
    x: number;
    y: number;
  };
  pageUrl: string;
  timestamp: string;
}

export interface AnnotationsData {
  annotations: Annotation[];
}

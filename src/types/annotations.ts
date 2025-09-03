export interface Annotation {
  id: string;
  text: string;
  elementSelector: string;
  position: {
    x: number;
    y: number;
  };
  placement: 'top' | 'bottom' | 'left' | 'right';
  pageUrl: string;
  gitBranch?: string;
  timestamp: string;
}

export interface AnnotationsData {
  annotations: Annotation[];
}

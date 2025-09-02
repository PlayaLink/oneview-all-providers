import { useState, useEffect } from 'react';
import { Annotation, AnnotationsData } from '../types/annotations';
import annotationsData from '../data/annotations.json';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>(annotationsData.annotations);

  // Save annotations to the JSON file (in a real app, this would write to disk)
  const saveAnnotations = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    // In a real implementation, you'd write to the JSON file here
    // For now, we'll log the updated JSON so you can copy it to the file
    const updatedData = {
      annotations: newAnnotations
    };
    console.log('📝 Updated annotations.json:');
    console.log(JSON.stringify(updatedData, null, 2));
    console.log('📝 Copy the above JSON to src/data/annotations.json');
  };

  // Add a new annotation
  const addAnnotation = (annotation: Omit<Annotation, 'id' | 'timestamp'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    saveAnnotations(updatedAnnotations);
    return newAnnotation;
  };

  // Remove an annotation
  const removeAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(ann => ann.id !== id);
    saveAnnotations(updatedAnnotations);
  };

  // Get annotations for current page
  const getPageAnnotations = (pageUrl: string) => {
    return annotations.filter(ann => ann.pageUrl === pageUrl);
  };

  return {
    annotations,
    addAnnotation,
    removeAnnotation,
    getPageAnnotations,
    saveAnnotations,
  };
}

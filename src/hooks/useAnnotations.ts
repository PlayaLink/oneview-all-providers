import { useState, useEffect } from 'react';
import { Annotation } from '../types/annotations';
import { fetchAnnotations, addAnnotation as addAnnotationToDb, deleteAnnotation as deleteAnnotationFromDb, updateAnnotation as updateAnnotationInDb } from '../lib/supabaseClient';
import { getCurrentGitBranch, getDeploymentBranchInfo } from '../lib/gitUtils';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);
  const [deploymentInfo, setDeploymentInfo] = useState<{
    branch: string | null;
    environment: 'development' | 'preview' | 'production';
    deploymentUrl: string | null;
  } | null>(null);

  // Fetch annotations from Supabase
  const fetchAllAnnotations = async () => {
    try {
      console.log('🔄 fetchAllAnnotations: Starting...');
      setLoading(true);
      const data = await fetchAnnotations();
      console.log('📊 fetchAllAnnotations: Raw data from database:', data.length, 'annotations');
      
      // Transform the data to match the Annotation interface
      const transformedAnnotations: Annotation[] = data.map(row => ({
        id: row.id,
        text: row.text,
        elementSelector: row.element_selector,
        position: { x: row.position_x, y: row.position_y },
        placement: row.placement,
        pageUrl: row.page_url,
        gitBranch: row.git_branch,
        timestamp: row.created_at,
      }));
      
      console.log('📊 fetchAllAnnotations: Transformed annotations:', transformedAnnotations.length);
      setAnnotations(transformedAnnotations);
      console.log('✅ fetchAllAnnotations: State updated with', transformedAnnotations.length, 'annotations');
    } catch (error) {
      console.error('Error fetching annotations:', error);
      setAnnotations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load annotations on mount
  useEffect(() => {
    const initializeAnnotations = async () => {
      try {
        // Get deployment info first
        const deploymentInfo = await getDeploymentBranchInfo();
        setDeploymentInfo(deploymentInfo);
        setCurrentBranch(deploymentInfo.branch);
        
        // Fetch all annotations
        await fetchAllAnnotations();
      } catch (error) {
        console.error('Error initializing annotations:', error);
        setLoading(false);
      }
    };
    
    initializeAnnotations();
  }, []);

  // Add a new annotation
  const addAnnotation = async (annotation: Omit<Annotation, 'id' | 'timestamp'>) => {
    try {
      console.log('🔄 Adding annotation:', annotation);
      
      // Get the current git branch using the deployment info
      const deploymentInfo = await getDeploymentBranchInfo();
      const gitBranch = deploymentInfo.branch;
      
      const data = await addAnnotationToDb({
        text: annotation.text,
        element_selector: annotation.elementSelector,
        position_x: annotation.position.x,
        position_y: annotation.position.y,
        placement: annotation.placement,
        page_url: annotation.pageUrl,
        git_branch: gitBranch || undefined,
      });
      
      console.log('✅ Annotation saved to database:', data[0]);
      
      // Refresh annotations from database to ensure we have the latest data and proper ordering
      console.log('🔄 Refreshing annotations from database...');
      await fetchAllAnnotations();
      console.log('✅ Annotations refreshed');
      
      return data[0];
    } catch (error) {
      console.error('Error adding annotation:', error);
      throw error;
    }
  };

  // Remove an annotation
  const removeAnnotation = async (id: string) => {
    try {
      await deleteAnnotationFromDb(id);
      setAnnotations(prev => prev.filter(ann => ann.id !== id));
    } catch (error) {
      console.error('Error removing annotation:', error);
      throw error;
    }
  };

  // Update an annotation
  const updateAnnotation = async (id: string, updates: Partial<Pick<Annotation, 'text'>>) => {
    try {
      await updateAnnotationInDb(id, updates);
      setAnnotations(prev => prev.map(ann => 
        ann.id === id ? { ...ann, ...updates } : ann
      ));
    } catch (error) {
      console.error('Error updating annotation:', error);
      throw error;
    }
  };

  // Get annotations for current page
  const getPageAnnotations = (pageUrl: string) => {
    return annotations.filter(ann => ann.pageUrl === pageUrl);
  };

  // Get annotations for current page and branch
  const getCurrentPageAnnotations = (pageUrl: string) => {
    return annotations.filter(ann => {
      const pageMatch = ann.pageUrl === pageUrl;
      const branchMatch = !currentBranch || !ann.gitBranch || ann.gitBranch === currentBranch;
      return pageMatch && branchMatch;
    });
  };

  // Get all annotations for current branch
  const getCurrentBranchAnnotations = () => {
    if (!currentBranch) return annotations; // Show all if no branch detected
    return annotations.filter(ann => !ann.gitBranch || ann.gitBranch === currentBranch);
  };

  return {
    annotations,
    loading,
    currentBranch,
    deploymentInfo,
    addAnnotation,
    removeAnnotation,
    updateAnnotation,
    getPageAnnotations,
    getCurrentPageAnnotations,
    getCurrentBranchAnnotations,
    refetch: fetchAllAnnotations,
  };
}

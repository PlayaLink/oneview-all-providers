// Utility function to get the current git branch
// This will work in development and can be extended for production
export function getCurrentGitBranch(): string | null {
  try {
    // In a browser environment, we can't directly access git
    // But we can try to get it from environment variables or other sources
    
    // Check if we're in a Vercel deployment (they set VERCEL_GIT_COMMIT_REF)
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      // For Vercel deployments, the branch info might be in meta tags or env vars
      const metaBranch = document.querySelector('meta[name="git-branch"]');
      if (metaBranch) {
        return metaBranch.getAttribute('content');
      }
    }
    
    // For development, we can try to get it from a build-time environment variable
    // This would need to be set during the build process
    if (import.meta.env.VITE_GIT_BRANCH) {
      return import.meta.env.VITE_GIT_BRANCH;
    }
    
    // Fallback: try to get from a custom endpoint or service
    // This could be implemented as a serverless function that returns git info
    return null;
  } catch (error) {
    console.warn('Could not determine git branch:', error);
    return null;
  }
}

// Enhanced function to get deployment branch info
export async function getDeploymentBranchInfo(): Promise<{
  branch: string | null;
  environment: 'development' | 'preview' | 'production';
  deploymentUrl: string | null;
}> {
  try {
    const hostname = window.location.hostname;
    const isVercel = hostname.includes('vercel.app');
    
    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return {
        branch: import.meta.env.VITE_GIT_BRANCH || null,
        environment: 'development',
        deploymentUrl: null
      };
    }
    
    // Vercel deployment
    if (isVercel) {
      // Try to get branch from Vercel's environment variables (if available)
      const vercelBranch = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF;
      
      // Try to get from meta tags (if set during build)
      const metaBranch = document.querySelector('meta[name="git-branch"]');
      const branchFromMeta = metaBranch?.getAttribute('content');
      
      // Determine environment based on URL pattern
      let environment: 'development' | 'preview' | 'production' = 'production';
      if (hostname.includes('-git-')) {
        environment = 'preview';
      } else if (hostname.includes('localhost')) {
        environment = 'development';
      }
      
      return {
        branch: vercelBranch || branchFromMeta || null,
        environment,
        deploymentUrl: window.location.origin
      };
    }
    
    // Other hosting platforms
    return {
      branch: import.meta.env.VITE_GIT_BRANCH || null,
      environment: 'production',
      deploymentUrl: window.location.origin
    };
    
  } catch (error) {
    console.warn('Could not determine deployment info:', error);
    return {
      branch: null,
      environment: 'production',
      deploymentUrl: null
    };
  }
}

// Alternative approach: create a simple endpoint that returns git info
// This would be a serverless function or API route that runs `git branch --show-current`
export async function fetchGitBranch(): Promise<string | null> {
  try {
    // This would be your API endpoint that returns git branch info
    const response = await fetch('/api/git-branch');
    if (response.ok) {
      const data = await response.json();
      return data.branch;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch git branch:', error);
    return null;
  }
}

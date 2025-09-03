import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  try {
    // Get the current git branch
    const { stdout } = await execAsync('git branch --show-current');
    const branch = stdout.trim();
    
    res.status(200).json({ 
      branch,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting git branch:', error);
    res.status(500).json({ 
      branch: null,
      error: 'Could not determine git branch'
    });
  }
}

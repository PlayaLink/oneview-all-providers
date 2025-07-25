import { createClient } from '@supabase/supabase-js';

// Direct Supabase connection
const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define all the actions we need
const actions = [
  { name: 'download', label: 'Download', icon: 'faCircleDown', tooltip: 'Download record data', description: 'Download this record as CSV or PDF' },
  { name: 'attachment', label: 'Attachment', icon: 'faPaperclip', tooltip: 'Manage attachments', description: 'Add or view attachments for this record' },
  { name: 'notification', label: 'Notification', icon: 'faBell', tooltip: 'Toggle notifications', description: 'Enable or disable notifications for this record' },
  { name: 'grid', label: 'Grid View', icon: 'faTable', tooltip: 'Toggle grid view', description: 'Show or hide the grid view for this record' },
  { name: 'flag', label: 'Flag', icon: 'faFlag', tooltip: 'Flag this record', description: 'Mark this record for attention' },
  { name: 'delete', label: 'Delete', icon: 'faTimes', tooltip: 'Delete record', description: 'Delete this record' },
  { name: 'toggle', label: 'Toggle', icon: 'faToggleOn', tooltip: 'Toggle status', description: 'Toggle the status of this record' },
  { name: 'star', label: 'Star', icon: 'faStar', tooltip: 'Star this record', description: 'Mark this record as important' },
  { name: 'verified', label: 'Verified', icon: 'faShieldCheck', tooltip: 'Verified status', description: 'Mark this record as verified' }
];

// Define grid actions configuration based on the screenshot
const gridActionsConfig = {
  'ready-only': [1, 2, 3, 4, 5, 8, 9], // download, attachment, notification, grid, flag, star, verified
  '...': [7, 8, 9], // toggle, star, verified
  'Verifications': [1, 3, 4, 5], // download, notification, grid, flag
  'Provider Info': [1, 4, 5, 7], // download, grid, flag, toggle
  'Birth Info': [1, 4], // download, grid
  'Addresses': [1, 4, 5, 6], // download, grid, flag, delete
  'Additional Names': [1, 4, 5, 6], // download, grid, flag, delete
  'CAQH': [4], // grid only
  'Health Info': [1, 3, 4, 5, 6], // download, notification, grid, flag, delete
  'State Licenses': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'DEA Licenses': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Controlled Substance': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Event Log': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'OIG': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Board Certifications': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Other Certifications': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Education & Training': [1, 4, 5, 6, 9], // download, grid, flag, delete, verified
  'Exams': [1, 4, 5, 6], // download, grid, flag, delete
  'Practice/Employer': [1, 3, 4, 5, 6], // download, notification, grid, flag, delete
  'Facility Affiliations': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Work History': [1, 3, 4, 5, 6, 9], // download, notification, grid, flag, delete, verified
  'Peer References': [1, 3, 4, 5, 6], // download, notification, grid, flag, delete
  'Military Experience': [1, 4, 5, 6], // download, grid, flag, delete
  'Malpractice Insurance': [1, 3, 4, 5, 6], // download, notification, grid, flag, delete
  'Documents': [1, 2, 3, 4, 5, 6, 9] // download, attachment, notification, grid, flag, delete, verified
};

async function setupGridActions() {
  try {
    console.log('Setting up grid actions...');

    // First, insert all actions
    console.log('Inserting actions...');
    for (const action of actions) {
      const { error } = await supabase
        .from('actions')
        .upsert(action, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error inserting action ${action.name}:`, error);
      } else {
        console.log(`✓ Inserted action: ${action.name}`);
      }
    }

    // Get all actions to map names to IDs
    const { data: allActions, error: actionsError } = await supabase
      .from('actions')
      .select('id, name');
    
    if (actionsError) {
      throw actionsError;
    }

    const actionMap = allActions.reduce((acc, action) => {
      acc[action.name] = action.id;
      return acc;
    }, {} as Record<string, string>);

    // Get all grid definitions
    const { data: gridDefinitions, error: gridsError } = await supabase
      .from('grid_definitions')
      .select('id, display_name');
    
    if (gridsError) {
      throw gridsError;
    }

    console.log('Available grid definitions:', gridDefinitions.map(g => g.display_name));

    // Create grid actions for each grid
    console.log('Setting up grid actions for each grid...');
    for (const [gridName, actionOrders] of Object.entries(gridActionsConfig)) {
      const gridDef = gridDefinitions.find(g => g.display_name === gridName);
      
      if (!gridDef) {
        console.warn(`Grid definition not found for: ${gridName}`);
        continue;
      }

      console.log(`Setting up actions for grid: ${gridName}`);

      // Delete existing grid actions for this grid
      const { error: deleteError } = await supabase
        .from('grid_actions')
        .delete()
        .eq('grid_id', gridDef.id);
      
      if (deleteError) {
        console.error(`Error deleting existing actions for ${gridName}:`, deleteError);
        continue;
      }

      // Insert new grid actions
      for (let i = 0; i < actionOrders.length; i++) {
        const actionOrder = actionOrders[i];
        const actionName = Object.keys(actionMap)[actionOrder - 1]; // Convert 1-based index to action name
        
        if (!actionName || !actionMap[actionName]) {
          console.warn(`Action not found for order ${actionOrder}`);
          continue;
        }

        const { error: insertError } = await supabase
          .from('grid_actions')
          .insert({
            grid_id: gridDef.id,
            action_id: actionMap[actionName],
            order: i + 1
          });

        if (insertError) {
          console.error(`Error inserting grid action for ${gridName} - ${actionName}:`, insertError);
        } else {
          console.log(`  ✓ Added action: ${actionName} (order: ${i + 1})`);
        }
      }
    }

    console.log('Grid actions setup completed successfully!');
  } catch (error) {
    console.error('Error setting up grid actions:', error);
  }
}

// Run the setup
setupGridActions(); 
// Script to set all column widths to 250px
import { createClient } from '@supabase/supabase-js';

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setAllColumnWidths() {
  console.log('Setting all column widths to 250px...\n');

  try {
    // Step 1: Get all columns
    console.log('1. Fetching all columns from grid_columns table...');
    const { data: columns, error: fetchError } = await supabase
      .from('grid_columns')
      .select('id, name, display_name, width, grid_id');
    
    if (fetchError) throw fetchError;
    
    console.log(`Found ${columns.length} columns total`);
    
    if (columns.length === 0) {
      console.log('No columns found in the grid_columns table.');
      return;
    }

    // Step 2: Show current width distribution
    console.log('\n2. Current width distribution:');
    const widthCounts = {};
    columns.forEach(col => {
      const width = col.width || 'null';
      widthCounts[width] = (widthCounts[width] || 0) + 1;
    });
    
    Object.entries(widthCounts).forEach(([width, count]) => {
      console.log(`  - ${width}px: ${count} columns`);
    });

    // Step 3: Update all columns to 250px
    console.log('\n3. Updating all columns to 250px...');
    
    const { data: updatedColumns, error: updateError } = await supabase
      .from('grid_columns')
      .update({ width: 250 })
      .select('id, name, display_name, width');
    
    if (updateError) throw updateError;
    
    console.log(`Successfully updated ${updatedColumns.length} columns to 250px`);

    // Step 4: Verify the updates
    console.log('\n4. Verifying updates...');
    const { data: verifyColumns, error: verifyError } = await supabase
      .from('grid_columns')
      .select('id, name, display_name, width')
      .limit(10);
    
    if (verifyError) throw verifyError;
    
    console.log('Sample of updated columns:');
    verifyColumns.forEach(col => {
      console.log(`  - ${col.display_name} (${col.name}): ${col.width}px`);
    });

    // Step 5: Show final width distribution
    console.log('\n5. Final width distribution:');
    const finalWidthCounts = {};
    const { data: allColumns, error: finalError } = await supabase
      .from('grid_columns')
      .select('width');
    
    if (finalError) throw finalError;
    
    allColumns.forEach(col => {
      const width = col.width || 'null';
      finalWidthCounts[width] = (finalWidthCounts[width] || 0) + 1;
    });
    
    Object.entries(finalWidthCounts).forEach(([width, count]) => {
      console.log(`  - ${width}px: ${count} columns`);
    });

    console.log('\n✅ Successfully set all column widths to 250px!');
    console.log(`📊 Total columns updated: ${updatedColumns.length}`);

  } catch (error) {
    console.error('❌ Error setting column widths:', error);
    process.exit(1);
  }
}

// Run the script
setAllColumnWidths(); 
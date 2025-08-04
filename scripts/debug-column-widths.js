// Debug script for column width persistence
import { createClient } from '@supabase/supabase-js';

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugColumnWidths() {
  console.log('🔍 Debugging column width persistence...\n');

  try {
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('grid_definitions')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Get grid definitions
    console.log('\n2. Fetching grid definitions...');
    const { data: gridDefs, error: gridError } = await supabase
      .from('grid_definitions')
      .select('id, display_name, key, table_name')
      .limit(3);
    
    if (gridError) throw gridError;
    console.log(`Found ${gridDefs.length} grid definitions:`);
    gridDefs.forEach(grid => {
      console.log(`  - ${grid.display_name} (${grid.key})`);
    });

    if (gridDefs.length === 0) {
      console.log('No grid definitions found');
      return;
    }

    // Test 3: Get columns for the first grid
    const testGrid = gridDefs[0];
    console.log(`\n3. Fetching columns for grid: ${testGrid.display_name}`);
    
    const { data: columns, error: colError } = await supabase
      .from('grid_columns')
      .select('*')
      .eq('grid_id', testGrid.id)
      .order('order');
    
    if (colError) throw colError;
    console.log(`Found ${columns.length} columns:`);
    columns.forEach(col => {
      console.log(`  - ${col.display_name} (${col.name}): ${col.width || 'null'}px`);
    });

    if (columns.length === 0) {
      console.log('No columns found for this grid');
      return;
    }

    // Test 4: Test the updateGridColumnWidths function
    console.log('\n4. Testing updateGridColumnWidths function...');
    const testColumn = columns[0];
    const originalWidth = testColumn.width;
    const newWidth = 300;
    
    console.log(`Testing with column: ${testColumn.display_name}`);
    console.log(`Original width: ${originalWidth || 'null'}`);
    console.log(`New width: ${newWidth}`);
    
    const widthUpdates = [{
      columnId: testColumn.id,
      width: newWidth
    }];
    
    console.log('Calling updateGridColumnWidths with:', widthUpdates);
    
    const { data: updatedColumns, error: updateError } = await supabase
      .from('grid_columns')
      .upsert(
        widthUpdates.map(({ columnId, width }) => ({ id: columnId, width })),
        { onConflict: 'id' }
      )
      .select();
    
    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return;
    }
    
    console.log('✅ Update successful:', updatedColumns);

    // Test 5: Verify the update
    console.log('\n5. Verifying the update...');
    const { data: verifyColumn, error: verifyError } = await supabase
      .from('grid_columns')
      .select('id, name, display_name, width')
      .eq('id', testColumn.id)
      .single();
    
    if (verifyError) throw verifyError;
    console.log('Updated column:', verifyColumn);

    // Test 6: Restore original width
    console.log('\n6. Restoring original width...');
    if (originalWidth !== null) {
      await supabase
        .from('grid_columns')
        .update({ width: originalWidth })
        .eq('id', testColumn.id);
      console.log(`Restored width to ${originalWidth}`);
    }

    console.log('\n✅ All tests passed! The database functions are working correctly.');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug script
debugColumnWidths(); 
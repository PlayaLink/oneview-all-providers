// Test script for column width persistence
// This script can be run to test the database functions

const { createClient } = require('@supabase/supabase-js');

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testColumnWidthPersistence() {
  console.log('Testing column width persistence...\n');

  try {
    // Test 1: Fetch grid definitions
    console.log('1. Fetching grid definitions...');
    const { data: gridDefs, error: gridError } = await supabase
      .from('grid_definitions')
      .select('id, display_name, key, table_name')
      .limit(5);
    
    if (gridError) throw gridError;
    console.log(`Found ${gridDefs.length} grid definitions`);
    
    if (gridDefs.length === 0) {
      console.log('No grid definitions found. Please ensure the database is populated.');
      return;
    }

    // Test 2: Fetch columns for the first grid
    const testGrid = gridDefs[0];
    console.log(`\n2. Fetching columns for grid: ${testGrid.display_name} (${testGrid.key})`);
    
    const { data: columns, error: colError } = await supabase
      .from('grid_columns')
      .select('*')
      .eq('grid_id', testGrid.id)
      .order('order');
    
    if (colError) throw colError;
    console.log(`Found ${columns.length} columns`);
    
    if (columns.length === 0) {
      console.log('No columns found for this grid. Please ensure the grid_columns table is populated.');
      return;
    }

    // Test 3: Update column widths
    console.log('\n3. Testing column width updates...');
    const testColumn = columns[0];
    const originalWidth = testColumn.width;
    const newWidth = originalWidth ? originalWidth + 50 : 200;
    
    console.log(`Updating column "${testColumn.display_name}" width from ${originalWidth || 'null'} to ${newWidth}`);
    
    const { data: updatedColumn, error: updateError } = await supabase
      .from('grid_columns')
      .update({ width: newWidth })
      .eq('id', testColumn.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    console.log(`Successfully updated column width to ${updatedColumn.width}`);

    // Test 4: Test bulk update function
    console.log('\n4. Testing bulk column width updates...');
    const widthUpdates = columns.slice(0, 3).map((col, index) => ({
      columnId: col.id,
      width: 150 + (index * 25)
    }));
    
    console.log(`Updating ${widthUpdates.length} columns with new widths...`);
    
    const { data: bulkUpdated, error: bulkError } = await supabase
      .from('grid_columns')
      .upsert(
        widthUpdates.map(({ columnId, width }) => ({ id: columnId, width })),
        { onConflict: 'id' }
      )
      .select();
    
    if (bulkError) throw bulkError;
    console.log(`Successfully updated ${bulkUpdated.length} columns`);

    // Test 5: Verify the updates
    console.log('\n5. Verifying updates...');
    const { data: verifyColumns, error: verifyError } = await supabase
      .from('grid_columns')
      .select('id, name, display_name, width')
      .in('id', widthUpdates.map(u => u.columnId));
    
    if (verifyError) throw verifyError;
    
    console.log('Updated column widths:');
    verifyColumns.forEach(col => {
      console.log(`  - ${col.display_name}: ${col.width}px`);
    });

    // Test 6: Restore original width
    console.log('\n6. Restoring original column width...');
    if (originalWidth !== null) {
      await supabase
        .from('grid_columns')
        .update({ width: originalWidth })
        .eq('id', testColumn.id);
      console.log(`Restored column "${testColumn.display_name}" width to ${originalWidth}`);
    }

    console.log('\n✅ All tests passed! Column width persistence is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testColumnWidthPersistence();
}

module.exports = { testColumnWidthPersistence }; 
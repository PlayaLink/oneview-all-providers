#!/usr/bin/env node

/**
 * Simple Additional Names Seeding Script
 * This script inserts sample data into the additional_names table
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  try {
    console.log('🚀 Starting Additional Names seeding...');
    
    // First, get some providers
    console.log('📋 Fetching providers...');
    const { data: providers, error: providerError } = await supabase
      .from('providers')
      .select('id, first_name, last_name')
      .limit(10);
    
    if (providerError) {
      console.error('❌ Error fetching providers:', providerError);
      return;
    }
    
    if (!providers || providers.length === 0) {
      console.log('⚠️  No providers found. Please seed providers first.');
      return;
    }
    
    console.log(`✅ Found ${providers.length} providers`);
    
    // Clear existing additional names
    console.log('🗑️  Clearing existing additional names...');
    const { error: deleteError } = await supabase
      .from('additional_names')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError);
      return;
    }
    
    console.log('✅ Existing data cleared');
    
    // Generate sample additional names
    const additionalNames = [];
    
    for (const provider of providers) {
      // Generate 2-3 additional names per provider
      const numNames = Math.floor(Math.random() * 2) + 2; // 2-3 names
      
      for (let i = 0; i < numNames; i++) {
        const types = ['Alternate Supervisor Name', 'Authorized Signer', 'Practice Administrator', 'Other Name'];
        const firstNames = ['John', 'Sarah', 'Michael', 'David', 'Lisa', 'Robert', 'Jennifer', 'William'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        const titles = ['MD', 'DO', 'PA', 'NP', 'RN', 'PharmD'];
        const tags = [['active', 'verified'], ['primary'], ['legal'], ['preferred'], ['secondary']];
        
        additionalNames.push({
          provider_id: provider.id,
          type: types[i % types.length],
          first_name: firstNames[i % firstNames.length],
          middle_name: i % 3 === 0 ? null : String.fromCharCode(65 + i), // A, B, C, etc.
          last_name: lastNames[i % lastNames.length],
          title: titles[i % titles.length],
          start_date: i % 2 === 0 ? '2020-01-01' : null,
          end_date: i % 4 === 0 ? '2025-12-31' : null,
          tags: tags[i % tags.length]
        });
      }
    }
    
    console.log(`📊 Generated ${additionalNames.length} additional names records`);
    
    // Insert the data
    console.log('💾 Inserting additional names...');
    const { data, error } = await supabase
      .from('additional_names')
      .insert(additionalNames)
      .select();
    
    if (error) {
      console.error('❌ Error inserting data:', error);
      return;
    }
    
    console.log(`✅ Successfully inserted ${data?.length || 0} additional names records`);
    
    // Verify the data
    console.log('🔍 Verifying data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('additional_names_with_provider')
      .select('*')
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
      return;
    }
    
    console.log('📋 Sample records:');
    verifyData?.forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.provider_name} - ${record.type}: ${record.first_name} ${record.last_name}`);
    });
    
    console.log('🎉 Additional Names seeding completed successfully!');
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
  }
}

main();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearRequirements() {
  console.log('🗑️ Clearing existing requirements...');
  
  // Clear facility requirement values first (due to foreign key constraints)
  const { error: valuesError } = await supabase
    .from('facility_requirement_values')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (valuesError) {
    console.error('❌ Error clearing facility requirement values:', valuesError);
  } else {
    console.log('✅ Cleared facility requirement values');
  }
  
  // Clear requirements
  const { error: requirementsError } = await supabase
    .from('requirements')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (requirementsError) {
    console.error('❌ Error clearing requirements:', requirementsError);
  } else {
    console.log('✅ Cleared requirements');
  }
  
  // Clear requirement data
  const { error: dataError } = await supabase
    .from('requirement_data')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (dataError) {
    console.error('❌ Error clearing requirement data:', dataError);
  } else {
    console.log('✅ Cleared requirement data');
  }
}

async function seedRequirementData() {
  console.log('🌱 Seeding requirement data...');
  
  const requirementData = [
    // General Section
    { key: 'malpractice_history', label: 'Malpractice History', data_type: 'text' },
    { key: 'employment_history', label: 'Employment History', data_type: 'text' },
    { key: 'facility_affiliations_history', label: 'Facility Affiliations History', data_type: 'text' },
    { key: 'peer_references', label: 'Peer References', data_type: 'text' },
    { key: 'cmes_general', label: 'CMEs', data_type: 'number' },
    { key: 'cme_history', label: 'CME History', data_type: 'text' },
    { key: 'life_support_certification_through_aha', label: 'Life Support Certification Through AHA', data_type: 'boolean' },
    { key: 'drug_screen_general', label: 'Drug Screen', data_type: 'boolean' },
    { key: 'drug_screen_type', label: 'Drug Screen Type', data_type: 'single-select' },
    { key: 'background_check', label: 'Background Check', data_type: 'boolean' },
    { key: 'npi_login_information', label: 'NPI Login Information', data_type: 'text' },
    
    // Verifications Section
    { key: 'education', label: 'Education', data_type: 'text' },
    { key: 'work_history', label: 'Work History', data_type: 'text' },
    { key: 'facility_affiliations', label: 'Facility Affiliations', data_type: 'text' },
    { key: 'references', label: 'References', data_type: 'text' },
    { key: 'malpractice_carriers', label: 'Malpractice Carriers', data_type: 'text' },
    { key: 'clinical_activity_procedure_logs', label: 'Clinical Activity/Procedure Logs', data_type: 'text' },
    
    // Supporting Documents Section
    { key: 'medical_school_diploma', label: 'Medical School Diploma', data_type: 'oneview_record' },
    { key: 'internship_certificate', label: 'Internship Certificate', data_type: 'oneview_record' },
    { key: 'residency_certificate', label: 'Residency Certificate', data_type: 'oneview_record' },
    { key: 'fellowship_certificate', label: 'Fellowship Certificate', data_type: 'oneview_record' },
    { key: 'board_certificate', label: 'Board Certificate', data_type: 'oneview_record' },
    { key: 'ecfmg', label: 'ECFMG', data_type: 'oneview_record' },
    { key: 'cmes_supporting', label: 'CMEs', data_type: 'oneview_record' },
    { key: 'state_license', label: 'State License', data_type: 'oneview_record' },
    { key: 'dea', label: 'DEA', data_type: 'oneview_record' },
    { key: 'csp', label: 'CSP', data_type: 'oneview_record' },
    { key: 'life_support_certifications_bls', label: 'Life Support Certifications - BLS', data_type: 'oneview_record' },
    { key: 'life_support_certifications_acls', label: 'Life Support Certifications - ACLS', data_type: 'oneview_record' },
    { key: 'life_support_certifications_pals', label: 'Life Support Certifications - PALS', data_type: 'oneview_record' },
    { key: 'life_support_certifications_atls', label: 'Life Support Certifications - ATLS', data_type: 'oneview_record' },
    { key: 'life_support_certifications_nrp', label: 'Life Support Certifications - NRP', data_type: 'oneview_record' },
    { key: 'life_support_certifications_fluoroscopy', label: 'Life Support Certifications - Fluoroscopy', data_type: 'oneview_record' },
    { key: 'drivers_license', label: 'Driver\'s License', data_type: 'oneview_record' },
    { key: 'passport', label: 'Passport', data_type: 'oneview_record' },
    { key: 'current_cv', label: 'Current CV', data_type: 'oneview_record' },
    { key: 'social_security_card', label: 'Social Security Card', data_type: 'oneview_record' },
    { key: 'dd214', label: 'DD214', data_type: 'oneview_record' },
    { key: 'photo', label: 'Photo', data_type: 'oneview_record' },
    { key: 'ny_infectious_control_certificate', label: 'NY Infectious Control Certificate', data_type: 'oneview_record' },
    { key: 'caqh_username_password', label: 'CAQH Username/Password', data_type: 'text' },
    { key: 'caqh_username_password_request', label: 'CAQH Username/Password Request', data_type: 'boolean' },
    { key: 'procedure_log', label: 'Procedure Log', data_type: 'oneview_record' },
    { key: 'procedure_log_details', label: 'Procedure Log Details', data_type: 'text' },
    
    // Health Documents Section
    { key: 'ppd', label: 'PPD', data_type: 'oneview_record' },
    { key: 'mmr', label: 'MMR', data_type: 'oneview_record' },
    { key: 'varicella', label: 'Varicella', data_type: 'oneview_record' },
    { key: 'flu', label: 'Flu', data_type: 'oneview_record' },
    { key: 'covid', label: 'Covid', data_type: 'oneview_record' },
    { key: 'hep_b', label: 'Hep B', data_type: 'oneview_record' },
    { key: 'tdap', label: 'Tdap', data_type: 'oneview_record' },
    { key: 'drug_screen_health', label: 'Drug Screen', data_type: 'oneview_record' },
    { key: 'physical_exam', label: 'Physical Exam', data_type: 'oneview_record' }
  ];

  const { data: insertedData, error: dataError } = await supabase
    .from('requirement_data')
    .insert(requirementData)
    .select();

  if (dataError) {
    console.error('❌ Error seeding requirement data:', dataError);
    return;
  }

  console.log(`✅ Inserted ${insertedData.length} requirement data items`);
  return insertedData;
}

async function seedRequirements(requirementData: any[]) {
  console.log('🌱 Seeding requirements...');
  
  // Create a map of requirement data by key for easy lookup
  const dataMap = requirementData.reduce((acc, item) => {
    acc[item.key] = item.id;
    return acc;
  }, {} as Record<string, string>);

  const requirements = [
    // General Section
    {
      type: 'facility' as const,
      key: 'malpractice_history',
      group: 'general',
      label: 'Malpractice History',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.malpractice_history]
    },
    {
      type: 'facility' as const,
      key: 'employment_history',
      group: 'general',
      label: 'Employment History',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.employment_history]
    },
    {
      type: 'facility' as const,
      key: 'facility_affiliations_history',
      group: 'general',
      label: 'Facility Affiliations History',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.facility_affiliations_history]
    },
    {
      type: 'facility' as const,
      key: 'peer_references',
      group: 'general',
      label: 'Peer References',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.peer_references]
    },
    {
      type: 'facility' as const,
      key: 'cmes_general',
      group: 'general',
      label: 'CMEs',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.cmes_general]
    },
    {
      type: 'facility' as const,
      key: 'cme_history',
      group: 'general',
      label: 'CME History',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.cme_history]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certification_through_aha',
      group: 'general',
      label: 'Life Support Certification Through AHA',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certification_through_aha]
    },
    {
      type: 'facility' as const,
      key: 'drug_screen_general',
      group: 'general',
      label: 'Drug Screen',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.drug_screen_general]
    },
    {
      type: 'facility' as const,
      key: 'drug_screen_type',
      group: 'general',
      label: 'Drug Screen Type',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.drug_screen_type]
    },
    {
      type: 'facility' as const,
      key: 'background_check',
      group: 'general',
      label: 'Background Check',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.background_check]
    },
    {
      type: 'facility' as const,
      key: 'npi_login_information',
      group: 'general',
      label: 'NPI Login Information',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.npi_login_information]
    },
    
    // Verifications Section
    {
      type: 'facility' as const,
      key: 'education',
      group: 'verifications',
      label: 'Education',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.education]
    },
    {
      type: 'facility' as const,
      key: 'work_history',
      group: 'verifications',
      label: 'Work History',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.work_history]
    },
    {
      type: 'facility' as const,
      key: 'facility_affiliations',
      group: 'verifications',
      label: 'Facility Affiliations',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.facility_affiliations]
    },
    {
      type: 'facility' as const,
      key: 'references',
      group: 'verifications',
      label: 'References',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.references]
    },
    {
      type: 'facility' as const,
      key: 'malpractice_carriers',
      group: 'verifications',
      label: 'Malpractice Carriers',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.malpractice_carriers]
    },
    {
      type: 'facility' as const,
      key: 'clinical_activity_procedure_logs',
      group: 'verifications',
      label: 'Clinical Activity/Procedure Logs',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.clinical_activity_procedure_logs]
    },
    
    // Supporting Documents Section
    {
      type: 'facility' as const,
      key: 'medical_school_diploma',
      group: 'supporting_documents',
      label: 'Medical School Diploma',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.medical_school_diploma]
    },
    {
      type: 'facility' as const,
      key: 'internship_certificate',
      group: 'supporting_documents',
      label: 'Internship Certificate',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.internship_certificate]
    },
    {
      type: 'facility' as const,
      key: 'residency_certificate',
      group: 'supporting_documents',
      label: 'Residency Certificate',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.residency_certificate]
    },
    {
      type: 'facility' as const,
      key: 'fellowship_certificate',
      group: 'supporting_documents',
      label: 'Fellowship Certificate',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.fellowship_certificate]
    },
    {
      type: 'facility' as const,
      key: 'board_certificate',
      group: 'supporting_documents',
      label: 'Board Certificate',
      note: '',
      visible: true,
      required: false,
      credentialing_entities: [],
      data: [dataMap.board_certificate]
    },
    {
      type: 'facility' as const,
      key: 'ecfmg',
      group: 'supporting_documents',
      label: 'ECFMG',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.ecfmg]
    },
    {
      type: 'facility' as const,
      key: 'cmes_supporting',
      group: 'supporting_documents',
      label: 'CMEs',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.cmes_supporting]
    },
    {
      type: 'facility' as const,
      key: 'state_license',
      group: 'supporting_documents',
      label: 'State License',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.state_license]
    },
    {
      type: 'facility' as const,
      key: 'dea',
      group: 'supporting_documents',
      label: 'DEA',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.dea]
    },
    {
      type: 'facility' as const,
      key: 'csp',
      group: 'supporting_documents',
      label: 'CSP',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.csp]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_bls',
      group: 'supporting_documents',
      label: 'Life Support Certifications - BLS',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_bls]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_acls',
      group: 'supporting_documents',
      label: 'Life Support Certifications - ACLS',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_acls]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_pals',
      group: 'supporting_documents',
      label: 'Life Support Certifications - PALS',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_pals]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_atls',
      group: 'supporting_documents',
      label: 'Life Support Certifications - ATLS',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_atls]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_nrp',
      group: 'supporting_documents',
      label: 'Life Support Certifications - NRP',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_nrp]
    },
    {
      type: 'facility' as const,
      key: 'life_support_certifications_fluoroscopy',
      group: 'supporting_documents',
      label: 'Life Support Certifications - Fluoroscopy',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.life_support_certifications_fluoroscopy]
    },
    {
      type: 'facility' as const,
      key: 'drivers_license',
      group: 'supporting_documents',
      label: 'Driver\'s License',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.drivers_license]
    },
    {
      type: 'facility' as const,
      key: 'passport',
      group: 'supporting_documents',
      label: 'Passport',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.passport]
    },
    {
      type: 'facility' as const,
      key: 'current_cv',
      group: 'supporting_documents',
      label: 'Current CV',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.current_cv]
    },
    {
      type: 'facility' as const,
      key: 'social_security_card',
      group: 'supporting_documents',
      label: 'Social Security Card',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.social_security_card]
    },
    {
      type: 'facility' as const,
      key: 'dd214',
      group: 'supporting_documents',
      label: 'DD214',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.dd214]
    },
    {
      type: 'facility' as const,
      key: 'photo',
      group: 'supporting_documents',
      label: 'Photo',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.photo]
    },
    {
      type: 'facility' as const,
      key: 'ny_infectious_control_certificate',
      group: 'supporting_documents',
      label: 'NY Infectious Control Certificate',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.ny_infectious_control_certificate]
    },
    {
      type: 'facility' as const,
      key: 'caqh_username_password',
      group: 'supporting_documents',
      label: 'CAQH Username/Password',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.caqh_username_password]
    },
    {
      type: 'facility' as const,
      key: 'caqh_username_password_request',
      group: 'supporting_documents',
      label: 'CAQH Username/Password Request',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.caqh_username_password_request]
    },
    {
      type: 'facility' as const,
      key: 'procedure_log',
      group: 'supporting_documents',
      label: 'Procedure Log',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.procedure_log]
    },
    {
      type: 'facility' as const,
      key: 'procedure_log_details',
      group: 'supporting_documents',
      label: 'Procedure Log Details',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.procedure_log_details]
    },
    
    // Health Documents Section
    {
      type: 'facility' as const,
      key: 'ppd',
      group: 'health_documents',
      label: 'PPD',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.ppd]
    },
    {
      type: 'facility' as const,
      key: 'mmr',
      group: 'health_documents',
      label: 'MMR',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.mmr]
    },
    {
      type: 'facility' as const,
      key: 'varicella',
      group: 'health_documents',
      label: 'Varicella',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.varicella]
    },
    {
      type: 'facility' as const,
      key: 'flu',
      group: 'health_documents',
      label: 'Flu',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.flu]
    },
    {
      type: 'facility' as const,
      key: 'covid',
      group: 'health_documents',
      label: 'Covid',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.covid]
    },
    {
      type: 'facility' as const,
      key: 'hep_b',
      group: 'health_documents',
      label: 'Hep B',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.hep_b]
    },
    {
      type: 'facility' as const,
      key: 'tdap',
      group: 'health_documents',
      label: 'Tdap',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.tdap]
    },
    {
      type: 'facility' as const,
      key: 'drug_screen_health',
      group: 'health_documents',
      label: 'Drug Screen',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.drug_screen_health]
    },
    {
      type: 'facility' as const,
      key: 'physical_exam',
      group: 'health_documents',
      label: 'Physical Exam',
      note: '',
      visible: true,
      required: true,
      credentialing_entities: [],
      data: [dataMap.physical_exam]
    }
  ];

  const { data: insertedRequirements, error: requirementsError } = await supabase
    .from('requirements')
    .insert(requirements)
    .select();

  if (requirementsError) {
    console.error('❌ Error seeding requirements:', requirementsError);
    return;
  }

  console.log(`✅ Inserted ${insertedRequirements.length} requirements`);
  return insertedRequirements;
}

async function main() {
  try {
    console.log('🚀 Starting requirements clear and reseed...');

    // Clear existing data
    await clearRequirements();

    // Seed requirement data first
    const requirementData = await seedRequirementData();
    if (!requirementData) {
      console.error('❌ Failed to seed requirement data, aborting...');
      return;
    }

    // Seed requirements
    await seedRequirements(requirementData);

    console.log('🎉 Requirements clear and reseed completed successfully!');

    // Test the data
    console.log('🔍 Testing requirements...');
    const { data: testData, error: testError } = await supabase
      .from('requirements')
      .select('key, label, group, required, note')
      .order('group, label');

    if (testError) {
      console.error('❌ Error testing data:', testError);
    } else {
      console.log('✅ Test successful, requirements:');
      console.log(JSON.stringify(testData, null, 2));
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the script
main().then(() => {
  console.log('🏁 Requirements clear and reseed script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedRequirementData() {
  console.log('🌱 Seeding requirement_data table...');

  const requirementDataItems = [
    {
      label: 'License Number Format',
      value: '^[A-Z]{2}-[0-9]{6}$',
      data_type: 'text' as const,
      key: 'license_number_format'
    },
    {
      label: 'Minimum Staff Count',
      value: '10',
      data_type: 'number' as const,
      key: 'min_staff_count'
    },
    {
      label: 'Required Certifications',
      value: 'RN,MD,NP,PA',
      data_type: 'multi-select' as const,
      key: 'required_certifications'
    },
    {
      label: 'Facility Size Minimum',
      value: '5000',
      data_type: 'number' as const,
      key: 'facility_size_min_sqft'
    },
    {
      label: 'Safety Equipment Required',
      value: 'fire_alarms,emergency_lights,sprinklers,first_aid_kits',
      data_type: 'multi-select' as const,
      key: 'safety_equipment_required'
    },
    {
      label: 'Medical Equipment Standards',
      value: 'monitors,ventilators,defibrillators,imaging_equipment',
      data_type: 'multi-select' as const,
      key: 'medical_equipment_standards'
    },
    {
      label: 'Board Exam Passing Score',
      value: '75',
      data_type: 'number' as const,
      key: 'board_exam_passing_score'
    },
    {
      label: 'Continuing Education Hours',
      value: '50',
      data_type: 'number' as const,
      key: 'continuing_education_hours'
    },
    {
      label: 'Recertification Period',
      value: '5',
      data_type: 'number' as const,
      key: 'recertification_period_years'
    },
    {
      label: 'Documentation Requirements',
      value: 'license_certificate,continuing_education_proof,background_check,references',
      data_type: 'multi-select' as const,
      key: 'documentation_requirements'
    }
  ];

  const { data: insertedData, error: dataError } = await supabase
    .from('requirement_data')
    .insert(requirementDataItems)
    .select();

  if (dataError) {
    console.error('❌ Error seeding requirement_data:', dataError);
    return;
  }

  console.log(`✅ Inserted ${insertedData.length} requirement_data items`);
  return insertedData;
}

async function seedRequirements(requirementDataItems: any[]) {
  console.log('🌱 Seeding requirements table...');

  const requirements = [
    {
      type: 'facility' as const,
      key: 'facility_licensing_requirements',
      group: 'licensing',
      label: 'Facility Licensing Requirements',
      note: 'Requirements for facility licensing and certification',
      visible: true,
      required: true,
      credentialing_entity: null, // Will be set when linked to actual facility affiliations
      data: [requirementDataItems[0].id, requirementDataItems[1].id, requirementDataItems[2].id, requirementDataItems[3].id]
    },
    {
      type: 'facility' as const,
      key: 'facility_safety_standards',
      group: 'safety',
      label: 'Facility Safety Standards',
      note: 'Safety and compliance standards for healthcare facilities',
      visible: true,
      required: true,
      credentialing_entity: null,
      data: [requirementDataItems[4].id]
    },
    {
      type: 'facility' as const,
      key: 'facility_equipment_requirements',
      group: 'equipment',
      label: 'Facility Equipment Requirements',
      note: 'Required equipment and technology for facilities',
      visible: true,
      required: false,
      credentialing_entity: null,
      data: [requirementDataItems[5].id]
    },
    {
      type: 'board' as const,
      key: 'board_certification_requirements',
      group: 'certification',
      label: 'Board Certification Requirements',
      note: 'Requirements for board certification of medical professionals',
      visible: true,
      required: true,
      credentialing_entity: null,
      data: [requirementDataItems[6].id]
    },
    {
      type: 'board' as const,
      key: 'board_continuing_education',
      group: 'education',
      label: 'Board Continuing Education Requirements',
      note: 'Continuing education requirements for board certification',
      visible: true,
      required: true,
      credentialing_entity: null,
      data: [requirementDataItems[7].id]
    },
    {
      type: 'board' as const,
      key: 'board_examination_standards',
      group: 'examination',
      label: 'Board Examination Standards',
      note: 'Standards and requirements for board examinations',
      visible: true,
      required: true,
      credentialing_entity: null,
      data: [requirementDataItems[8].id]
    },
    {
      type: 'facility' as const,
      key: 'facility_staffing_requirements',
      group: 'staffing',
      label: 'Facility Staffing Requirements',
      note: 'Staffing and personnel requirements for facilities',
      visible: true,
      required: false,
      credentialing_entity: null,
      data: [requirementDataItems[9].id]
    },
    {
      type: 'board' as const,
      key: 'board_recertification_process',
      group: 'recertification',
      label: 'Board Recertification Process',
      note: 'Process and requirements for board recertification',
      visible: true,
      required: false,
      credentialing_entity: null,
      data: [requirementDataItems[0].id, requirementDataItems[1].id, requirementDataItems[4].id]
    }
  ];

  const { data: insertedRequirements, error: reqError } = await supabase
    .from('requirements')
    .insert(requirements)
    .select();

  if (reqError) {
    console.error('❌ Error seeding requirements:', reqError);
    return;
  }

  console.log(`✅ Inserted ${insertedRequirements.length} requirements`);
  return insertedRequirements;
}

async function main() {
  try {
    console.log('🚀 Starting requirements seeding...');

    // First seed requirement_data
    const requirementDataItems = await seedRequirementData();
    if (!requirementDataItems) {
      console.error('❌ Failed to seed requirement_data, aborting...');
      return;
    }

    // Then seed requirements with references to requirement_data
    await seedRequirements(requirementDataItems);

    console.log('🎉 Requirements seeding completed successfully!');

    // Test the view
    console.log('🔍 Testing requirements_with_data view...');
    const { data: viewData, error: viewError } = await supabase
      .from('requirements_with_data')
      .select('*')
      .limit(3);

    if (viewError) {
      console.error('❌ Error testing view:', viewError);
    } else {
      console.log('✅ View test successful, sample data:');
      console.log(JSON.stringify(viewData, null, 2));
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
main().then(() => {
  console.log('🏁 Seeding script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 
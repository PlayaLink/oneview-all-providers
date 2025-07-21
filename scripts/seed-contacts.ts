import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedContacts() {
  console.log('🌱 Seeding contacts table...');

  // First, get a facility ID to use for the contacts
  const { data: facilities, error: facilityError } = await supabase
    .from('facilities')
    .select('id')
    .limit(1);

  if (facilityError) {
    console.error('❌ Error fetching facilities:', facilityError);
    return;
  }

  if (!facilities || facilities.length === 0) {
    console.error('❌ No facilities found. Please seed facilities first.');
    return;
  }

  const facilityId = facilities[0].id;

  const contacts = [
    {
      facility_id: facilityId,
      type: 'credentialing' as const,
      first_name: 'Brooke',
      last_name: 'Nuñez',
      job_title: 'Registration Program Specialist',
      department: 'Human Resources',
      restrictions: 'Manager Approval Required',
      preferred_contact_method: 'phone' as const,
      email: 'brooke.nunez@blueridgehospital.com',
      phone: '(714) 674-8302',
      fax: '(714) 674-3673',
      notes: '**Helped me find a person with authorization to process an emergency file when Ms. Horn was out of the office'
    },
    {
      facility_id: facilityId,
      type: 'billing' as const,
      first_name: 'Sarah',
      last_name: 'Johnson',
      job_title: 'Billing Manager',
      department: 'Finance',
      restrictions: null,
      preferred_contact_method: 'email' as const,
      email: 'sarah.johnson@blueridgehospital.com',
      phone: '(714) 674-8303',
      fax: '(714) 674-3674',
      notes: 'Primary billing contact for all provider enrollment questions'
    },
    {
      facility_id: facilityId,
      type: 'emergency' as const,
      first_name: 'Michael',
      last_name: 'Chen',
      job_title: 'Emergency Department Director',
      department: 'Emergency Medicine',
      restrictions: null,
      preferred_contact_method: 'phone' as const,
      email: 'michael.chen@blueridgehospital.com',
      phone: '(714) 674-8304',
      fax: '(714) 674-3675',
      notes: 'Available 24/7 for emergency credentialing issues'
    },
    {
      facility_id: facilityId,
      type: 'administrative' as const,
      first_name: 'Jennifer',
      last_name: 'Williams',
      job_title: 'Administrative Coordinator',
      department: 'Administration',
      restrictions: null,
      preferred_contact_method: 'email' as const,
      email: 'jennifer.williams@blueridgehospital.com',
      phone: '(714) 674-8305',
      fax: '(714) 674-3676',
      notes: 'Handles general administrative inquiries and scheduling'
    },
    {
      facility_id: facilityId,
      type: 'clinical' as const,
      first_name: 'Dr. Robert',
      last_name: 'Martinez',
      job_title: 'Chief Medical Officer',
      department: 'Medical Staff',
      restrictions: 'Appointment Required',
      preferred_contact_method: 'email' as const,
      email: 'robert.martinez@blueridgehospital.com',
      phone: '(714) 674-8306',
      fax: '(714) 674-3677',
      notes: 'Clinical leadership contact for medical staff issues'
    },
    {
      facility_id: facilityId,
      type: 'technical' as const,
      first_name: 'David',
      last_name: 'Thompson',
      job_title: 'IT Systems Administrator',
      department: 'Information Technology',
      restrictions: null,
      preferred_contact_method: 'email' as const,
      email: 'david.thompson@blueridgehospital.com',
      phone: '(714) 674-8307',
      fax: '(714) 674-3678',
      notes: 'Technical support for credentialing software and systems'
    },
    {
      facility_id: facilityId,
      type: 'general' as const,
      first_name: 'Lisa',
      last_name: 'Anderson',
      job_title: 'Receptionist',
      department: 'Front Desk',
      restrictions: null,
      preferred_contact_method: 'phone' as const,
      email: 'lisa.anderson@blueridgehospital.com',
      phone: '(714) 674-8308',
      fax: '(714) 674-3679',
      notes: 'General inquiries and appointment scheduling'
    }
  ];

  const { data: insertedContacts, error: contactError } = await supabase
    .from('contacts')
    .insert(contacts)
    .select();

  if (contactError) {
    console.error('❌ Error seeding contacts:', contactError);
    return;
  }

  console.log(`✅ Inserted ${insertedContacts.length} contacts`);
  console.log('📋 Sample contacts created:');
  insertedContacts.forEach(contact => {
    console.log(`  - ${contact.first_name} ${contact.last_name} (${contact.type})`);
  });
}

// Run the seeding function
seedContacts().catch(console.error); 
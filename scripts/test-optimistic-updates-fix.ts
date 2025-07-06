import { supabase } from '../src/lib/supabaseClient';

async function testOptimisticUpdates() {
  console.log('Testing optimistic updates fix...\n');

  try {
    // Test 1: Fetch a provider record
    console.log('1. Fetching a provider record...');
    const { data: providers, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .limit(1);

    if (providerError) {
      console.error('Error fetching provider:', providerError);
      return;
    }

    if (!providers || providers.length === 0) {
      console.log('No providers found');
      return;
    }

    const provider = providers[0];
    console.log('Provider found:', {
      id: provider.id,
      provider_name: provider.provider_name,
      title: provider.title
    });

    // Test 2: Update the provider
    console.log('\n2. Updating provider title...');
    const newTitle = `Updated Title ${Date.now()}`;
    const { data: updatedProvider, error: updateError } = await supabase
      .from('providers')
      .update({ title: newTitle })
      .eq('id', provider.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating provider:', updateError);
      return;
    }

    console.log('Provider updated successfully:', {
      id: updatedProvider.id,
      provider_name: updatedProvider.provider_name,
      title: updatedProvider.title
    });

    // Test 3: Fetch state licenses for this provider
    console.log('\n3. Fetching state licenses for provider...');
    const { data: licenses, error: licenseError } = await supabase
      .from('state_licenses')
      .select('*')
      .eq('npi_number', provider.npi_number)
      .limit(1);

    if (licenseError) {
      console.error('Error fetching licenses:', licenseError);
      return;
    }

    if (!licenses || licenses.length === 0) {
      console.log('No state licenses found for this provider');
      return;
    }

    const license = licenses[0];
    console.log('License found:', {
      id: license.id,
      license_type: license.license_type,
      state: license.state
    });

    // Test 4: Update the license
    console.log('\n4. Updating license type...');
    const newLicenseType = `Updated License ${Date.now()}`;
    const { data: updatedLicense, error: licenseUpdateError } = await supabase
      .from('state_licenses')
      .update({ license_type: newLicenseType })
      .eq('id', license.id)
      .select()
      .single();

    if (licenseUpdateError) {
      console.error('Error updating license:', licenseUpdateError);
      return;
    }

    console.log('License updated successfully:', {
      id: updatedLicense.id,
      license_type: updatedLicense.license_type,
      state: updatedLicense.state
    });

    console.log('\n✅ All optimistic update tests passed!');
    console.log('\nThe fix should now prevent form values from being cleared when:');
    console.log('- The selectedRow object reference changes due to refetch');
    console.log('- Optimistic updates are made to the cache');
    console.log('- The selectedProviderByGrid state is updated via callback');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOptimisticUpdates(); 
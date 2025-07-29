// AG Grid Enterprise License Configuration
import { LicenseManager } from 'ag-grid-enterprise';
import { ModuleRegistry, AllCommunityModule, AllEnterpriseModule } from 'ag-grid-enterprise';

// Register all AG Grid modules
ModuleRegistry.registerModules([
  AllCommunityModule,
  AllEnterpriseModule
]);

// Set the license key for AG Grid Enterprise
LicenseManager.setLicenseKey(
  '[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-090575}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{14 August 2025}____[v3]_[0102]_MTc1NTEyNjAwMDAwMA==2bf724e243e12a2673a0da27840ab6db'
);

export default LicenseManager; 
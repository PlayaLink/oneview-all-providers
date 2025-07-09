import { notesTab } from './Notes';
import { documentsTab } from './DocumentsGrid';

export const sharedTabs = [notesTab, documentsTab];
export const sharedTabsById = Object.fromEntries(sharedTabs.map(tab => [tab.id, tab])); 
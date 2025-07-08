# Semantic Markup Improvements

This document outlines all the semantic markup improvements made to the application to enhance accessibility, improve DOM inspection, and establish a common language for referring to different parts of the app.

## Overview

The improvements include:
- **Semantic HTML elements** (nav, main, aside, header, footer, section, etc.)
- **ARIA attributes** (role, aria-label, aria-labelledby, aria-expanded, etc.)
- **Data test IDs** for easy element identification and testing
- **Proper form labels and associations**
- **Keyboard navigation support**

## Components Updated

### 1. MainLayout.tsx
- **User Profile Toggle**: Added `role="button"`, `aria-label`, `aria-expanded`, `aria-haspopup`, `data-testid="user-profile-toggle"`
- **Logout Button**: Added `aria-label="Logout from application"`, `data-testid="logout-button"`
- **Main Content Area**: Added `role="main"`, `aria-label="Main Content Area"`, `data-testid="main-content-area"`
- **Sidebar Navigation**: Added `role="complementary"`, `aria-label="Sidebar navigation"`, `data-testid="sidebar-navigation"`
- **Sidebar Toggle**: Added `aria-label`, `aria-expanded`, `data-testid="sidebar-toggle"`
- **Content Area**: Added `role="region"`, `aria-label="Content area"`, `data-testid="content-area"`

### 2. PageHeader.tsx
- **Clear Search Button**: Added `data-testid="clear-search-button"`
- **Provider Search Input**: Enhanced with `role="combobox"`, `aria-expanded`, `aria-autocomplete`, `aria-controls`, `aria-activedescendant`
- **Provider Search Results**: Added `role="listbox"`, `aria-label="Provider search results"`
- **Provider Options**: Added `role="option"`, `aria-selected`, `data-testid`
- **Add Provider Button**: Added `aria-label`, `data-testid="add-provider-button"`

### 3. SideNav.tsx
- **All Sections Button**: Added `role="button"`, `aria-label`, `aria-pressed`, `data-testid="all-sections-button"`
- **Section Headers**: Added `role="group"`, `aria-label`
- **Section Buttons**: Added `role="button"`, `aria-label`, `aria-pressed`, `data-testid`
- **Section Toggle Buttons**: Added `aria-label`, `aria-expanded`, `data-testid`
- **Grid Buttons**: Added `role="button"`, `aria-label`, `aria-pressed`, `data-testid`

### 4. SettingsDropdown.tsx
- **Settings Trigger**: Added `aria-label`, `aria-expanded`, `aria-haspopup`, `data-testid="settings-dropdown-trigger"`
- **Grid Section Mode Select**: Added `aria-label`, `data-testid="grid-section-mode-select"`

### 5. TextInputField.tsx
- **Input Labels**: Added `htmlFor` attribute for proper label association
- **Input Fields**: Added `id`, `aria-label`, `data-testid`
- **Copy Buttons**: Added `aria-label`, `data-testid`

### 6. SingleSelect.tsx
- **Select Button**: Added `role="button"`, `aria-label`, `aria-expanded`, `aria-haspopup`, `data-testid`
- **Dropdown List**: Added `role="listbox"`, `aria-label`, `data-testid`
- **Dropdown Options**: Added `role="option"`, `aria-selected`, `data-testid`
- **Copy Buttons**: Added `aria-label`, `data-testid`
- **Clear Buttons**: Added `aria-label`, `data-testid`

### 7. MultiSelect.tsx
- **Add Button**: Added `aria-label`, `aria-expanded`, `aria-haspopup`, `data-testid`
- **Copy Button**: Added `aria-label`, `data-testid`

### 8. DocumentsGrid.tsx
- **Document Links**: Added `aria-label`, `data-testid`
- **Action Buttons**: Added `role="group"`, `aria-label`, `data-testid` for edit and delete buttons

### 9. MainContent.tsx
- **Navigation Buttons**: Added `data-testid` for previous and next grid buttons
- **Main Content**: Added `role="region"`, `aria-label`, `data-testid="main-content"`
- **Grid Scroll Container**: Added `role="grid-scroll-container"`, `aria-label`
- **Grid Scroll Navigation**: Added `role="grid-scroll-navigation"`, `aria-label`

### 10. DataGrid.tsx
- **Grid Section**: Added `role="region"`, `aria-label`, `data-testid="data-grid"`
- **Status Indicators**: Added `role="group"`, `aria-label`, `role="status"`
- **Toggle Switch**: Added `role="switch"`, `aria-label`, `aria-checked`
- **Grid Container**: Added `role="grid"`, `aria-label`, `aria-rowcount`, `aria-colcount`, `data-testid="ag-grid-container"`

### 11. Tag.tsx
- **Remove Buttons**: Added `aria-label`, `data-testid`

### 12. FileDropzone.tsx
- **Dropzone Area**: Added `role="button"`, `tabIndex`, `aria-label`, `aria-describedby`
- **Description**: Added `id` for association with `aria-describedby`

### 13. SectionsDropdown.tsx
- **Dropdown Menu**: Added `role="dialog"`, `aria-label`, `aria-modal`, `data-testid="sections-dropdown-menu"`
- **Search Input**: Added `aria-label`, `data-testid="sections-search-input"`
- **Remove Buttons**: Added `data-testid`
- **Group Checkboxes**: Added `aria-label`, `data-testid`
- **Grid Checkboxes**: Added `aria-label`, `data-testid`
- **Clear Button**: Added `aria-label`, `data-testid="clear-sections-button"`
- **Dropdown Button**: Added `aria-haspopup`, `aria-expanded`, `aria-label`, `data-testid="sections-dropdown-button"`

### 14. CollapsibleSection.tsx
- **Section**: Added `role="region"`, `aria-labelledby`, `data-testid="collapsible-section"`
- **Header**: Added `role="button"`, `tabIndex`, `aria-expanded`, `aria-controls`, `aria-label`, `data-testid="collapsible-section-header"`
- **Content**: Added `role="region"`, `aria-labelledby`, `data-testid="collapsible-section-content"`

### 15. SidePanel.tsx
- **Panel**: Added `role="dialog"`, `aria-modal`, `aria-label`, `data-testid="side-panel"`
- **Resize Handle**: Added `role="separator"`, `aria-label`, `aria-orientation`, `data-testid="side-panel-resize-handle"`
- **Header**: Added `data-testid="side-panel-header"`
- **Close Button**: Added `aria-label`
- **Tabs**: Added `data-testid="side-panel-tabs"`
- **Tab List**: Added `data-testid="side-panel-tabs-list"`
- **Tab Panels**: Added `role="tabpanel"`, `aria-label`, `data-testid`
- **Footer**: Added `data-testid="side-panel-footer"`
- **Action Buttons**: Added `aria-label`, `data-testid`, `role="button"`

## Data Test ID Naming Convention

The following naming convention is used for `data-testid` attributes:

- **Component-specific**: `{component-name}-{action/element}`
  - Example: `user-profile-toggle`, `sidebar-toggle`
- **Form inputs**: `{input-type}-{label}`
  - Example: `text-input-first-name`, `single-select-prefix`
- **Buttons**: `{action}-{context}`
  - Example: `add-provider-button`, `clear-search-button`
- **Grid elements**: `{element-type}-{identifier}`
  - Example: `grid-button-provider-info`, `section-button-licenses`
- **Document actions**: `{action}-{type}-{id}`
  - Example: `edit-document-123`, `delete-document-456`

## ARIA Attributes Used

- **role**: button, dialog, listbox, option, region, separator, switch, tab, tabpanel, etc.
- **aria-label**: Descriptive labels for elements
- **aria-labelledby**: References to element IDs that provide labels
- **aria-expanded**: Indicates expandable state
- **aria-haspopup**: Indicates presence of popup menu
- **aria-pressed**: Indicates pressed state for toggle buttons
- **aria-selected**: Indicates selection state
- **aria-controls**: References controlled elements
- **aria-describedby**: References descriptive text
- **aria-modal**: Indicates modal dialog
- **aria-checked**: Indicates checked state for checkboxes/radio buttons
- **aria-orientation**: Indicates orientation for separators

## Benefits

1. **Accessibility**: Screen readers can properly navigate and understand the application
2. **DOM Inspection**: Easy identification of elements in browser dev tools
3. **Testing**: Consistent test IDs for automated testing
4. **Communication**: Common language for referring to UI elements
5. **Keyboard Navigation**: Proper focus management and keyboard interaction
6. **Semantic Structure**: Clear hierarchy and relationships between elements

## Testing

All interactive elements can now be easily targeted in tests using the `data-testid` attributes:

```javascript
// Example test selectors
cy.get('[data-testid="user-profile-toggle"]').click();
cy.get('[data-testid="add-provider-button"]').should('be.visible');
cy.get('[data-testid="text-input-first-name"]').type('John');
cy.get('[data-testid="single-select-prefix"]').click();
```

## Future Improvements

Consider adding:
- **Live regions** for dynamic content updates
- **Skip links** for keyboard navigation
- **Focus indicators** for better visual feedback
- **Error announcements** for form validation
- **Loading states** with appropriate ARIA attributes 
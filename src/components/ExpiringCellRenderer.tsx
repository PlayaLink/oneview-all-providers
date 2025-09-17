import React from 'react';

interface ExpiringCellRendererProps {
  value: any;
  data: any;
  colDef: any;
  expiringDaysFilter: number;
}

const ExpiringCellRenderer: React.FC<ExpiringCellRendererProps> = ({ 
  value, 
  data, 
  expiringDaysFilter 
}) => {
  // Function to check if a record is expiring within the selected timeframe
  const isRecordExpiring = React.useCallback((rowData: any) => {
    if (!rowData) return false;
    
    const expirationDate = rowData.expiration_date || rowData.expires_within || rowData.end_date || rowData.expiry_date;
    if (!expirationDate) return false;
    
    try {
      const expDate = new Date(expirationDate);
      const now = new Date();
      
      // Check if the date is valid
      if (isNaN(expDate.getTime())) return false;
      
      // Check if not expired and expiring within selected days
      if (expDate > now) {
        const daysFromNow = new Date();
        daysFromNow.setDate(daysFromNow.getDate() + expiringDaysFilter);
        return expDate <= daysFromNow;
      }
    } catch (error) {
      // Warning: Error parsing expiration date
      return false;
    }
    
    return false;
  }, [expiringDaysFilter]);

  const isExpiring = isRecordExpiring(data);

  // Format the value if it's a date
  const formatValue = (val: any) => {
    if (!val) return '-';
    
    // If it's a date string, format it
    if (typeof val === 'string' && (val.includes('-') || val.includes('/'))) {
      try {
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (error) {
        // If parsing fails, return the original value
      }
    }
    
    return val;
  };

  const formattedValue = formatValue(value);

  if (!value) {
    return <span className="text-gray-400">-</span>;
  }

  if (isExpiring) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{formattedValue}</span>
        <span 
          className="inline-flex items-center px-2.5 py-0.5 bg-orange-500 rounded-full text-white font-semibold text-xs"
          data-testid="expiring-pill"
          role="status"
          aria-label="Record is expiring"
        >
          Expiring
        </span>
      </div>
    );
  }

  return <span className="text-sm">{formattedValue}</span>;
};

export default ExpiringCellRenderer; 
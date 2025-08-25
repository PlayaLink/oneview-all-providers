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
  // Function to calculate days until expiration
  const calculateDaysUntilExpiration = React.useCallback((rowData: any) => {
    if (!rowData) return null;
    
    // Look for expiration date in various possible fields
    // For state licenses, the primary field is usually 'expiration_date'
    const expirationDate = rowData.expiration_date || rowData.expires_within || rowData.end_date || rowData.expiry_date;
    if (!expirationDate) return null;
    
    try {
      const expDate = new Date(expirationDate);
      const now = new Date();
      
      // Check if the date is valid
      if (isNaN(expDate.getTime())) return null;
      
      // Calculate days difference
      const timeDiff = expDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return daysDiff;
    } catch (error) {
      console.warn("Error parsing expiration date:", expirationDate, error);
      return null;
    }
  }, []);

  // Function to check if a record is expiring within the selected timeframe
  const isRecordExpiring = React.useCallback((rowData: any) => {
    const daysUntilExpiration = calculateDaysUntilExpiration(rowData);
    if (daysUntilExpiration === null) return false;
    
    // Check if not expired and expiring within selected days
    return daysUntilExpiration >= 0 && daysUntilExpiration <= expiringDaysFilter;
  }, [expiringDaysFilter, calculateDaysUntilExpiration]);

  const daysUntilExpiration = calculateDaysUntilExpiration(data);
  const isExpiring = isRecordExpiring(data);

  // Debug logging for troubleshooting
  React.useEffect(() => {
    if (data && (data.expiration_date || data.expires_within || data.end_date || data.expiry_date)) {
      console.log('ExpiringCellRenderer debug:', {
        rowData: data,
        expirationDate: data.expiration_date || data.expires_within || data.end_date || data.expiry_date,
        calculatedDays: daysUntilExpiration,
        isExpiring
      });
    }
  }, [data, daysUntilExpiration, isExpiring]);

  // Format the display value
  const formatDisplayValue = () => {
    if (daysUntilExpiration === null) return '-';
    
    if (daysUntilExpiration < 0) {
      return `${Math.abs(daysUntilExpiration)} days ago`;
    } else if (daysUntilExpiration === 0) {
      return 'Expires today';
    } else if (daysUntilExpiration === 1) {
      return 'Expires tomorrow';
    } else {
      return `${daysUntilExpiration} days`;
    }
  };

  const displayValue = formatDisplayValue();

  if (daysUntilExpiration === null) {
    return <span className="text-gray-400">-</span>;
  }

  if (isExpiring) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{displayValue}</span>
        <span 
          className="inline-flex items-center px-2.5 py-0.5 bg-[#F48100] rounded-full text-white font-semibold text-xs"
          data-testid="expiring-pill"
          role="status"
          aria-label="Record is expiring"
        >
          Expiring
        </span>
      </div>
    );
  }

  // Show expired records in red
  if (daysUntilExpiration < 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{displayValue}</span>
        <span 
          className="inline-flex items-center px-2.5 py-0.5 bg-red-600 rounded-full text-white font-semibold text-xs"
          role="status"
          aria-label="Record has expired"
        >
          Expired
        </span>
      </div>
    );
  }

  return <span className="text-sm">{displayValue}</span>;
};

export default ExpiringCellRenderer; 
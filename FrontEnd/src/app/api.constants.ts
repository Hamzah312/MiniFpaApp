export const API_BASE_URL = 'http://localhost:5000/api';

export const API = {
  // Financial Records
  FINANCE_UPLOAD: `${API_BASE_URL}/finance/upload`,
  FINANCE_RECORDS: `${API_BASE_URL}/finance`,
  FINANCE_BY_TYPE: (type: string) => `${API_BASE_URL}/finance/type/${type}`,
  
  // Scenarios
  SCENARIOS_CLONE: `${API_BASE_URL}/scenarios/clone`,
  
  // Records
  RECORDS_AUDIT: (recordId: number) => `${API_BASE_URL}/records/${recordId}/audit`,
  
  // Reports
  REPORTS_LATEST: `${API_BASE_URL}/reports/latest`,
  REPORTS_DRILLDOWN: `${API_BASE_URL}/reports/drilldown`,
  REPORTS_SUMMARY: `${API_BASE_URL}/reports/summary`,
  REPORTS_MONTHLY: `${API_BASE_URL}/reports/monthly`,
  REPORTS_COMPARE: `${API_BASE_URL}/reports/compare`,
  
  // Lookup
  LOOKUP_FX_RATES: `${API_BASE_URL}/lookup/fx-rates`,
  LOOKUP_FX_RATE: (fromCurrency: string, toCurrency: string, period: string) => 
    `${API_BASE_URL}/lookup/fxrates/${fromCurrency}/${toCurrency}/${period}`,
  LOOKUP_ACCOUNT_MAPS: `${API_BASE_URL}/lookup/account-maps`,
  LOOKUP_ACCOUNT_MAP: (accountCode: string) => `${API_BASE_URL}/lookup/account-maps/${accountCode}`,
};

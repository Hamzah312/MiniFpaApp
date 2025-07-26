export const API_BASE_URL = 'http://localhost:5210/api';

export const API = {
  UPLOAD: `${API_BASE_URL}/finance/upload`,
  Records:`${API_BASE_URL}/finance`,
  Scenarios:`${API_BASE_URL}/Scenarios`,
  ScenariosClone:`${API_BASE_URL}/Scenarios/clone`,
  ReportsByScenario: (scenario: string) => `${API_BASE_URL}/Reports/summary?scenario=${scenario}`,
  LookupAM:`${API_BASE_URL}/Lookup/account-maps`,
  LookupFX:`${API_BASE_URL}/Lookup/fx-rates`,
};

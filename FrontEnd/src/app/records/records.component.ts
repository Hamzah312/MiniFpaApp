import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';
import {API} from '../api.constants';

interface FinancialRecord {
  id: number;
  scenario: string;
  version: string;
  account: string;
  period: string;
  amount: number;
  currency: string;
  uploadDate: string;
  department?: string;
  year?: number;
  month?: number;
  type?: string;
}

interface ChangeHistory {
  id: string;
  recordId: number;
  action: string;
  userName: string;
  timestamp: string;
  financialRecord?: any;
}

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss'
})
export class RecordsComponent implements OnInit {
  filterForm: FormGroup;
  records = signal<FinancialRecord[]>([]);
  auditTrail = signal<ChangeHistory[]>([]);
  isLoading = signal(false);
  isLoadingAudit = signal(false);
  displayedColumns = ['scenario', 'version', 'account', 'period', 'amount', 'currency', 'department', 'type', 'actions'];
  auditColumns = ['action', 'userName', 'timestamp'];
  selectedRecordId = signal<number | null>(null);
  
  // Options for all dropdowns
  scenarioOptions = signal<string[]>([]);
  accountOptions = signal<string[]>([]);
  typeOptions = signal<string[]>([]);
  departmentOptions = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      scenario: [''],
      account: [''],
      type: [''],
      department: ['']
    });
  }

  ngOnInit() {
    // Load some sample data by default
    this.loadRecords();
    this.loadFilterOptions();
  }

  loadFilterOptions() {
    // Load unique scenarios, accounts, types, and departments from all records
    this.http.get<FinancialRecord[]>(API.FINANCE_RECORDS)
      .subscribe({
        next: (data) => {
          const scenarios = [...new Set(data.map(r => r.scenario).filter((s): s is string => Boolean(s)))].sort();
          const accounts = [...new Set(data.map(r => r.account).filter((a): a is string => Boolean(a)))].sort();
          const types = [...new Set(data.map(r => r.type).filter((t): t is string => Boolean(t)))].sort();
          const departments = [...new Set(data.map(r => r.department).filter((d): d is string => Boolean(d)))].sort();
          
          this.scenarioOptions.set(scenarios);
          this.accountOptions.set(accounts);
          this.typeOptions.set(types);
          this.departmentOptions.set(departments);
          
          console.log('Filter options loaded:', {
            scenarios: scenarios.length,
            accounts: accounts.length,
            types: types.length,
            departments: departments.length
          });
        },
        error: (error) => {
          console.error('Error loading filter options:', error);
          // Set some default options
          this.scenarioOptions.set(['Default', 'budget', 'TestScenario', 'OptimisticBudget']);
          this.accountOptions.set(['1000-SALES', '2000-MARKET', '3000-TECH']);
          this.typeOptions.set(['Actual', 'Budget']);
          this.departmentOptions.set(['Sales', 'Marketing', 'IT']);
        }
      });
  }

  loadRecords() {
    this.isLoading.set(true);
    const { scenario, account, type, department } = this.filterForm.value;

    // Build query parameters for filtering
    const params = new URLSearchParams();
    if (scenario) params.append('scenario', scenario);
    if (account) params.append('account', account);
    if (type) params.append('type', type);
    if (department) params.append('department', department);

    // Use the main API endpoint with query parameters
    let url = API.FINANCE_RECORDS;
    if (params.toString()) {
      url += '?' + params.toString();
    }

    console.log('Loading records with URL:', url);

    this.http.get<FinancialRecord[]>(url)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.records.set(data);
          this.snackBar.open(`Loaded ${data.length} records`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error loading records:', error);
          this.snackBar.open('Failed to load records', 'Close', { duration: 3000 });
          // Show mock data for demo purposes
          this.showMockData();
        }
      });
  }

  clearFilters() {
    this.filterForm.reset();
    this.loadRecords();
  }

  loadAuditTrail(recordId: number) {
    this.isLoadingAudit.set(true);
    this.selectedRecordId.set(recordId);
    
    console.log('Loading audit trail for record:', recordId);

    this.http.get<ChangeHistory[]>(API.RECORDS_AUDIT(recordId))
      .pipe(finalize(() => this.isLoadingAudit.set(false)))
      .subscribe({
        next: (data) => {
          console.log('Audit trail data received:', data);
          this.auditTrail.set(data);
          this.snackBar.open(`Loaded ${data.length} audit entries`, 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error loading audit trail:', error);
          this.snackBar.open('Failed to load audit trail', 'Close', { duration: 3000 });
          // Clear audit trail on error
          this.auditTrail.set([]);
          this.selectedRecordId.set(null);
        }
      });
  }

  private showMockAuditData() {
    const mockAudit: ChangeHistory[] = [
      {
        id: '1',
        recordId: this.selectedRecordId()!,
        action: 'Imported',
        userName: 'john.doe@company.com',
        timestamp: '2024-01-16T14:30:00Z'
      },
      {
        id: '2',
        recordId: this.selectedRecordId()!,
        action: 'Updated',
        userName: 'jane.smith@company.com',
        timestamp: '2024-01-15T10:45:00Z'
      }
    ];
    this.auditTrail.set(mockAudit);
  }

  private showMockData() {
    const mockData: FinancialRecord[] = [
      { id: 1, scenario: 'Budget2024', version: 'v1', account: 'Revenue', period: '2024-01', amount: 150000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Sales', year: 2024, month: 1, type: 'Budget' },
      { id: 2, scenario: 'Budget2024', version: 'v1', account: 'Expenses', period: '2024-01', amount: -120000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Operations', year: 2024, month: 1, type: 'Budget' },
      { id: 3, scenario: 'Forecast2024', version: 'v2', account: 'Revenue', period: '2024-02', amount: 160000, currency: 'USD', uploadDate: '2024-02-01T09:15:00Z', department: 'Sales', year: 2024, month: 2, type: 'Actual' },
      { id: 4, scenario: 'Budget2024', version: 'v1', account: 'Marketing', period: '2024-01', amount: -25000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Marketing', year: 2024, month: 1, type: 'Budget' }
    ];
    this.records.set(mockData);
  }
}

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
}

interface ChangeHistory {
  id: number;
  recordId: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changeDate: string;
  changedBy: string;
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
  displayedColumns = ['scenario', 'version', 'account', 'period', 'amount', 'currency', 'department', 'actions'];
  auditColumns = ['fieldName', 'oldValue', 'newValue', 'changeDate', 'changedBy'];
  selectedRecordId = signal<number | null>(null);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      scenario: [''],
      account: [''],
      type: ['']
    });
  }

  ngOnInit() {
    // Load some sample data by default
    this.loadRecords();
  }

  loadRecords() {
    this.isLoading.set(true);
    const { scenario, account, type } = this.filterForm.value;

    let url = API.FINANCE_RECORDS;
    if (type) {
      url = API.FINANCE_BY_TYPE(type);
    }
    
    const params = new URLSearchParams();
    if (scenario) params.append('scenario', scenario);
    if (account) params.append('account', account);

    if (params.toString()) {
      url += '?' + params.toString();
    }

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

  loadAuditTrail(recordId: number) {
    this.isLoadingAudit.set(true);
    this.selectedRecordId.set(recordId);

    this.http.get<ChangeHistory[]>(API.RECORDS_AUDIT(recordId))
      .pipe(finalize(() => this.isLoadingAudit.set(false)))
      .subscribe({
        next: (data) => {
          this.auditTrail.set(data);
          this.snackBar.open(`Loaded ${data.length} audit entries`, 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error loading audit trail:', error);
          this.snackBar.open('Failed to load audit trail', 'Close', { duration: 3000 });
          // Show mock audit data
          this.showMockAuditData();
        }
      });
  }

  private showMockAuditData() {
    const mockAudit: ChangeHistory[] = [
      {
        id: 1,
        recordId: this.selectedRecordId()!,
        fieldName: 'Amount',
        oldValue: '150000',
        newValue: '155000',
        changeDate: '2024-01-16T14:30:00Z',
        changedBy: 'john.doe@company.com'
      },
      {
        id: 2,
        recordId: this.selectedRecordId()!,
        fieldName: 'Department',
        oldValue: 'Sales',
        newValue: 'Marketing',
        changeDate: '2024-01-15T10:45:00Z',
        changedBy: 'jane.smith@company.com'
      }
    ];
    this.auditTrail.set(mockAudit);
  }

  private showMockData() {
    const mockData: FinancialRecord[] = [
      { id: 1, scenario: 'Budget2024', version: 'v1', account: 'Revenue', period: '2024-01', amount: 150000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Sales', year: 2024, month: 1 },
      { id: 2, scenario: 'Budget2024', version: 'v1', account: 'Expenses', period: '2024-01', amount: -120000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Operations', year: 2024, month: 1 },
      { id: 3, scenario: 'Forecast2024', version: 'v2', account: 'Revenue', period: '2024-02', amount: 160000, currency: 'USD', uploadDate: '2024-02-01T09:15:00Z', department: 'Sales', year: 2024, month: 2 },
      { id: 4, scenario: 'Budget2024', version: 'v1', account: 'Marketing', period: '2024-01', amount: -25000, currency: 'USD', uploadDate: '2024-01-15T10:30:00Z', department: 'Marketing', year: 2024, month: 1 }
    ];
    this.records.set(mockData);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { finalize } from 'rxjs/operators';
import {API} from '../api.constants';

interface ReportSummary {
  account: string;
  department: string;
  scenario: string;
  totalAmount: number;
}

interface MonthlyReport {
  month: string;
  total: number;
}

interface DrilldownReport {
  id: number;
  scenario: string;
  account: string;
  period: string;
  amount: number;
  department: string;
}

interface ComparisonReport {
  account: string;
  department: string;
  baseAmount: number;
  targetAmount: number;
  difference: number;
  percentageChange: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
  summaryForm: FormGroup;
  monthlyForm: FormGroup;
  drilldownForm: FormGroup;
  comparisonForm: FormGroup;
  
  summaryData = signal<ReportSummary[]>([]);
  monthlyData = signal<MonthlyReport[]>([]);
  drilldownData = signal<DrilldownReport[]>([]);
  comparisonData = signal<ComparisonReport[]>([]);
  
  isLoadingSummary = signal(false);
  isLoadingMonthly = signal(false);
  isLoadingDrilldown = signal(false);
  isLoadingComparison = signal(false);

  summaryColumns = ['account', 'department', 'scenario', 'totalAmount'];
  monthlyColumns = ['month', 'total'];
  drilldownColumns = ['account', 'period', 'amount', 'department'];
  comparisonColumns = ['account', 'department', 'baseAmount', 'targetAmount', 'difference', 'percentageChange'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.summaryForm = this.fb.group({
      scenario: [''],
      account: [''],
      department: [''],
      from: [''],
      to: ['']
    });

    this.monthlyForm = this.fb.group({
      account: [''],
      scenario: ['']
    });

    this.drilldownForm = this.fb.group({
      scenario: ['', Validators.required],
      account: ['', Validators.required],
      period: ['', Validators.required],
      department: ['']
    });

    this.comparisonForm = this.fb.group({
      baseScenario: ['', Validators.required],
      targetScenario: ['', Validators.required],
      period: ['', Validators.required],
      includeDepartment: [false]
    });
  }

  generateSummaryReport() {
    this.isLoadingSummary.set(true);
    const params = this.summaryForm.value;
    
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const url = `${API.REPORTS_SUMMARY}?${queryParams.toString()}`;

    this.http.get<ReportSummary[]>(url)
      .pipe(finalize(() => this.isLoadingSummary.set(false)))
      .subscribe({
        next: (data) => {
          this.summaryData.set(data);
          this.snackBar.open(`Summary report generated with ${data.length} records`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error generating summary report:', error);
          this.snackBar.open('Failed to generate summary report', 'Close', { duration: 3000 });
          this.showMockSummaryData();
        }
      });
  }

  generateMonthlyReport() {
    this.isLoadingMonthly.set(true);
    const params = this.monthlyForm.value;
    
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const url = `${API.REPORTS_MONTHLY}?${queryParams.toString()}`;

    this.http.get<MonthlyReport[]>(url)
      .pipe(finalize(() => this.isLoadingMonthly.set(false)))
      .subscribe({
        next: (data) => {
          this.monthlyData.set(data);
          this.snackBar.open(`Monthly report generated with ${data.length} records`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error generating monthly report:', error);
          this.snackBar.open('Failed to generate monthly report', 'Close', { duration: 3000 });
          this.showMockMonthlyData();
        }
      });
  }

  generateDrilldownReport() {
    if (!this.drilldownForm.valid) return;
    
    this.isLoadingDrilldown.set(true);
    const params = this.drilldownForm.value;
    
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const url = `${API.REPORTS_DRILLDOWN}?${queryParams.toString()}`;

    this.http.get<DrilldownReport[]>(url)
      .pipe(finalize(() => this.isLoadingDrilldown.set(false)))
      .subscribe({
        next: (data) => {
          this.drilldownData.set(data);
          this.snackBar.open(`Drilldown report generated with ${data.length} records`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error generating drilldown report:', error);
          this.snackBar.open('Failed to generate drilldown report', 'Close', { duration: 3000 });
          this.showMockDrilldownData();
        }
      });
  }

  generateComparisonReport() {
    if (!this.comparisonForm.valid) return;
    
    this.isLoadingComparison.set(true);
    const params = this.comparisonForm.value;
    
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key].toString());
      }
    });

    const url = `${API.REPORTS_COMPARE}?${queryParams.toString()}`;

    this.http.get<ComparisonReport[]>(url)
      .pipe(finalize(() => this.isLoadingComparison.set(false)))
      .subscribe({
        next: (data) => {
          this.comparisonData.set(data);
          this.snackBar.open(`Comparison report generated with ${data.length} records`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error generating comparison report:', error);
          this.snackBar.open('Failed to generate comparison report', 'Close', { duration: 3000 });
          this.showMockComparisonData();
        }
      });
  }

  private showMockSummaryData() {
    const mockData: ReportSummary[] = [
      {
        account: 'Revenue',
        department: 'Sales',
        scenario: 'Budget2024',
        totalAmount: 500000
      },
      {
        account: 'Expenses',
        department: 'Operations',
        scenario: 'Budget2024',
        totalAmount: -300000
      }
    ];
    this.summaryData.set(mockData);
  }

  private showMockMonthlyData() {
    const mockData: MonthlyReport[] = [
      { month: '2024-01', total: 150000 },
      { month: '2024-02', total: 160000 },
      { month: '2024-03', total: 155000 }
    ];
    this.monthlyData.set(mockData);
  }

  private showMockDrilldownData() {
    const mockData: DrilldownReport[] = [
      {
        id: 1,
        scenario: 'Budget2024',
        account: 'Revenue',
        period: '2024-01',
        amount: 150000,
        department: 'Sales'
      }
    ];
    this.drilldownData.set(mockData);
  }

  private showMockComparisonData() {
    const mockData: ComparisonReport[] = [
      {
        account: 'Revenue',
        department: 'Sales',
        baseAmount: 150000,
        targetAmount: 160000,
        difference: 10000,
        percentageChange: 6.67
      }
    ];
    this.comparisonData.set(mockData);
  }
}

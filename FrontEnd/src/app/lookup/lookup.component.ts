import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { finalize } from 'rxjs/operators';
import {API} from '../api.constants';

interface AccountMapping {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  description: string;
  isActive: boolean;
}

interface FXRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  period: string;
  effectiveDate: string;
}

@Component({
  selector: 'app-lookup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent implements OnInit {
  accountMappings = signal<AccountMapping[]>([]);
  fxRates = signal<FXRate[]>([]);
  
  accountForm: FormGroup;
  fxForm: FormGroup;
  fxLookupForm: FormGroup;
  accountLookupForm: FormGroup;
  
  isLoadingAccounts = signal(false);
  isLoadingFX = signal(false);
  isSavingAccount = signal(false);
  isSavingFX = signal(false);

  accountColumns = ['accountCode', 'accountName', 'accountType', 'description', 'isActive'];
  fxColumns = ['fromCurrency', 'toCurrency', 'rate', 'period', 'effectiveDate'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      accountCode: ['', Validators.required],
      accountName: ['', Validators.required],
      accountType: ['', Validators.required],
      description: [''],
      isActive: [true]
    });

    this.fxForm = this.fb.group({
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
      period: ['', Validators.required]
    });

    this.fxLookupForm = this.fb.group({
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required],
      period: ['', Validators.required]
    });

    this.accountLookupForm = this.fb.group({
      accountCode: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAccountMappings();
    this.loadFXRates();
  }

  loadAccountMappings() {
    this.isLoadingAccounts.set(true);
    
    // Since there's no GET endpoint for all account maps, we'll show mock data
    this.showMockAccountData();
  }

  loadFXRates() {
    this.isLoadingFX.set(true);
    
    // Since there's no GET endpoint for all FX rates, we'll show mock data
    this.showMockFXData();
  }

  addAccountMapping() {
    if (!this.accountForm.valid) return;

    this.isSavingAccount.set(true);
    const accountData = [this.accountForm.value];

    this.http.post(API.LOOKUP_ACCOUNT_MAPS, accountData)
      .pipe(finalize(() => this.isSavingAccount.set(false)))
      .subscribe({
        next: (response: any) => {
          this.snackBar.open('Account mapping added successfully', 'Close', { duration: 3000 });
          this.accountForm.reset();
          this.accountForm.patchValue({ isActive: true });
          this.loadAccountMappings();
        },
        error: (error) => {
          console.error('Error adding account mapping:', error);
          this.snackBar.open('Failed to add account mapping', 'Close', { duration: 3000 });
        }
      });
  }

  addFXRate() {
    if (!this.fxForm.valid) return;

    this.isSavingFX.set(true);
    const fxData = [this.fxForm.value];

    this.http.post(API.LOOKUP_FX_RATES, fxData)
      .pipe(finalize(() => this.isSavingFX.set(false)))
      .subscribe({
        next: (response: any) => {
          this.snackBar.open('FX rate added successfully', 'Close', { duration: 3000 });
          this.fxForm.reset();
          this.loadFXRates();
        },
        error: (error) => {
          console.error('Error adding FX rate:', error);
          this.snackBar.open('Failed to add FX rate', 'Close', { duration: 3000 });
        }
      });
  }

  lookupFXRate() {
    if (!this.fxLookupForm.valid) return;

    const { fromCurrency, toCurrency, period } = this.fxLookupForm.value;
    
    this.http.get(API.LOOKUP_FX_RATE(fromCurrency, toCurrency, period))
      .subscribe({
        next: (rate: any) => {
          this.snackBar.open(`FX Rate: 1 ${fromCurrency} = ${rate.rate} ${toCurrency}`, 'Close', { duration: 5000 });
        },
        error: (error) => {
          console.error('Error looking up FX rate:', error);
          this.snackBar.open('FX rate not found', 'Close', { duration: 3000 });
        }
      });
  }

  lookupAccountMapping() {
    if (!this.accountLookupForm.valid) return;

    const { accountCode } = this.accountLookupForm.value;
    
    this.http.get(API.LOOKUP_ACCOUNT_MAP(accountCode))
      .subscribe({
        next: (mapping: any) => {
          this.snackBar.open(`Account: ${mapping.accountName} (${mapping.accountType})`, 'Close', { duration: 5000 });
        },
        error: (error) => {
          console.error('Error looking up account mapping:', error);
          this.snackBar.open('Account mapping not found', 'Close', { duration: 3000 });
        }
      });
  }

  private showMockAccountData() {
    const mockData: AccountMapping[] = [
      {
        id: 1,
        accountCode: 'REV001',
        accountName: 'Product Revenue',
        accountType: 'Revenue',
        description: 'Revenue from product sales',
        isActive: true
      },
      {
        id: 2,
        accountCode: 'EXP001',
        accountName: 'Operating Expenses',
        accountType: 'Expense',
        description: 'General operating expenses',
        isActive: true
      },
      {
        id: 3,
        accountCode: 'AST001',
        accountName: 'Cash',
        accountType: 'Asset',
        description: 'Cash and cash equivalents',
        isActive: true
      }
    ];
    this.accountMappings.set(mockData);
    this.isLoadingAccounts.set(false);
  }

  private showMockFXData() {
    const mockData: FXRate[] = [
      {
        id: 1,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        rate: 0.85,
        period: '2024-01',
        effectiveDate: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        fromCurrency: 'EUR',
        toCurrency: 'USD',
        rate: 1.18,
        period: '2024-01',
        effectiveDate: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        fromCurrency: 'USD',
        toCurrency: 'GBP',
        rate: 0.73,
        period: '2024-01',
        effectiveDate: '2024-01-01T00:00:00Z'
      }
    ];
    this.fxRates.set(mockData);
    this.isLoadingFX.set(false);
  }

  getAccountTypeColor(accountType: string): string {
    switch (accountType) {
      case 'Revenue': return 'primary';
      case 'Expense': return 'warn';
      case 'Asset': return 'accent';
      case 'Liability': return 'warn';
      case 'Equity': return 'primary';
      default: return '';
    }
  }
}

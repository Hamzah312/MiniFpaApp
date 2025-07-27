import { Component, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import {API} from '../api.constants';

interface Scenario {
  id: number;
  name: string;
  version: string;
  description: string;
  createdDate: string;
  lastModified: string;
  recordCount: number;
}

@Component({
  selector: 'app-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './clone-dialog.component.html',
  styleUrl: './clone-dialog.component.scss'
})
export class CloneDialogComponent {
  cloneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cloneForm = this.fb.group({
      newName: ['', Validators.required],
      newVersion: ['v1', Validators.required]
    });
  }

  onClone() {
    if (this.cloneForm.valid) {
      this.dialogRef.close(this.cloneForm.value);
    }
  }
}

@Component({
  selector: 'app-scenarios',
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
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './scenarios.component.html',
  styleUrl: './scenarios.component.scss'
})
export class ScenariosComponent implements OnInit {
  scenarios = signal<Scenario[]>([]);
  isLoading = signal(false);
  displayedColumns = ['name', 'version', 'description', 'recordCount', 'lastModified', 'actions'];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadScenarios();
  }

  loadScenarios() {
    this.isLoading.set(true);

    // Since there's no direct scenarios endpoint, we'll get unique scenarios from records
    this.http.get<any[]>(API.FINANCE_RECORDS)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (records) => {
          const scenarioMap = new Map<string, Scenario>();
          
          records.forEach(record => {
            const key = `${record.scenario}-${record.version}`;
            if (!scenarioMap.has(key)) {
              scenarioMap.set(key, {
                id: scenarioMap.size + 1,
                name: record.scenario,
                version: record.version,
                description: `Scenario: ${record.scenario}`,
                createdDate: record.uploadDate,
                lastModified: record.uploadDate,
                recordCount: 0
              });
            }
            scenarioMap.get(key)!.recordCount++;
          });

          this.scenarios.set(Array.from(scenarioMap.values()));
          this.snackBar.open(`Loaded ${scenarioMap.size} scenarios`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error loading scenarios:', error);
          this.snackBar.open('Failed to load scenarios', 'Close', { duration: 3000 });
          this.showMockScenarios();
        }
      });
  }

  private showMockScenarios() {
    const mockData: Scenario[] = [
      {
        id: 1,
        name: 'Budget2024',
        version: 'v1',
        description: 'Annual budget for 2024',
        createdDate: '2024-01-01T00:00:00Z',
        lastModified: '2024-01-15T10:30:00Z',
        recordCount: 1250
      },
      {
        id: 2,
        name: 'Forecast2024',
        version: 'v2',
        description: 'Q1 forecast revision',
        createdDate: '2024-02-01T00:00:00Z',
        lastModified: '2024-02-15T14:20:00Z',
        recordCount: 890
      }
    ];
    this.scenarios.set(mockData);
  }

  cloneScenario(scenario: Scenario) {
    const dialogRef = this.dialog.open(CloneDialogComponent, {
      width: '400px',
      data: { scenario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performClone(scenario, result.newName, result.newVersion);
      }
    });
  }

  private performClone(scenario: Scenario, newName: string, newVersion: string) {
    this.isLoading.set(true);

    const cloneRequest = {
      baseScenario: scenario.name,
      newScenario: newName,
      adjustments: []
    };

    this.http.post(API.SCENARIOS_CLONE, cloneRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Scenario cloned successfully', 'Close', { duration: 3000 });
          this.loadScenarios(); // Refresh the list
        },
        error: (error) => {
          console.error('Error cloning scenario:', error);
          this.snackBar.open('Failed to clone scenario', 'Close', { duration: 3000 });
        }
      });
  }

  private showMockData() {
    const mockData: Scenario[] = [
      {
        id: 1,
        name: 'Budget2024',
        version: 'v1',
        description: 'Annual budget for 2024',
        createdDate: '2024-01-01T00:00:00Z',
        lastModified: '2024-01-15T10:30:00Z',
        recordCount: 1250
      },
      {
        id: 2,
        name: 'Forecast2024',
        version: 'v2',
        description: 'Q1 forecast revision',
        createdDate: '2024-02-01T00:00:00Z',
        lastModified: '2024-02-15T14:20:00Z',
        recordCount: 890
      },
      {
        id: 3,
        name: 'Budget2025',
        version: 'v1',
        description: 'Preliminary 2025 budget',
        createdDate: '2024-03-01T00:00:00Z',
        lastModified: '2024-03-10T09:45:00Z',
        recordCount: 2100
      }
    ];
    this.scenarios.set(mockData);
  }
}

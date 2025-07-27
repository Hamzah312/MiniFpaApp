import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <mat-card class="hero-card">
        <mat-card-header>
          <mat-card-title>
            <h1>
              <mat-icon>analytics</mat-icon>
              Mini FPA - Financial Planning & Analysis
            </h1>
          </mat-card-title>
          <mat-card-subtitle>
            A comprehensive financial planning and analysis application built with Angular and ASP.NET Core
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            This demo application showcases a complete financial planning and analysis solution with 
            Excel import capabilities, scenario management, detailed reporting, and lookup data management.
          </p>
        </mat-card-content>
      </mat-card>

      <!-- Feature Cards -->
      <div class="features-grid">
        <mat-card class="feature-card" routerLink="/upload">
          <mat-card-header>
            <mat-icon mat-card-avatar>upload_file</mat-icon>
            <mat-card-title>Upload Data</mat-card-title>
            <mat-card-subtitle>Import Excel files with financial data</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Upload and process Excel files containing financial records with support for multiple scenarios and versions.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/upload">
              Start Upload
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="feature-card" routerLink="/records">
          <mat-card-header>
            <mat-icon mat-card-avatar>table_view</mat-icon>
            <mat-card-title>View Records</mat-card-title>
            <mat-card-subtitle>Browse and filter financial data</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>View detailed financial records with filtering capabilities and audit trail information.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/records">
              View Records
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="feature-card" routerLink="/scenarios">
          <mat-card-header>
            <mat-icon mat-card-avatar>account_tree</mat-icon>
            <mat-card-title>Scenarios</mat-card-title>
            <mat-card-subtitle>Manage financial scenarios</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Create, clone, and manage different financial scenarios for planning and analysis.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/scenarios">
              Manage Scenarios
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="feature-card" routerLink="/report">
          <mat-card-header>
            <mat-icon mat-card-avatar>assessment</mat-icon>
            <mat-card-title>Reports</mat-card-title>
            <mat-card-subtitle>Generate comprehensive reports</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Generate detailed financial reports including summary, monthly analysis, drilldown, and scenario comparisons.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/report">
              View Reports
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="feature-card" routerLink="/lookup">
          <mat-card-header>
            <mat-icon mat-card-avatar>settings</mat-icon>
            <mat-card-title>Lookup Data</mat-card-title>
            <mat-card-subtitle>Manage reference data</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Manage FX rates, account mappings, and other lookup data used throughout the application.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/lookup">
              Manage Lookups
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-divider></mat-divider>

      <!-- Tech Stack Section -->
      <mat-card class="tech-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>code</mat-icon>
            Technology Stack
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="tech-grid">
            <div class="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>Angular 20.1.0</li>
                <li>Angular Material 20.1.3</li>
                <li>TypeScript</li>
                <li>SCSS</li>
              </ul>
            </div>
            <div class="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>ASP.NET Core 8.0</li>
                <li>Entity Framework Core</li>
                <li>SQLite Database</li>
                <li>Swagger/OpenAPI</li>
              </ul>
            </div>
            <div class="tech-item">
              <h3>Features</h3>
              <ul>
                <li>Excel File Processing</li>
                <li>REST API Integration</li>
                <li>Responsive Design</li>
                <li>Dark Theme</li>
              </ul>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Footer -->
      <footer class="app-footer">
        <mat-divider></mat-divider>
        <div class="footer-content">
          <p>
            <mat-icon>info</mat-icon>
            Mini FPA Demo Application v1.0 | Built with Angular & ASP.NET Core
          </p>
          <p>
            <a href="https://github.com/Hamzah312/MiniFpaApp" target="_blank" mat-button>
              <mat-icon>code</mat-icon>
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-card {
      margin-bottom: 32px;
      text-align: center;
      
      h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin: 0;
        font-size: 2.5rem;
        
        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
        }
      }
      
      mat-card-subtitle {
        font-size: 1.1rem;
        margin-top: 16px;
      }
      
      mat-card-content p {
        font-size: 1rem;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin: 32px 0;
    }

    .feature-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4) !important;
      }
      
      mat-card-header {
        mat-icon[mat-card-avatar] {
          background-color: transparent;
          color: #8b5cf6;
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      mat-card-actions {
        padding: 16px;
        
        button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      }
    }

    .tech-card {
      margin: 32px 0;
      
      mat-card-title {
        display: flex;
        align-items: center;
        gap: 12px;
        
        mat-icon {
          color: #8b5cf6;
        }
      }
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 16px;
    }

    .tech-item {
      h3 {
        color: #8b5cf6;
        margin-bottom: 12px;
        font-size: 1.1rem;
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          padding: 4px 0;
          border-left: 3px solid #8b5cf6;
          padding-left: 12px;
          margin-bottom: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0 4px 4px 0;
        }
      }
    }

    .app-footer {
      margin-top: 48px;
      
      .footer-content {
        text-align: center;
        padding: 24px 0;
        
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 8px 0;
          
          mat-icon {
            color: #8b5cf6;
          }
        }
        
        a {
          color: #8b5cf6;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .hero-card h1 {
        font-size: 2rem;
        flex-direction: column;
        gap: 8px;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .tech-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
}

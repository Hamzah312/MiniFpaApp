# 🏦 MiniFpaApp - Financial Planning Assistant

A modern full-stack financial planning and analysis application built with **ASP.NET Core** backend and **Angular** frontend, featuring Excel data import, scenario management, comprehensive reporting, and audit trails.

![Angular](https://img.shields.io/badge/Angular-18.2.0-red?logo=angular)
![.NET](https://img.shields.io/badge/.NET-8.0-blue?logo=dotnet)
![Material](https://img.shields.io/badge/Material_UI-Dark_Theme-purple?logo=material-ui)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightblue?logo=sqlite)

## 🌟 Features

### 📊 **Financial Data Management**
- **Excel Import**: Upload and process Excel files with financial data
- **Data Validation**: Automatic validation and error handling
- **Multi-currency Support**: Handle different currencies with FX rate conversion
- **Real-time Processing**: Live progress tracking during uploads

### 🎯 **Scenario Planning**
- **Multiple Scenarios**: Budget, Forecast, Actual data management
- **Scenario Cloning**: Create new scenarios with adjustment factors
- **Version Control**: Track different versions of financial plans
- **Comparison Tools**: Side-by-side scenario analysis

### 📈 **Advanced Reporting**
- **Summary Reports**: High-level financial summaries with date range filtering
- **Monthly Analysis**: Month-over-month trending and analysis
- **Drill-down Reports**: Detailed breakdowns by account, department, and period
- **Scenario Comparison**: Delta and percentage variance analysis

### 🔍 **Audit & Tracking**
- **Complete Audit Trail**: Track all changes with user attribution
- **Change History**: Detailed logs of imports, updates, and modifications
- **User Activity**: Monitor who made what changes and when

### 🛠 **Lookup Management**
- **FX Rates**: Manage foreign exchange rates for currency conversion
- **Account Mapping**: Configure account codes and descriptions
- **Reference Data**: Centralized lookup data management

## 🏗 Architecture

### **Backend (ASP.NET Core 8.0)**
```
BackEnd/MiniFPAService/
├── Controllers/          # API endpoints
│   ├── FinancialRecordsController.cs
│   ├── ScenariosController.cs
│   ├── RecordsController.cs
│   ├── ReportsController.cs
│   └── LookupController.cs
├── Models/              # Data models and DTOs
├── Data/               # Entity Framework DbContext
└── Services/           # Business logic services
```

### **Frontend (Angular 18)**
```
FrontEnd/src/app/
├── components/         # Feature components
│   ├── upload/        # Excel file upload
│   ├── records/       # Data grid with filtering
│   ├── scenarios/     # Scenario management
│   ├── reports/       # Multi-tab reporting
│   └── lookup/        # Reference data management
├── navigation/        # Main navigation
└── home/             # Landing page
```

## 🚀 Quick Start

### **Prerequisites**
- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Angular CLI** - `npm install -g @angular/cli`

### **1. Clone Repository**
```bash
git clone https://github.com/Hamzah312/MiniFpaApp.git
cd MiniFpaApp
```

### **2. Start Backend API**
```bash
cd BackEnd/MiniFPAService
dotnet restore
dotnet run --urls="http://localhost:5000"
```
✅ **Backend runs on**: `http://localhost:5000`  
✅ **API Documentation**: `http://localhost:5000/swagger`

### **3. Start Frontend (New Terminal)**
```bash
cd FrontEnd
npm install
npm start
```
✅ **Frontend runs on**: `http://localhost:4200`

### **4. Access Application**
- **Main App**: [http://localhost:4200](http://localhost:4200)
- **API Docs**: [http://localhost:5000/swagger](http://localhost:5000/swagger)

## 🎨 User Interface

### **Dark Material Theme**
- Modern dark theme with violet accents (`#8b5cf6`)
- Responsive design for desktop and mobile
- Material Design components throughout
- Professional card-based layouts

### **Navigation**
- **Home** (`/home`) - Feature overview and quick navigation
- **Upload** (`/upload`) - Excel file upload with progress tracking
- **Records** (`/records`) - Filterable data grid with audit trails
- **Scenarios** (`/scenarios`) - Scenario management and cloning
- **Reports** (`/reports`) - Multi-tab reporting dashboard
- **Lookup** (`/lookup`) - FX rates and account mapping

## 📊 Sample Data

The application includes **comprehensive seed data** for immediate demo:

### **Financial Records** (240+ entries)
- **3 Scenarios**: "Actual", "Forecast", "Budget"
- **5 Departments**: Sales, Marketing, Operations, IT, Finance
- **24 Months**: January 2023 - December 2024
- **Multiple Currencies**: USD, EUR, GBP with realistic amounts

### **Reference Data**
- **10 Account Mappings**: Revenue, Expenses, Marketing, etc.
- **7 FX Rates**: Major currency pairs (USD/EUR, GBP/USD, etc.)
- **Audit Trail**: Complete change history for all records

## 🔧 API Endpoints

### **Financial Records** (`/api/finance`)
```http
GET    /api/finance                    # Get all records
GET    /api/finance/type/{type}        # Filter by Budget/Actual
POST   /api/finance/upload             # Upload Excel files
```

### **Scenarios** (`/api/scenarios`)
```http
POST   /api/scenarios/clone            # Clone scenario with adjustments
```

### **Reports** (`/api/reports`)
```http
GET    /api/reports/latest             # Latest records by scenario
GET    /api/reports/summary            # Aggregated summaries
GET    /api/reports/monthly            # Monthly analysis
GET    /api/reports/drilldown          # Detailed breakdowns
GET    /api/reports/compare            # Scenario comparisons
```

### **Audit Trail** (`/api/records`)
```http
GET    /api/records/{id}/audit         # Get change history
```

### **Lookups** (`/api/lookup`)
```http
GET    /api/lookup/fxrates/{from}/{to}/{period}    # Get FX rate
POST   /api/lookup/fx-rates                        # Add FX rates
GET    /api/lookup/account-maps/{code}             # Get account mapping
POST   /api/lookup/account-maps                    # Add account maps
```

## 🧪 Demo Scenarios

### **1. Data Upload Demo**
1. Navigate to **Upload** tab
2. Select sample Excel file (or create one with columns: Scenario, Account, Period, Amount, Currency)
3. Watch real-time upload progress
4. View imported data in **Records** tab

### **2. Scenario Management**
1. Go to **Scenarios** tab
2. Clone "Budget" scenario to "OptimisticBudget" with 1.15x factor
3. View cloned data with adjusted amounts
4. Compare scenarios in **Reports** tab

### **3. Advanced Reporting**
1. Navigate to **Reports** tab
2. Try different report types:
   - **Summary**: Filter by date range and department
   - **Monthly**: View trends over time
   - **Comparison**: Compare Budget vs Actual scenarios
   - **Drill-down**: Deep dive into specific accounts

### **4. Audit Trail**
1. Go to **Records** tab
2. Click "History" button on any record
3. View complete audit trail with timestamps and users

## 🛠 Development

### **Technology Stack**
- **Backend**: ASP.NET Core 8.0, Entity Framework Core, SQLite
- **Frontend**: Angular 18, Angular Material, TypeScript, SCSS
- **Architecture**: RESTful API, Reactive forms, Observable patterns
- **Database**: SQLite with automatic migrations

### **Key Features**
- **Type Safety**: Full TypeScript integration
- **Reactive UI**: Angular signals and observables
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: User feedback throughout
- **Responsive Design**: Mobile-first approach

### **Build & Deploy**
```bash
# Backend build
cd BackEnd/MiniFPAService
dotnet publish -c Release

# Frontend build
cd FrontEnd
ng build --prod
```

**Ready for demo!** 🎉 This application showcases modern full-stack development with real-world financial planning features.

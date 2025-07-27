import { Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { RecordsComponent } from './records/records.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { ReportComponent } from './report/report.component';
import { LookupComponent } from './lookup/lookup.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'records', component: RecordsComponent },
      { path: 'scenarios', component: ScenariosComponent },
      { path: 'report', component: ReportComponent },
      { path: 'lookup', component: LookupComponent }
    ]
  },
  { path: '**', redirectTo: '/' }
];

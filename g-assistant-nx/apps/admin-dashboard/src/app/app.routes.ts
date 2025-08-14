import { Routes } from '@angular/router';
import { CRMDashboard } from '../pages/CRM/CRMDashboard';
import { CampaignTracker } from '../pages/CRM/CampaignTracker';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'crm', component: CRMDashboard },
  { path: 'campaigns', component: CampaignTracker },
  { path: '**', redirectTo: '/dashboard' }
];
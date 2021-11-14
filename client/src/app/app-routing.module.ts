import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./page/home/home.component";

import { RegisterComponent } from './auth/register/register.component';
import { SigninComponent } from './auth/signin/signin.component';

import {ReportListComponent} from "./incidents/report-list/report-list.component";
import { DashboardComponent } from './incidents/dashboard/dashboard.component';
import { AddEditCloseComponent } from './incidents/dashboard/add-edit-close/add-edit-close.component';




const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "report-list", component: ReportListComponent},
  {path: "login", component: SigninComponent},
  {path: "register", component: RegisterComponent},
  {path: "add-edit-close", component: AddEditCloseComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
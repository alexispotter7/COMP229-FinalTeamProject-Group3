import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./page/home/home.component";
import {DashboardComponent} from "./page/dashboard/dashboard.component";
import {ReportListComponent} from "./page/report-list/report-list.component";
import {SigninComponent} from "./auth/signin/signin.component";
import {RegisterComponent} from "./auth/register/register.component";

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "report-list", component: ReportListComponent},
  {path: "login", component: SigninComponent},
  {path: "register", component: RegisterComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

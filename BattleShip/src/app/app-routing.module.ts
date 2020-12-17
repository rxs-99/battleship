import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { HomeComponent } from './components/body/home/home.component';
import { LoginComponent } from './components/body/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'body/login', pathMatch: 'full'},
  {path: 'body', component: BodyComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'home', component: HomeComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

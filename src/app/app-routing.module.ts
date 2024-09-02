import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { HeroesModule } from './heroes/heroes.module';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { authCanGuard, authMatchGuard } from './auth/guards/auth.guard';
import { publicCanGuard, publicMatchGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( modul => modul.AuthModule ),
    canActivate: [publicCanGuard],
    canMatch: [publicMatchGuard] 
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( modul => modul.HeroesModule ),
    canActivate: [authCanGuard],
    canMatch: [authMatchGuard]
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

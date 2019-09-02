import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './core/pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SideNavOuterToolbarComponent } from './theme/layouts';
import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';
import { RegisterComponent } from './core/pages/register/register.component';

const routes: Routes = [
    {
        path: '',
        component: SideNavOuterToolbarComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [AuthGuard],
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },  
    {
        path: 'register',
        component: RegisterComponent
    },  
    {
        path: 'forbidden',
        component: ForbiddenComponent
    },      
    {
        path: '**', redirectTo: '404', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

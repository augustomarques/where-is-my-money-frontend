import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ListaCategoriasComponent } from './pages/lista-categoria/lista-categorias.component';
import { ListaComprasComponent } from './pages/lista-compra/lista-compras.component';
import { ListaComprasRecorrentesComponent } from './pages/lista-compra-recorrente/lista-compras-recorrentes.component';
import { ListaComprasParceladasComponent } from './pages/lista-compra-parcelada/lista-compras-parceladas.component';
import { CompraParceladaComponent } from './pages/compra-parcelada/compra-parcelada.component';
import { CompraRecorrenteComponent } from './pages/compra-recorrente/compra-recorrente.component';
import { CompraComponent } from './pages/compra/compra.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { 
                path: 'auth', 
                children: [
                    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
                    { path: 'register', component: CadastroUsuarioComponent, canActivate: [AuthGuard] },
                ]
            },
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },

                    { path: 'lista-categorias', component: ListaCategoriasComponent, canActivate: [AuthGuard] },
                    { path: 'categoria', component: CategoriaComponent, canActivate: [AuthGuard] },
                    { path: 'categoria/:id', component: CategoriaComponent, canActivate: [AuthGuard] },
                    
                    { path: 'lista-compras', component: ListaComprasComponent, canActivate: [AuthGuard] },
                    { path: 'compra', component: CompraComponent, canActivate: [AuthGuard] },
                    { path: 'compra/:id', component: CompraComponent, canActivate: [AuthGuard] },

                    { path: 'lista-compras-recorrentes', component: ListaComprasRecorrentesComponent, canActivate: [AuthGuard] },
                    { path: 'compra-recorrente', component: CompraRecorrenteComponent, canActivate: [AuthGuard] },
                    { path: 'compra-recorrente/:id', component: CompraRecorrenteComponent, canActivate: [AuthGuard] },

                    { path: 'lista-compras-parceladas', component: ListaComprasParceladasComponent, canActivate: [AuthGuard] },
                    { path: 'compra-parcelada', component: CompraParceladaComponent, canActivate: [AuthGuard] },
                    { path: 'compra-parcelada/:id', component: CompraParceladaComponent, canActivate: [AuthGuard] },
                ]
            },
            { path: 'old-auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
            
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

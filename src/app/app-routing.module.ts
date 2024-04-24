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

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: DashboardComponent },

                    { path: 'lista-categorias', component: ListaCategoriasComponent },
                    { path: 'categoria', component: CategoriaComponent },
                    { path: 'categoria/:id', component: CategoriaComponent },
                    
                    { path: 'lista-compras', component: ListaComprasComponent },
                    { path: 'compra', component: CompraComponent },
                    { path: 'compra/:id', component: CompraComponent },

                    { path: 'lista-compras-recorrentes', component: ListaComprasRecorrentesComponent },
                    { path: 'compra-recorrente', component: CompraRecorrenteComponent },
                    { path: 'compra-recorrente/:id', component: CompraRecorrenteComponent },

                    { path: 'lista-compras-parceladas', component: ListaComprasParceladasComponent },
                    { path: 'compra-parcelada', component: CompraParceladaComponent },
                    { path: 'compra-parcelada/:id', component: CompraParceladaComponent },
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
            
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

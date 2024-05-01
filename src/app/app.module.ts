import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent, 
        NotfoundComponent
    ],
    imports: [
        AppRoutingModule, 
        AppLayoutModule,
        BrowserAnimationsModule,
        ToastModule
    ],
    providers: [
        { 
            provide: LocationStrategy, 
            useClass: PathLocationStrategy 
        },
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: AuthInterceptor, 
            multi: true 
        },
        MessageService
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }

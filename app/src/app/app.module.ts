import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MessagelistComponent } from './components/messagelist/messagelist.component';
import { MessageentryComponent } from './components/messageentry/messageentry.component';
import { MessageService } from './services/message.service';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: 'login',    component: LoginComponent                   },
  { path: 'home',     component: HomeComponent                    },
  { path: '',         redirectTo: '/login',   pathMatch: 'full'   }
];

@NgModule({
  declarations: [
    AppComponent,
    UserlistComponent,
    MessagelistComponent,
    MessageentryComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    RouterModule.forRoot( appRoutes, { enableTracing: true }),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [MessageService, LoginService, TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }

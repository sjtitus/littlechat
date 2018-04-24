import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MessagelistComponent } from './components/messagelist/messagelist.component';
import { MessageentryComponent } from './components/messageentry/messageentry.component';
import { MessageService } from './services/message.service';
import { ApiService } from './services/api.service';
import { TokenService } from './services/token.service';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './modules/routing/routing.module';

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
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MessageService, ApiService, TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }

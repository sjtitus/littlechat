import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ContactListComponent } from './components/contactlist/contactlist.component';
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
import { WebSocketService } from './services/websocket.service';
import { ErrorhandlerComponent } from './components/errorhandler/errorhandler.component';
import { AccordionComponent } from './components/accordion/accordion.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    MessagelistComponent,
    MessageentryComponent,
    LoginComponent,
    HomeComponent,
    ErrorhandlerComponent,
    AccordionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MessageService, ApiService, TokenService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

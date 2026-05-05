import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './component/navbar/navbar';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Slot } from './component/slot/slot';

@NgModule({
  declarations: [
    App,
    Navbar,
    Login,
    Register,
    Slot
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [App]
})
export class AppModule { }

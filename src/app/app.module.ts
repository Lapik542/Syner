// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgClass } from '@angular/common';
import { MatterModule } from './matter/matter.module'; // Імпорт MatterModule

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    SwiperModule,
    NgClass,
    MatterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

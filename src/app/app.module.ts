import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatterModule } from './matter/matter.module';
import { AppComponent } from './app.component';
import { SwiperModule } from 'swiper/angular/angular/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    SwiperModule,
    NgClass,
    MatterModule
  ],
  providers: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

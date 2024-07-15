import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatterModule } from './matter/matter.module';
import { AppComponent } from './app.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    BrowserModule,
    SwiperModule,
    MatterModule
  ],
  providers: [
    AppComponent
  ],
})
export class AppModule { }

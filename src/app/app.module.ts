import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatterModule } from './matter/matter.module'; // Імпорт MatterModule

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgClass,
    MatterModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }

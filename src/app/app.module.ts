import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgClass } from "@angular/common";
import { SwiperModule } from "swiper/angular";
import { RouterOutlet } from "@angular/router";
import { MatterModule } from "./matter/matter.module";
import { FormsModule } from "@angular/forms";
import { FormComponent } from "./form/form.component";

@NgModule({
  imports: [
    BrowserModule,
    NgClass,
    SwiperModule,
    RouterOutlet,
    MatterModule,
    FormsModule,
    HttpClientModule,
  ],
  exports: [AppComponent,FormComponent],
  declarations: [AppComponent,FormComponent],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

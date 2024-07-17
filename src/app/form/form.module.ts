import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@NgModule({
  imports: [FormsModule, NgClass],
  exports: [FormComponent],
  declarations: [FormComponent],
})
export class FormModule { }

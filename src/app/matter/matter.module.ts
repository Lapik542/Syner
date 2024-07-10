import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatterComponent } from './matter.component';

@NgModule({
  declarations: [MatterComponent],
  imports: [CommonModule],
  exports: [MatterComponent]
})
export class MatterModule { }

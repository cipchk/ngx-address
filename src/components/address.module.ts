import { OffClickDirective } from './off-click';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { CommonModule } from '@angular/common';

import { KeysPipe } from './pipes/keys.pipe';
import { AddressComponent } from './address.component';

@NgModule({
  imports: [HttpModule, CommonModule],
  declarations: [KeysPipe, AddressComponent, OffClickDirective],
  exports: [ AddressComponent]
})
export class NgxAddressModule {

}

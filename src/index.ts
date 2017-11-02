import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { CommonModule } from '@angular/common';

import { OffClickDirective } from './components/off-click';
import { KeysPipe } from './components/pipes/keys.pipe';
import { AddressComponent } from './components/address.component';

export * from './components/interfaces/data-type';
export * from './components/interfaces/data-item';
export * from './components/interfaces/data';
export * from './components/interfaces/result';
export * from './components/interfaces/options';
export * from './components/interfaces/tab.item';
export * from './components/interfaces/external-data';
export * from './components/address.service';
export * from './components/address.component';

@NgModule({
  imports: [HttpModule, CommonModule],
  declarations: [KeysPipe, AddressComponent, OffClickDirective],
  exports: [ AddressComponent]
})
export class NgxAddressModule {

}

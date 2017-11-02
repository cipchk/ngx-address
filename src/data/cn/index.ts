import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { AddressDataCNService } from "./data.service";

export * from './data.service';

@NgModule({
  providers: [ AddressDataCNService ]
})
export class AddressDataCNModule {

}

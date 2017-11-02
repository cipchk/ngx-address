import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { AddressDataChinaService } from "./data.service";

export * from './data.service';

@NgModule({
  providers: [ AddressDataChinaService ]
})
export class AddressDataChinaModule {

}

import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { AddressDataMaService } from "./data.service";

@NgModule({
  providers: [ AddressDataMaService ]
})
export class AddressDataMaModule {
  
}

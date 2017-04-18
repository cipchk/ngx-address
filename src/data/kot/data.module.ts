import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { AddressDataKotService } from "./data.service";

@NgModule({
  providers: [ AddressDataKotService ]
})
export class AddressDataKotModule {
  
}

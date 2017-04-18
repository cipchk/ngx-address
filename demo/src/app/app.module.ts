import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgxAddressModule } from 'ngx-address';
import { AddressDataChinaModule } from 'ngx-address/data/china';
import { AddressDataCNModule } from 'ngx-address/data/cn';
import { AddressDataKotModule } from 'ngx-address/data/kot';
import { AddressDataTWModule } from 'ngx-address/data/tw';
import { AddressDataMaModule } from 'ngx-address/data/ma';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    
    NgxAddressModule,
    AddressDataChinaModule,
    AddressDataCNModule,
    AddressDataKotModule,
    AddressDataTWModule,
    AddressDataMaModule
  ],
  declarations: [
    AppComponent,
    DemoComponent
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})

export class CityPickerDemoModule {
}

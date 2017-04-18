import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>ngx-address</h1>
    <p>A simple address picker in angular.</p>
    <demo></demo>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}

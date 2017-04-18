import { Directive, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
@Directive({
  selector: '[offClick]'
})
export class OffClickDirective implements OnInit, OnDestroy {

  @Input('offClick') public offClickHandler: any;

  @HostListener('click', ['$event']) public onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('click', this.offClickHandler);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.offClickHandler);
    }
  }


}

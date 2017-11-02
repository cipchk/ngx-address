import { Result } from './interfaces/result';
import { Options } from './interfaces/options';
import { Component, OnInit, OnChanges, DoCheck, SimpleChanges, Input, EventEmitter, Output, forwardRef, ElementRef, Inject, ViewEncapsulation, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AddressService } from "./address.service";

declare const require: any;

/**
 * 城市选择器组件
 * Usage:
 * <ngx-address [(ngModel)]="city.id" [options]="{...}"></ngx-address>
 */
@Component({
    selector: 'ngx-address',
    template: `<div class="ngx-address" [offClick]="onClose">
    <div class="ngx-address-title" [ngClass]="{'has':_t.title.length > 0}"
        (click)="onOpen()">
        <span [innerHTML]="_t.title ? _t.title : options.placeholder"></span>
        <i class="arrow"></i>
    </div>
    <div class="ngx-address-overlay" *ngIf="_t.inited" [hidden]="!_t.opened" [ngStyle]="{'top.px': options.offset.y,'left.px': options.offset.x}">
        <div class="ngx-address-select-warp">
            <div class="ngx-address-select-tab">
                <a *ngFor="let item of _t.hd" (click)="onTabChange(item.index)" [ngClass]="{'current': item.selected}">{{item.name}}</a>
            </div>
            <div class="ngx-address-select" *ngFor="let bitem of _t.bd" [hidden]="!bitem.selected">
                <dl *ngFor="let g of bitem.data.items | keys">
                    <dt *ngIf="g.key">{{g.key}}</dt>
                    <dd>
                        <a *ngFor="let i of g.value"
                            (click)="onItem(bitem.index, g.key, i.id, i)"
                            [ngClass]="{'current': i.selected}" title="{{i.name}}" data-id="{{i.id}}"
                            href="javascript:;">{{i.name}}</a>
                    </dd>
                </dl>
                <dl class="ngx-address-tips" *ngIf="bitem.data.tips && bitem.data.tips.length > 0">
                    <dd>
                        <p *ngFor="let ti of bitem.data.tips" data-id="{{ti.id}}">{{ti.name}}</p>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</div>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [ './address.scss' ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AddressComponent),
        multi: true
    }],
    host: {
        '[attr.class]': 'options.className'
    }
})
export class AddressComponent implements OnInit, OnChanges, ControlValueAccessor {

    @Input()
    public options: Options;

    @Input()
    public values: any;

    @Output()
    public onSelected: EventEmitter<Result> = new EventEmitter();

    public _t: AddressService;

    constructor( @Inject(ElementRef) public element: ElementRef) {
        this.onClose = this.onClose.bind(this);
        this._t = new AddressService();
    }

    ngOnInit(): void {
    }

    onOpen() {
        this._t.opened = true;
    }

    onClose() {
        this._t.opened = false;
    }

    onTabChange(index: number) {
        this._t.setHead(index);
    }

    private notify() {
        this.onTouched();
        this.onChange(this._t.result.id);
        this.onSelected.emit(this._t.result);
    }

    onItem(bdIndex: number, key: string, id: string, item: any) {
        this._t.onSelected(bdIndex, id, item);
        this.notify();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.options = this._t.initData(this.options);
            this.notify();
            return;
        }
        if (changes.values) {
            setTimeout(() => {
                this._t.setAddress(changes.values.currentValue);
            });
        }
    }

    writeValue(obj: any): void {
        if (obj && obj !== this._t.result.id) {
            setTimeout(() => {
                this._t.setAddress(obj);
            });
        }
    }

    protected onChange: any = Function.prototype;
    protected onTouched: any = Function.prototype;

    public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
    public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

    setDisabledState(isDisabled: boolean): void {
    }

}

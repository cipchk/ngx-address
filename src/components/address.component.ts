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
    styles: [`
.ngx-address{font-size:12px;outline:0;position:relative;cursor:pointer;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.ngx-address *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.ngx-address-title{padding:4px 8px;border:1px solid #ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ccc}.ngx-address-title .arrow{position:absolute;top:10px;right:8px;width:10px;height:5px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpinDlzJgMDQ1paGgMqmDVrFpBkgkhAOGhyQCkmuFa4CrgckGT8//8/sigEwO1iwhRCdgdAgAEAbbUZNeMBbuoAAAAASUVORK5CYII=") 0 0 no-repeat}.ngx-address-title.has{color:#333}.ngx-address-title.has .separator{color:#cfcfcf;padding:0 4px}.ngx-address-overlay{position:absolute;left:-9999px;top:-9999px;z-index:999999;outline:0;width:100%;-webkit-tap-highlight-color:transparent}.ngx-address-select-tab{border-bottom:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;height:35px;display:flex;align-items:center;justify-content:space-around;background:#f0f0f0}.ngx-address-select-tab a{display:block;height:100%;width:100%;color:#333;text-align:center;line-height:35px;border-left:1px solid #ccc;border-bottom:1px solid transparent;text-decoration:none;outline:0}.ngx-address-select-tab .current{background:#fff;border-bottom:1px solid #fff;color:#f60}.ngx-address-select{border:1px #ccc solid;border-top:0;padding:10px 15px;background:#fff}.ngx-address-select dl{display:flex;margin:0;padding:3px 0;line-height:2}.ngx-address-select dt{width:35px;line-height:2;padding-right:10px;font-weight:700;text-align:right}.ngx-address-select dd{margin-left:0;flex:1}.ngx-address-select a{display:inline-block;line-height:2;text-decoration:none;color:#333;padding:0 10px;outline:0;text-decoration:none;white-space:nowrap}.ngx-address-select a:hover,.ngx-address-select a:focus{background-color:#fff8f3;border-radius:2px;color:#f60}.ngx-address-select a.current{background-color:#f60;color:#fff;border-radius:2px}.ngx-address-tips{border-top:1px solid #ccc;color:#ccc}.ngx-address-tips p{margin:0;line-height:2}
    `],
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

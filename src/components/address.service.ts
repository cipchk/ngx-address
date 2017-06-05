import { Result } from './interfaces/result';
import { DataItem } from './interfaces/data-item';
import { Data } from './interfaces/data';
import { Options } from './interfaces/options';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Injectable, EventEmitter } from '@angular/core';
import { DataType } from "../index";

export class AddressService {

    private options: Options;

    public inited: boolean = false;
    public opened: boolean = false;

    public hd: any[] = [];
    public bd: any[] = [];
    public title: string;
    public result: Result;
    public max: number = 0;

    constructor() { }

    /**
     * 初始化数据
     */
    initData(options: Options) {
        this.inited = false;

        this.title = '';
        this.result = {
            id: '',
            name: '',
            paths: []
        };
        this.options = Object.assign({
            separator: '/',
            placeholder: '请选择省市区',
            types: ['省份', '城市', '县区'],
            offset: { x: 0, y: 25 },
            jumps: []
        }, options);

        if (!this.options.data && !this.options.http) throw new Error('数据源 `data` 或 `http` 至少必须指定一项');

        this.hd = [];
        this.bd = [];
        this.options.types.forEach((value, index) => {
            this.hd.push({ name: value, index: index, selected: index === 0 });
            this.bd.push({
                index: index,
                selected: index === 0,
                data: {}
            });
        });
        this.max = this.options.types.length;
        this.load(0, this.result.id).subscribe(res => {
            this.inited = true;
        });

        return this.options;
    }

    /**
     * 设置选项卡选中状态
     */
    setHead(index: number) {
        this.hd.forEach(i => {
            i.selected = index === i.index;
        });
        this.bd.forEach(i => {
            i.selected = index === i.index;
        });
    }

    private findItem(index: number, id: string): DataItem {
        let items = this.bd[index].data.items,
            res;
        for (let key in items) {
            res = items[key].find((i: any) => id === i.id);
            if (res) break;
        }
        return res;
    }

    private parseAddress(data: string): string[] {
        // xx xx xx 不含街道
        const notStree = data.length === 6;
        // xx xx xx xxx 含街道
        const hasStree = data.length === 9;
        if (!notStree && !hasStree) return [];

        let res: string[];
        if (notStree) {
            return Array(3).fill('').map((v, index) => {
                return (data.substr(0, (index + 1) * 2) + '000000').substr(0, 6);
            });
        } else if (hasStree) {
            return Array(4).fill('').map((v, index) => {
                return index > 2 ? data : (data.substr(0, (index + 1) * 2) + '000000').substr(0, 6);
            });
        }

        return [];
    }

    private putResult(bdIndex: number, id: string, item: DataItem, isClear: boolean = true) {
        let items = this.bd[bdIndex].data.items;
        for (let key in items) {
            items[key].forEach((i: any) => {
                i.selected = id === i.id;
            });
        }

        item = Object.assign({}, item);
        this.result.id = id;
        this.result.name = item.name;
        this.result.paths = this.result.paths.slice(0, bdIndex);
        delete item['selected'];
        this.result.paths.push(item);
        this.title = this.result.paths.map((i: DataItem) => i.name).join(`<i class="separator">${this.options.separator}</i>`)
        if (isClear) {
            this.bd.forEach(i => {
                if (i.index > bdIndex)
                    i.data = {};
            });
        }
    }

    /**
     * 设置地址
     * 
     * @param {any} 字符串数组，数组数量必须与 {options.types.length} 一致 
     */
    setAddress(data: any) {
        if (!data) return;

        let that = this,
            addresss: string[];
        if (typeof data === 'string') {
            addresss = that.parseAddress(data.toString());
        } else {
            addresss = data instanceof Array ? data : [];
        }

        const max = that.options.types.length;
        let load$: Observable<any>[] = [];
        addresss.forEach((value, index) => {
            if (index >= max) return;
            load$.push(that.load(index, index > 0 ? addresss[index - 1] : '', value));
        });
        // 检查下一个面板是否存在，存在还需要加载数据
        const isLimit = max > addresss.length;
        if (isLimit) {
            load$.push(that.load(addresss.length, addresss[addresss.length - 1]));
        }

        Observable.forkJoin(...load$).subscribe(ls => {
            for (let item of ls) {
                this.putResult(item.index, item.value, this.findItem(item.index, item.value), false);
            }
            if (isLimit) this.setHead(addresss.length);
        });
    }

    onSelected(bdIndex: number, id: string, item: DataItem) {
        let that = this;
        that.putResult(bdIndex, id, item);
        // 自动关闭
        ++bdIndex;
        if (bdIndex >= that.max) {
            that.opened = false;
        } else {
            that.setHead(bdIndex);
            that.load(bdIndex, that.result.id).subscribe(res => {
                if (bdIndex < that.max)
                    that.jump(bdIndex);
            });
        }
    }

    private load(index: number, id: string, defaultValue?: string): Observable<{ index: number, value: any }> {
        return new Observable(obs => {
            const fn = this.options.data || this.options.http;
            fn(index, id).subscribe((res: Data) => {
                const returnValue = {
                    index: index,
                    value: defaultValue
                };
                if (res) {
                    this._renderData(index, res, defaultValue);
                    obs.next(returnValue);
                    obs.complete();
                    return;
                }

                // 当只有HTTP请求时不再处理
                if (this.options.data && this.options.http) {
                    this.options.http(index, id).subscribe((httpRes: Data) => {
                        this._renderData(index, httpRes, defaultValue);
                        obs.next(returnValue);
                        obs.complete();
                    }, err => {
                        obs.error(err);
                        obs.complete();
                    });
                }

            }, err => {
                obs.error(err);
                obs.complete();
            });
        });
    }

    private _renderData(index: number, res: Data, defaultValue?: string) {
        if (!res) res = { type: DataType.list, list: [], group: {} };
        let items = res.type === DataType.list ? { '': res.list } : Object.assign({}, res.group);
        let tips: any[] = [];
        let count: number = 0;
        for (let key in items) {
            items[key].forEach((i: any) => {
                ++count;
                i.selected = defaultValue === i.id;
                if (i.tips === true)
                    tips.push(i);
            });
            items[key] = items[key].filter((i: any) => i.tips !== true);
        }
        this.bd[index].data = {
            type: res.type,
            items: items,
            tips: tips || []
        };

        if (count === 0) {
            this.opened = false;
        }
    }

    private jump(index: number) {
        // jumps
        const items = this.bd[index].data.items;
        for (let key in items) {
            let jumpItem = items[key].find((i: DataItem) => ~this.options.jumps.indexOf(i.id));
            if (jumpItem) {
                this.onSelected(index, jumpItem.id, jumpItem);
            }
        }
    }

}

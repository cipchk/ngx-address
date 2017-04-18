/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, ResponseContentType, Response } from '@angular/http';
import { DataType, Data } from 'ngx-address';
import { AddressDataChinaService } from 'ngx-address/data/china';
import { AddressDataCNService } from 'ngx-address/data/cn';
import { AddressDataKotService } from 'ngx-address/data/kot';
import { AddressDataTWService } from 'ngx-address/data/tw';
import { AddressDataMaService } from 'ngx-address/data/ma';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {


    public stan: any = {
        id: '',
        result: {},
        values: [],
        options: {
            className: 'my-class'
        }
    };
    public stan_stree: any = {
        id: '',
        result: {},
        options: {
            placeholder: '请选择城、县区、街道',
            types: ['省份', '城市', '县区', '街道']
        }
    };

    public custom: any;
    public address: any[] = [];
    public typeShow: boolean = false;
    public type: '';

    public code: any = `<code>{
    types: ['区域', '公司', '部门'],
    http: (index: number, id: string) => {
        return new Observable(observer => {
            const _tmp: Data = {
                type: DataType.list,
                list: [] // 请求数据
            };
            observer.next(_tmp);
            observer.complete();
        });
    }
}</code>`;

    constructor(private _http: Http,
        private china: AddressDataChinaService,
        private cn: AddressDataCNService,
        private kot: AddressDataKotService,
        private tw: AddressDataTWService,
        private ma: AddressDataMaService) {

        this.stan.options.jumps = this.china.getJumps();
        this.stan.options.data = this.china.getData.bind(this.china);
        
        this.stan_stree.options.jumps = this.china.getJumps();
        this.stan_stree.options.data = this.china.getData.bind(this.china);
        this.stan_stree.options.http = (index: number, id: string): Observable<Data> => {
            return new Observable(observer => {
                let res: Data = {
                    type: DataType.list, 
                    list: [
                        { id: '310105001', name: '华阳路街道' },
                        { id: '310105002', name: '江苏路街道' }
                    ]
                };
                observer.next(res);
                observer.complete();
            });
        };

        let customData = [];
        let types = ['区域', '公司', '部门'];
        this.custom = {
            id: '',
            result: {},
            options: {
                placeholder: '请选择区域、公司、部门',
                types: types,
                http: (index: number, id: string) => {
                    return new Observable(observer => {
                        if (customData.findIndex(w => w.index === index) === -1) {
                            customData.push(...Array.from({
                                length: Math.floor(Math.random() * 10) + 1
                            }).map((item, idx) => {
                                return {
                                    index: index,
                                    id: (index + 1) + idx,
                                    name: types[index] + '-' + idx,
                                    other_data: true
                                }
                            }))
                        }
                        const _tmp: Data = {
                            type: DataType.list,
                            list: customData.filter(w => w.index === index)
                        };
                        observer.next(_tmp);
                        observer.complete();
                    });
                }
            }
        };

        this.address.push({
            id: '',
            type: 'China[AddressDataChinaService]',
            options: {
                types: this.china.getTypes(),
                jumps: this.china.getJumps(),
                data: this.china.getData.bind(this.china)
            }
        });
        this.address.push({
            id: '',
            type: 'CN[AddressDataCNService]',
            options: {
                types: this.cn.getTypes(),
                jumps: this.cn.getJumps(),
                data: this.cn.getData.bind(this.cn)
            }
        });
        this.address.push({
            id: '',
            type: 'kot（港澳）[AddressDataKotService]',
            options: {
                placeholder: '请选择城市',
                types: this.kot.getTypes(),
                jumps: this.kot.getJumps(),
                data: this.kot.getData.bind(this.kot)
            }
        });
        this.address.push({
            id: '',
            type: 'tw（台湾）[AddressDataTWService]',
            options: {
                placeholder: '请选择城市',
                types: this.tw.getTypes(),
                jumps: this.tw.getJumps(),
                data: this.tw.getData.bind(this.tw)
            }
        });
        this.address.push({
            id: '',
            type: 'ma（马来西亚）[AddressDataMaService]',
            options: {
                placeholder: '请选择城市',
                types: this.ma.getTypes(),
                jumps: this.ma.getJumps(),
                data: this.ma.getData.bind(this.ma)
            }
        });
    }

    onStanSelected(value: any) {
        this.stan.result = value;
    }

    onStanSetHasStree() {
        this.stan.values = [];
        this.stan.options = { ...this.stan_stree.options };
    }

    onStanSetNotStree() {
        this.stan.values = [];
        this.stan.options = {
            jumps: this.china.getJumps(),
            data: this.china.getData.bind(this.china)
        };
    }

    onStanStreeSelected(value: any) {
        this.stan_stree.result = value;
    }

    onCustomSelected(value: any) {
        this.custom.result = value;
    }

    ngOnInit() {
        setTimeout(() => {
            // this.demo2.id = '111';
        }, 1000 * 3)
    }

}

# ngx-address
A simple address picker in angular.

[![NPM version](https://img.shields.io/npm/v/ngx-address.svg)](https://www.npmjs.com/package/ngx-address)
[![Build Status](https://travis-ci.org/cipchk/ngx-address.svg?branch=master)](https://travis-ci.org/cipchk/ngx-address)

<!-- TOC -->

- [Usage](#usage)
- [DEMO](#demo)
- [API](#api)
    - [ngx-address](#ngx-address)
    - [[options]](#options)
    - [[values]](#values)
    - [(onSelected)](#onselected)
    - [Options Interface](#options-interface)
    - [Result Interface](#result-interface)
- [Address Library](#address-library)
    - [List](#list)
    - [User Defined](#user-defined)
    - [NOTE](#note)
- [Troubleshooting](#troubleshooting)

<!-- /TOC -->

## Usage

Install `ngx-address` from `npm`

```
npm install ngx-address --save
```

Import the `NgxAddressModule` in to your root `AppModule`.

```
import { NgxAddressModule } from 'ngx-address';

@NgModule({
    imports: [BrowserModule, NgxAddressModule ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

```
import { AddressDataChinaService } from 'ngx-address/data/china';

@Component({
    selector: 'demo',
    template: `
        <ngx-address 
        [(ngModel)]="id" 
        [options]="opt"></ngx-address>
    `
})
export class DemoComponent implements OnInit {
    public id: any;
    public opt: any;
    constructor(private china: AddressDataChinaService) {
        this.opt = {
            jumps: this.china.getJumps(),
            data: this.china.getData.bind(this.china)
        };
    }
}
```

## DEMO

[Live Demo](https://cipchk.github.io/ngx-address/)

## API

```
<ngx-address 
    [(ngModel)]="custom.id" 
    [options]="custom.options"
    [values]="custom.values"
    (onSelected)="onCustomSelected($event)"></ngx-address>
```

### [options]

参数配置项，参数的变更（指整个 `options` 对象变更而非对象下某个属性）会使组件重新初始化，见[Options](#options-interface)。

### [values]

设置默认地址值，传递值可是**字符串编号**或与 _options.types.length_ 等同数量的**字符串数组**。

默认 ngx-address 实现了一套以国家标准地址区域代码信息规则。

_标准市县区规则_

310105：表示【上海-长宁】，最终会解析成：[ '310000', '310100', '310105' ]

_标准市县区街道规则_

310105001：表示【上海-长宁-某街道】，最终会解析成：[ '310000', '310100', '310105', '310105001' ]

如果你使用的 `id` 编号是以上两种规则之一的话，那么 `(values)` 完全可以**忽略**，因为 `[(ngModel)]` 本身是双向绑定，ngx-address 会自动根据外部变化重新选择，更多体验见[Live Demo](https://cipchk.github.io/ngx-address/)。

### (onSelected)

每一次选择会触一次，接收一个 `Result` 参数，见[Result](#result-interface)。

由于默认ngx-adress组件并不包括地址数据，所以需要定义 `options`，可以自定义获取或使用[内置的地址库](#address-library)。

```
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
                            name: types[index] + '-' + idx
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

onCustomSelected(value: any) {
    this.custom.result = value;
}
```

### Options Interface

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| placeholder | string | 请选择省市区 | 提示信息 ||
| separator | string | / | 提示分隔符信息 ||
| types | string[] | [ '省份', '城市', '县区' ] | 数据类型集合 ||
| jumps | string[] |  | 可被跳过的面板，以 `id` 为判断标准 |
| data | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| http | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| setAddress | Function |  | 返回 `Observable<string[]>` 类型（数组数量必须与 {types.length} 一致） 。 |
| className | string |  | 面板样式，同 `class`。 |
| offset | { x: number, y: number } | { x: 0, y: 25 } | 面板偏移值 |

### Result Interface

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| id | string |  | 编号 |
| name | string |  | 名称 |
| paths | any[] |  | 已选择路径项 |

## Address Library

ngx-address 还内置几种地址库，所有中国地址库都是按[国家标准地址区域代码信息](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html)为准，地址库与 ngx-address 属于独立模块，需要单独引入。

```
import { AddressDataChinaModule } from 'ngx-address/data/china';

@NgModule({
    imports: [BrowserModule, AddressDataChinaModule ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

```
constructor(private china: AddressDataChinaService) {
    this.options = {
        types: this.china.getTypes(),
        jumps: this.china.getJumps(),
        // 务必需要 `.bind` 来保证内部 `this` 指针。
        data: this.china.getData.bind(this.china)
    }
}
```

### List

| Module Name | 名称 |  描述 |
| ------- | ------------- | ----- |
| AddressDataChinaModule | 中国（含港澳） | 最小县区级 |
| AddressDataCNModule | 中国（不含港澳） | 最小县区级 |
| AddressDataKotModule | 港澳 | 最小县区级 |
| AddressDataTWModule | 台湾 | 最小县区级 |
| AddressDataMaModule | 马来西亚 | 最小城市级 |

_以上地址库将会持续更新_

### User Defined

通过实现 `IExternalData` 接口，创建属于自己地址库，有关细节可以参考 `src/data/china/data.service.ts`。

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| getTypes | Array<string> |  | 数据类型集合 |
| getJumps | Array<string> |  | 可跳过数据，以 `id` 为判断标准 |
| getData | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| setAddress | Function |  | 返回 `Observable<string[]>` 类型（数组数量必须与 {types.length} 一致） 。 |

### NOTE

ngx-adress 提供静态数据 `data` 和 远程数据 `http` 两个参数，且二者按 `data` > `http` 的顺序执行（当 `data` 结果返回 `null` 或 `undefined` 时尝试调用 `http` 请求）。

因此，可以使用内置地址库配合远程的街道数据一起使用，可以参考[Live Demo](https://cipchk.github.io/ngx-address/)中的【含街道】示例。

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/ngx-address/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/ngx-address/blob/master/LICENSE) file for the full text)

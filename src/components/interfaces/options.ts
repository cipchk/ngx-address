import { Data } from './data';
import { Observable } from 'rxjs/Observable';

/**
 * 配置项
 */
export interface Options {
    /**
     * 提示信息
     * @name 提示信息
     * @type {string}
     * @default '请选择省市区'
     */
    placeholder: string;
    /**
     * 分隔符
     * @name 提示分隔符信息
     * @type {string}
     * @default '/'
     */
    separator: string;
    /**
     * 数据类型
     * @name 数据类型
     * @type {string[]}
     * @default [ '省份', '城市', '县区' ]
     */
    types?: string[];
    /**
     * 可跳过数据
     * @name 可跳过数据
     * @type {string[]}
     */
    jumps?: string[];
    /**
     * 数据源
     * 
     * @type {Observable<Data>}
     */
    data(index: number, id: string): Observable<Data>;
    
    /**
     * 远程数据源，当 data 返回 null或undefined 时调用
     * 
     * @type {Observable<Data>}
     */
    http(index: number, id: string): Observable<Data>;

    /**
     * 设置地址
     * 
     * @param {*} data 
     * @returns {Observable<string[]>} 字符串数组，数组数量必须与 {types.length} 一致 
     */
    setAddress(data: any): Observable<string[]>;

    /**
     * 面板样式
     * @name 面板样式
     * @type {string}
     */
    className: string;
    /**
     * 面板偏移值
     * @name 面板偏移值
     * @type {number}
     * @default { x: 0, y: 25 }
     */
    offset: { x: number, y: number };
}

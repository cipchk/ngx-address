import { Data } from './data';
import { Observable } from 'rxjs/Observable';

export interface IExternalData {

    /**
     * 数据类型
     * 
     * @returns {Array<string>} 
     */
    getTypes(): Array<string>;

    /**
     * 可跳过数据，以 `id` 为判断标准
     * 
     * @returns {Array<string>} 
     */
    getJumps(): Array<string>;

    /**
     * 数据源
     * 
     * @param {number} 面板下标 
     * @param {string} 数据编号
     * @returns {Observable<Data>} 
     */
    getData(index: number, id: string): Observable<Data>;

    /**
     * 设置地址
     * 
     * @param {*} data 
     * @returns {Observable<string[]>} 字符串数组，数组数量必须与 {types.length} 一致 
     */
    setAddress(data: any): Observable<string[]>;
}

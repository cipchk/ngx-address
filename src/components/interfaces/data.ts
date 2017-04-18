import { DataType } from './data-type';
import { DataItem } from './data-item';

export interface Data {
    /**
     * 数据类型
     * 
     * @type {DataType}
     */
    type: DataType;

    /**
     * 列表
     * 
     * @type {string}
     */
    list?: Array<DataItem>;

    /**
     * 组
     * 
     * @type {{ [key: string]: Array<DataItem> }}
     */
    group?: any
}

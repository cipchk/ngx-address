/**
 * 数据类型
 */
export enum DataType {
    list = 1,
    group = 2
}

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

export interface DataItem {
    [key: string]: any;
    /**
     * 编号
     * 
     * @type {string}
     */
    id: string;

    /**
     * 名称
     * 
     * @type {string}
     */
    name: string;

    /**
     * 提醒
     * 
     * @type {boolean}
     */
    tips?: boolean;
}

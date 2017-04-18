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

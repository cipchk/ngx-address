import { IExternalData } from './../../components/interfaces/external-data';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DataType } from '../../components/interfaces/data-type'
import { Data } from '../../components/interfaces/data'
import { Subscriber } from "rxjs/Subscriber";

@Injectable()
export class AddressDataKotService implements IExternalData {

    constructor() {
    }

    private get provinces(): Data {
        return {
            type: DataType.list,
            list: [ { "id": "810000", "name": "香港" }, { "id": "820000", "name": "澳门" }]
        };
    };

    private get cities(): Array<any> {
        return [["810200","九龙","810000","0"],["810205","观塘","810200","0"],["810204","黄大仙","810200","0"],["810201","九龙城","810200","0"],["810203","深水埗","810200","0"],["810202","油尖旺","810200","0"],["810100","香港岛","810000","0"],["810103","东区","810100","0"],["810104","南区","810100","0"],["810102","湾仔","810100","0"],["810101","中西","810100","0"],["810300","新界","810000","0"],["810301","北区","810300","0"],["810302","大埔","810300","0"],["810308","葵青","810300","0"],["810309","离岛","810300","0"],["810307","荃湾","810300","0"],["810303","沙田","810300","0"],["810306","屯门","810300","0"],["810304","西贡","810300","0"],["810305","元朗","810300","0"],["820100","澳门半岛","820000","0"],["820200","离岛","820000","0"]
        ];
    }

    private cachedMap: any = {

    };

    public getTypes(): Array<string> {
        return ['其他', '城市', '县区'];
    }

    public getJumps(): Array<string> {
        return [];
    }

    public getData(index: number, id: string): Observable<Data> {
        return new Observable(observer => {
            if (index > 2) {
                observer.next(null);
                observer.complete();
                return;
            }
            if (!id) {
                observer.next(this.provinces);
                observer.complete();
                return;
            }

            let _c = this.cachedMap[id];
            if (!_c) {
                _c = {
                    type: DataType.list,
                    list: this.cities.filter((value, index) => {
                        return value[2] == id;
                    }).map(item => {
                        let res: any = {
                            id: item[0],
                            name: item[1]
                        };
                        if (item[3] === '3')
                            res.tips = true;
                        return res;
                    })
                };

                this.cachedMap[id] = _c;
            }

            observer.next(_c);
            observer.complete();
        });
    }

    public setAddress(data: any): Observable<string[]> {
        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }

}


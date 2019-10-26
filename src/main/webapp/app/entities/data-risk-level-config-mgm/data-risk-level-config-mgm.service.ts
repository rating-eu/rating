import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {DataRiskLevelConfigMgm} from './data-risk-level-config-mgm.model';
import {createRequestOption} from '../../shared';
import {DataOperationMgm} from "../data-operation-mgm";
import {MyAssetMgm} from "../my-asset-mgm";

export type EntityResponseType = HttpResponse<DataRiskLevelConfigMgm>;

const OPERATION_ID = '{operationID}';

@Injectable()
export class DataRiskLevelConfigMgmService {

    private resourceUrl = SERVER_API_URL + 'api/data-risk-level-configs';
    private resourceByDataOperationUrl = SERVER_API_URL + 'api/data-risk-level-configs/operation/' + OPERATION_ID;

    constructor(private http: HttpClient) {
    }

    create(dataRiskLevelConfig: DataRiskLevelConfigMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataRiskLevelConfig);
        return this.http.post<DataRiskLevelConfigMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(dataRiskLevelConfig: DataRiskLevelConfigMgm): Observable<EntityResponseType> {
        const copy = this.convert(dataRiskLevelConfig);
        return this.http.put<DataRiskLevelConfigMgm>(this.resourceUrl, copy, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    updateAllConfigsByDataOperation(dataOperation: DataOperationMgm, configs: DataRiskLevelConfigMgm[]): Observable<HttpResponse<DataRiskLevelConfigMgm[]>> {
        const url = this.resourceByDataOperationUrl.replace(OPERATION_ID, String(dataOperation.id));

        return this.http.put<DataRiskLevelConfigMgm[]>(url, configs, {observe: 'response'})
            .map((res: HttpResponse<DataRiskLevelConfigMgm[]>) => this.convertArrayResponse(res));
    }


    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DataRiskLevelConfigMgm>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DataRiskLevelConfigMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<DataRiskLevelConfigMgm[]>(this.resourceUrl, {params: options, observe: 'response'})
            .map((res: HttpResponse<DataRiskLevelConfigMgm[]>) => this.convertArrayResponse(res));
    }

    getAllByDataOperation(operationID: number): Observable<HttpResponse<DataRiskLevelConfigMgm[]>> {
        const options = createRequestOption();
        return this.http.get<DataRiskLevelConfigMgm[]>(this.resourceByDataOperationUrl.replace(OPERATION_ID, String(operationID)), {
            params: options,
            observe: 'response'
        })
            .map((res: HttpResponse<DataRiskLevelConfigMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataRiskLevelConfigMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataRiskLevelConfigMgm[]>): HttpResponse<DataRiskLevelConfigMgm[]> {
        const jsonResponse: DataRiskLevelConfigMgm[] = res.body;
        const body: DataRiskLevelConfigMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataRiskLevelConfigMgm.
     */
    private convertItemFromServer(dataRiskLevelConfig: DataRiskLevelConfigMgm): DataRiskLevelConfigMgm {
        const copy: DataRiskLevelConfigMgm = Object.assign({}, dataRiskLevelConfig);
        return copy;
    }

    /**
     * Convert a DataRiskLevelConfigMgm to a JSON which can be sent to the server.
     */
    private convert(dataRiskLevelConfig: DataRiskLevelConfigMgm): DataRiskLevelConfigMgm {
        const copy: DataRiskLevelConfigMgm = Object.assign({}, dataRiskLevelConfig);
        return copy;
    }
}
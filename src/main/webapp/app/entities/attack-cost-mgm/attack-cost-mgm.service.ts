import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { AttackCostMgm } from './attack-cost-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<AttackCostMgm>;

@Injectable()
export class AttackCostMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/attack-costs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/attack-costs';

    constructor(private http: HttpClient) { }

    create(attackCost: AttackCostMgm): Observable<EntityResponseType> {
        const copy = this.convert(attackCost);
        return this.http.post<AttackCostMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(attackCost: AttackCostMgm): Observable<EntityResponseType> {
        const copy = this.convert(attackCost);
        return this.http.put<AttackCostMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AttackCostMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AttackCostMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackCostMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AttackCostMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AttackCostMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AttackCostMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AttackCostMgm[]>): HttpResponse<AttackCostMgm[]> {
        const jsonResponse: AttackCostMgm[] = res.body;
        const body: AttackCostMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AttackCostMgm.
     */
    private convertItemFromServer(attackCost: AttackCostMgm): AttackCostMgm {
        const copy: AttackCostMgm = Object.assign({}, attackCost);
        return copy;
    }

    /**
     * Convert a AttackCostMgm to a JSON which can be sent to the server.
     */
    private convert(attackCost: AttackCostMgm): AttackCostMgm {
        const copy: AttackCostMgm = Object.assign({}, attackCost);
        return copy;
    }
}

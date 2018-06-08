import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { CompanyGroupMgm } from './company-group-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CompanyGroupMgm>;

@Injectable()
export class CompanyGroupMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/company-groups';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/company-groups';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(companyGroup: CompanyGroupMgm): Observable<EntityResponseType> {
        const copy = this.convert(companyGroup);
        return this.http.post<CompanyGroupMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(companyGroup: CompanyGroupMgm): Observable<EntityResponseType> {
        const copy = this.convert(companyGroup);
        return this.http.put<CompanyGroupMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CompanyGroupMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CompanyGroupMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanyGroupMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanyGroupMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CompanyGroupMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<CompanyGroupMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CompanyGroupMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CompanyGroupMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CompanyGroupMgm[]>): HttpResponse<CompanyGroupMgm[]> {
        const jsonResponse: CompanyGroupMgm[] = res.body;
        const body: CompanyGroupMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CompanyGroupMgm.
     */
    private convertItemFromServer(companyGroup: CompanyGroupMgm): CompanyGroupMgm {
        const copy: CompanyGroupMgm = Object.assign({}, companyGroup);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(companyGroup.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(companyGroup.modified);
        return copy;
    }

    /**
     * Convert a CompanyGroupMgm to a JSON which can be sent to the server.
     */
    private convert(companyGroup: CompanyGroupMgm): CompanyGroupMgm {
        const copy: CompanyGroupMgm = Object.assign({}, companyGroup);

        copy.created = this.dateUtils.toDate(companyGroup.created);

        copy.modified = this.dateUtils.toDate(companyGroup.modified);
        return copy;
    }
}
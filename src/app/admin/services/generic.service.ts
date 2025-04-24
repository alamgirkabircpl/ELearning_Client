// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { PaginatedResponse } from '../models/paginated-response';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class GenericService {

//   constructor(private http: HttpClient, private baseUrl: string) {}

//   getAll(page: number = 1, pageSize: number = 5): Observable<PaginatedResponse<T>> {
//     return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}?pageNumber=${page}&pageSize=${pageSize}`);
//   }
// }

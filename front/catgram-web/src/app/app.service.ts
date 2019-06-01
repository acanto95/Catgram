import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }

    getCats(): Observable<any> {
        return this.http.get('http://localhost:5000/cats');
    }

    updateCats(data): Observable<any> {
        return this.http.post('http://localhost:5000/cats/update', data);
    }

    getFavs(): Observable<any> {
        const  headers = new  HttpHeaders().set('x-api-key', 'd4092dd6-9e37-4eb6-bbcd-0a159a003835');
        return this.http.get('https://api.thecatapi.com/v1/favourites?sub_id=user123', {headers});
    }

    addFav(data): Observable<any> {
        const  headers = new  HttpHeaders().set('x-api-key', 'd4092dd6-9e37-4eb6-bbcd-0a159a003835');
        return this.http.post('https://api.thecatapi.com/v1/favourites', data, {headers});
    }

    deleteFav(data): Observable<any> {
        const  headers = new  HttpHeaders().set('x-api-key', 'd4092dd6-9e37-4eb6-bbcd-0a159a003835');
        return this.http.delete(`https://api.thecatapi.com/v1/favourites/${data.fav_id}`, {headers});
    }

    getBreedIds(term): Observable<any> {
        const qParams = new HttpParams({
            fromObject: {
                term: term
            }
        });
        return this.http.get(`http://localhost:5000/cats/search`, {params: qParams});
    }

    searchCats(breedId): Observable<any> {

        const  headers = new  HttpHeaders().set('x-api-key', 'd4092dd6-9e37-4eb6-bbcd-0a159a003835');


        if (breedId === 'all') {
            const qParams = new HttpParams({
                fromObject: {
                    limit: '50',
                    format: 'jpg'

                }
            });
            return this.http.get('https://api.thecatapi.com/v1/images/search', {params: qParams, headers});

        } else {
            const qParams = new HttpParams({
                fromObject: {
                    breed_id: breedId,
                    format: 'jpg'
                }
            });
            return this.http.get('https://api.thecatapi.com/v1/images/search', {params: qParams, headers});
        }
    }

    insertCat(cat): Observable<any> {
        return this.http.post('http://localhost:5000/cats/insert', cat);
    }
    deleteCat(cat): Observable<any> {
        return this.http.post('http://localhost:5000/cats/delete', cat);
    }
}

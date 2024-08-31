import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Hero, Publisher } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environments.baseUrl

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]> {
    console.log(this.baseUrl);

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }

  getHeroeById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError( error => of(undefined) )
      )
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`).pipe(
      map((heroes: Hero[]) => heroes.filter(hero => hero.superhero.toLocaleLowerCase().includes(query.toLocaleLowerCase())))
    );
  }

  addHero(hero: Hero):Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero(hero: Hero):Observable<Hero>{

    if ( !hero.id ) throw Error('Hero id is required')

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${ hero.id }`, hero)
  }


  deleteHeroById(id: string):Observable<boolean> {

    return this.http.delete<Hero>(`${this.baseUrl}/heroes/${ id }`)
      .pipe(
        map( resp => true),
        catchError( err => of(false)),
      )
  }

}



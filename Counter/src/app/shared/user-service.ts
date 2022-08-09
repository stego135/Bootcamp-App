import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject, of, catchError } from 'rxjs';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private isLoggedInStream: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isLoggedIn: Observable<boolean>;
    private idStream: BehaviorSubject<number> = new BehaviorSubject(0);
    public id: Observable<number>;
    private userUrl: string = 'api/user'
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { 
        this.id = this.idStream.asObservable();
        this.isLoggedIn = this.isLoggedInStream.asObservable();
    }

    getUser(id: number) {
        const url = `${this.userUrl}/${id}`;
        return this.http.get<User>(url);
    }
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.userUrl);
    }
    getId(): Observable<number> {
        return this.id;
    }
    checkEmail(email: string, password: string): Observable<User[]> {
        return this.http.get<User[]>(this.userUrl).pipe(
            map((userList: User[]) => {
                return userList.filter(user => user.email == email && user.password == password);
            })
        )
    }
    logIn(newId: number) {
        this.idStream.next(newId);
        this.isLoggedInStream.next(true);
    }
    getLogIn(): Observable<boolean> {
        return this.isLoggedIn;
    }
    logOut() {
        this.isLoggedInStream.next(false);
        this.idStream.next(0);
    }
    createAccount(newUser: User): Observable<User> {
        return this.http.post<User>(this.userUrl, newUser, this.httpOptions).pipe(
            catchError(this.handleError<User>('addUser'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }
}

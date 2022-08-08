import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, BehaviorSubject } from 'rxjs';
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
    logIn(email: string, password: string): Observable<User[]> {
        return this.http.get<User[]>(this.userUrl).pipe(
            map((userList: User[]) => {
                return userList.filter(user => user.email == email && user.password == password);
            })
        )
    }
    setId(newId: number) {
        this.idStream.next(newId);
    }
    getLogIn(): Observable<boolean> {
        return this.isLoggedIn;
    }
    loggedIn() {
        this.isLoggedInStream.next(true);
    }
    loggedOut() {
        this.isLoggedInStream.next(false);
    }
}

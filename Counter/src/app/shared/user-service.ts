import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private isLoggedIn: boolean = false;
    private idStream: BehaviorSubject<number> = new BehaviorSubject(0);
    public id: Observable<number>;
    private userUrl: string = 'api/user'

    constructor(private http: HttpClient) { 
        this.id = this.idStream.asObservable();
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

}

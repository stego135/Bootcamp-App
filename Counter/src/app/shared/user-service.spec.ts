import { UserService } from "./user-service";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { map, take } from "rxjs";

describe('UserService', () => {
  let service: UserService;
  
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should retrieve the current users', () => {
      const testData = [{id: 1, email: "test@test.com", password: "test"}];

      service.getUsers().subscribe(result => {
          expect(result).toEqual(testData);
          expect(result.length).toBe(1);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.url).toEqual('api/user');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    })
  })

  describe('getOneUser', () => {
    it('should get a single user', () => {
      const testUser = {id: 1, email: "test@test.com", password: "test"};
      const id = 1;
      const testUrl = `api/user/${id}`

      service.getUser(id).subscribe(result => {
        expect(result).toEqual(testUser);
      });

      const req = mockHttp.expectOne('api/user/1');
      expect(req.request.url).toEqual(testUrl);
      expect(req.request.method).toBe('GET');

      req.flush(testUser);
    })

    it('should return empty object for invalid id', () => {
      const wrongId = 0;

      service.getUser(wrongId).subscribe(data => {
        expect(data).toBeNull();
      })

      const req = mockHttp.expectOne('api/user/0');

      req.flush(null);
    })
  })

  describe('checkAccount', () => {
    it('should return an array with matching email and password', () => {
      const testData = [{id: 1, email: "test@test.com", password: "test"},
      {id: 2, email: "testing@test.com", password: "test"}];
      const testUser = [{id: 1, email: "test@test.com", password: "test"}];

      service.checkAccount("test@test.com", "test").subscribe(result => {
        expect(result).toEqual(testUser);
        expect(result.length).toBe(1);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.url).toEqual('api/user');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    })

    it('should return an empty array if none match', () => {
      const testData = [{id: 1, email: "test@test.com", password: "test"},
      {id: 2, email: "testing@test.com", password: "test"}];

      service.checkAccount("test@test.com", "a").subscribe(result => {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.url).toEqual('api/user');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    })
  })

  describe('checkEmail', () => {
    it('should return an array with matching email and password', () => {
      const testData = [{id: 1, email: "test@test.com", password: "test"},
      {id: 2, email: "testing@test.com", password: "test"}];
      const testUser = [{id: 1, email: "test@test.com", password: "test"}];

      service.checkEmail("test@test.com").subscribe(result => {
        expect(result).toEqual(testUser);
        expect(result.length).toBe(1);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.url).toEqual('api/user');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    })

    it('should return an empty array if none match', () => {
      const testData = [{id: 1, email: "test@test.com", password: "test"},
      {id: 2, email: "testing@test.com", password: "test"}];

      service.checkEmail("wow@test.com").subscribe(result => {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.url).toEqual('api/user');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    })
  })

  describe('createAccount', () => {
    it('should add a user to the list', () => {
      const newUser = {id: 3, email: "wow@test.com", password: "e"};
      const testData = [{id: 1, email: "test@test.com", password: "test"},
      {id: 2, email: "testing@test.com", password: "test"}];

      service.createAccount(newUser).subscribe(result => {
        expect(result).toEqual(newUser);
      });

      const req = mockHttp.expectOne('api/user');
      expect(req.request.method).toBe('POST');
      req.flush(newUser);
    })
  })

  describe('logIn', () => {
    it('should properly log in a user', () => {
      service.logIn(1);
      service.getId().pipe(
        take(1),
        map(data => {
          expect(data).toBe(1);
        })
      ).subscribe();

      service.getLogIn().pipe(
        take(1),
        map(data => {
          expect(data).toBeTrue();
        })
      ).subscribe();
    })
  })

  describe('logOut', () => {
    it('should properly log in a user', () => {
      service.logOut();
      service.getId().pipe(
        take(1),
        map(data => {
          expect(data).toBe(0);
        })
      ).subscribe();

      service.getLogIn().pipe(
        take(1),
        map(data => {
          expect(data).toBeFalse();
        })
      ).subscribe();
    })
  })
})
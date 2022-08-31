import { HallOfFameService } from "./hall-of-fame-service"
import { Pokemon } from "./pokemon";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from "./user-service";
import { map, Observable, of, BehaviorSubject, take } from "rxjs";

describe('HallOfFameService', () => {
  let service: HallOfFameService;
  
  let mockHttp: HttpTestingController;

  let userServiceStub: Partial<UserService> = {
    getId(): Observable<number> {
      return of(1);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ { provide: UserService, useValue: userServiceStub } ]
    });
    service = TestBed.inject(HallOfFameService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getShiny', () => {
    it('should return shiny', () => {
      const testData = [{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1}];

      service.getShiny().subscribe((result: Pokemon[]) => {
        expect(result).toEqual(testData);
        expect(result.length).toBe(4);
      })

      const req = mockHttp.expectOne('api/shiny');
      expect(req.request.url).toEqual('api/shiny');
      expect(req.request.method).toBe('GET');

      req.flush(testData);
    }),

    describe('should return different pokemon depending on userId', () => {
      let idStream = new BehaviorSubject(0);
      const testData = [{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1},
      {id: 5, name: "Regieleki", count: 6310, userId: 2},
      {id: 6, name: "Toxel", count: 2174, userId: 2},
      {id: 7, name: "Yungoos", count: 87, userId: 2},
      {id: 8, name: "Latios", count: 635, userId: 2}];
      const returnData2 = [{id: 5, name: "Regieleki", count: 6310, userId: 2},
      {id: 6, name: "Toxel", count: 2174, userId: 2},
      {id: 7, name: "Yungoos", count: 87, userId: 2},
      {id: 8, name: "Latios", count: 635, userId: 2}];
      const returnData1 = [{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1}];

      let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      httpClientSpy.get.and.returnValue(of(testData));
      let userServiceSpy = jasmine.createSpyObj('UserService', ['getId']);
      userServiceSpy.getId.and.returnValue(idStream.asObservable());
      let newService = new HallOfFameService(httpClientSpy, userServiceSpy);

      it('should return certain values for userid 1', () => {
        idStream.next(1);
        newService.getShiny().pipe(
          take(1),
          map((result: Pokemon[]) => {
            expect(result).toEqual(returnData1);
            expect(result.length).toBe(4);
          })
        ).subscribe()
      })

      it('should return certain values for userId 2', () => {
        idStream.next(2);
        newService.getShiny().pipe(
          take(1),
          map((result: Pokemon[]) => {
            expect(result).toEqual(returnData2);
            expect(result.length).toBe(4);
          })
        ).subscribe();
      })
    }),

    describe('addShiny', () => {
      it('should add a pokemon to the list', () => {
        const newPokemon = {id: 9, name: "Mewtwo", count: 50, userId: 1};
        const testData = [{id: 1, name: "Raticate", count: 3, userId: 1},
        {id: 2, name: "Audino", count: 4914, userId: 1},
        {id: 3, name: "Cresselia", count: 3629, userId: 1},
        {id: 4, name: "Axew", count: 497, userId: 1},
        {id: 5, name: "Regieleki", count: 6310, userId: 2},
        {id: 6, name: "Toxel", count: 2174, userId: 2},
        {id: 7, name: "Yungoos", count: 87, userId: 2},
        {id: 8, name: "Latios", count: 635, userId: 2}];

        service.addPokemon(newPokemon).subscribe((result: Pokemon) => {
          expect(result).toEqual(newPokemon);
        });
  
        const getreq = mockHttp.expectOne('api/shiny');
        expect(getreq.request.method).toBe('GET');
        getreq.flush(testData);

        const req = mockHttp.expectOne('api/shiny');
        expect(req.request.method).toBe('POST');
        req.flush(newPokemon);
      })
    }),

    describe('changePhrase', () => {
      it('should properly change the sorting phrase', () => {
        service.changePhrase("time");
        service.sortedBy.pipe(
          take(1),
          map((result: string) => {
            expect(result).toBe("time");
          })
        ).subscribe();
        service.changePhrase("asc");
        service.sortedBy.pipe(
          take(1),
          map((result: string) => {
            expect(result).toBe("asc");
          })
        ).subscribe();
        service.changePhrase("desc");
        service.sortedBy.pipe(
          take(1),
          map((result: string) => {
            expect(result).toBe("desc");
          })
        ).subscribe();
      })
    })

    describe('should sort data depending on phrase', () => {
      const testData = [{id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1}];
      const time = [{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1}];
      const asc = [{id: 1, name: "Raticate", count: 3, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 2, name: "Audino", count: 4914, userId: 1}];
      const desc = [{id: 2, name: "Audino", count: 4914, userId: 1},
      {id: 3, name: "Cresselia", count: 3629, userId: 1},
      {id: 4, name: "Axew", count: 497, userId: 1},
      {id: 1, name: "Raticate", count: 3, userId: 1}];

      it('should return sorted array for time', () => {
        const sortedTime = service.sortShiny(testData, "time");

        expect(sortedTime).toEqual(time);
      })

      it('should return sorted array for asc', () => {
        const sortedAsc = service.sortShiny(testData, "asc");

        expect(sortedAsc).toEqual(asc);
      })

      it('should return sorted array for desc', () => {
        const sortedDesc = service.sortShiny(testData, "desc");

        expect(sortedDesc).toEqual(desc);
      })
    })
  })
})
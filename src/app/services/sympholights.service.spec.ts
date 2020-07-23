import { TestBed } from '@angular/core/testing';

import { SympholightsService } from './sympholights.service';

describe('SympholightsService', () => {
  let service: SympholightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SympholightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

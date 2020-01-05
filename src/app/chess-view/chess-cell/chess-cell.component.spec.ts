import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessCellComponent } from './chess-cell.component';

describe('ChessCellComponent', () => {
  let component: ChessCellComponent;
  let fixture: ComponentFixture<ChessCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

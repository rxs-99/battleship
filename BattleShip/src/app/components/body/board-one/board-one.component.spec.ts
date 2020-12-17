import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOneComponent } from './board-one.component';

describe('BoardOneComponent', () => {
  let component: BoardOneComponent;
  let fixture: ComponentFixture<BoardOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

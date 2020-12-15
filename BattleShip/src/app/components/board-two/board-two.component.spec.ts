import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTwoComponent } from './board-two.component';

describe('BoardTwoComponent', () => {
  let component: BoardTwoComponent;
  let fixture: ComponentFixture<BoardTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

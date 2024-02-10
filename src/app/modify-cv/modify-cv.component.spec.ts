import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCvComponent } from './modify-cv.component';

describe('ModifyCvComponent', () => {
  let component: ModifyCvComponent;
  let fixture: ComponentFixture<ModifyCvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyCvComponent]
    });
    fixture = TestBed.createComponent(ModifyCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarseatinspectionComponent } from './carseatinspection.component';

describe('CarseatinspectionComponent', () => {
  let component: CarseatinspectionComponent;
  let fixture: ComponentFixture<CarseatinspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarseatinspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarseatinspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

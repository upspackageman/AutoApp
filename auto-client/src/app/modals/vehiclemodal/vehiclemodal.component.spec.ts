import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclemodalComponent } from './vehiclemodal.component';

describe('VehiclemodalComponent', () => {
  let component: VehiclemodalComponent;
  let fixture: ComponentFixture<VehiclemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclemodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

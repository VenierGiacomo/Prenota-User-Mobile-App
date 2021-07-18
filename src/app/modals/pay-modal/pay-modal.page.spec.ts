import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayModalPage } from './pay-modal.page';

describe('PayModalPage', () => {
  let component: PayModalPage;
  let fixture: ComponentFixture<PayModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

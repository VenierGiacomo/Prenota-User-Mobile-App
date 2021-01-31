import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelModalPage } from './cancel-modal.page';

describe('CancelModalPage', () => {
  let component: CancelModalPage;
  let fixture: ComponentFixture<CancelModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

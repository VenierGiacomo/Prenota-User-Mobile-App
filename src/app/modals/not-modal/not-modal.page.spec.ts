import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotModalPage } from './not-modal.page';

describe('NotModalPage', () => {
  let component: NotModalPage;
  let fixture: ComponentFixture<NotModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

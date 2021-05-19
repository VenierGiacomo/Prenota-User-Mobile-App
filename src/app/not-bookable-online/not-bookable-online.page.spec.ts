import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotBookableOnlinePage } from './not-bookable-online.page';

describe('NotBookableOnlinePage', () => {
  let component: NotBookableOnlinePage;
  let fixture: ComponentFixture<NotBookableOnlinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotBookableOnlinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotBookableOnlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoPagePage } from './info-page.page';

describe('InfoPagePage', () => {
  let component: InfoPagePage;
  let fixture: ComponentFixture<InfoPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

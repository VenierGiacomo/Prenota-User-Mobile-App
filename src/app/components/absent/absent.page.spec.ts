import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AbsentPage } from './absent.page';

describe('AbsentPage', () => {
  let component: AbsentPage;
  let fixture: ComponentFixture<AbsentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AbsentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

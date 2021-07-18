import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareAppoSocialPage } from './share-appo-social.page';

describe('ShareAppoSocialPage', () => {
  let component: ShareAppoSocialPage;
  let fixture: ComponentFixture<ShareAppoSocialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAppoSocialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAppoSocialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

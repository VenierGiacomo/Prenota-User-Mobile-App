import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookedByOthersPage } from './booked-by-others.page';

describe('BookedByOthersPage', () => {
  let component: BookedByOthersPage;
  let fixture: ComponentFixture<BookedByOthersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookedByOthersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookedByOthersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

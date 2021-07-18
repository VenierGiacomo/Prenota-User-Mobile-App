import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookModalPage } from './book-modal.page';

describe('BookModalPage', () => {
  let component: BookModalPage;
  let fixture: ComponentFixture<BookModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

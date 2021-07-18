import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusTicketPage } from './bus-ticket.page';

describe('BusTicketPage', () => {
  let component: BusTicketPage;
  let fixture: ComponentFixture<BusTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

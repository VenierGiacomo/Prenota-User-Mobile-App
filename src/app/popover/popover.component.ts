import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popoverController:PopoverController, private plt: Platform) { }
@Input() homeref
@Input() appo
  ngOnInit() {}
  async deleteappo(){
    await this.dismissPopover()
    this.homeref.wanttodelete(this.appo)
    
  }
  async openMap(){
    if (this.plt.is('android')) {
      window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + this.appo.location;
    } else {
      window.location.href = 'maps://maps.apple.com/?q=' + this.appo.location;
    }
  }
  async dismissPopover() {
    await this.popoverController.dismiss()
  }
}

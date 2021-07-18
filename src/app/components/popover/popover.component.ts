import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() desc
  constructor(private popoverController:PopoverController, private plt: Platform) { }

  ngOnInit() {}
  
  async dismissPopover() {
    await this.popoverController.dismiss()
  }
}

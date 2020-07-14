import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

async setAppointment(service){
  let oldAppointments =  await this.getAppoitments()
  console.log(oldAppointments)
  oldAppointments.push(service)
  console.log(oldAppointments)
  this.storage.set('appointments',oldAppointments)
    }

 async getAppoitments(){
    var services   = await  this.storage.get('appointments');
    return services == null ? [] : services;
    }
  deleteappointments(){
    this.storage.remove('appointments')
  }
deletestorage(){
  this.storage.clear()
}
}

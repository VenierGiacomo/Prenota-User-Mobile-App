import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

async setAppointment(service){
  let oldAppointments =  await this.getAppoitments()
  if(oldAppointments.length==0){
    service.index =0
  }else {
    let maxId = oldAppointments[oldAppointments.length-1].index
    service.index = maxId + 1
  }
  oldAppointments.push(service)
  this.storage.set('appointments',oldAppointments)
    }
 
 async getAppoitments(){
    var services   = await  this.storage.get('appointments');
    return services == null ? [] : services;
    }
  deleteappointments(){
    this.storage.remove('appointments')
  }
  async deleteappointment(id){
    var appointments = await this.getAppoitments()
    var appointments_new = appointments.filter((appointment)=> {if(appointment.index != id){ return appointment}})
    this.storage.set('appointments',appointments_new)
  }
deletestorage(){
  this.storage.clear()
}
async setShops(shops){
  await this.storage.set('shops_list',shops)
}
async getShops(){
  var shops = await  this.storage.get('shops_list')
  return shops == null ? [] : shops;
}
async setPaymentMethods(data){
  await this.storage.set('payment_methods',data)
}
async getPaymentMethods(){
  var shops = await  this.storage.get('payment_methods')
  return shops == null ? [] : shops;
}
async clearPaymentMethods(){
  var shops = await  this.storage.remove('payment_methods')
  return shops == null ? [] : shops;
}
}

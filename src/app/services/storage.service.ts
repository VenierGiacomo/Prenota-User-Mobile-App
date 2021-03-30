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
  var fav_shops= await this.getFavShops()  
  var new_fav_shops=[]
  for(let shop of fav_shops){
    var new_shop = shops.filter(val=>{return val.id==shop.id})
    new_fav_shops.push(new_shop[0])
  }
  if(new_fav_shops.length>0){
    await this.setallFavShops(new_fav_shops)
  }
  
  await this.storage.set('shops_list',shops)
}
async getShops(){
  var shops = await  this.storage.get('shops_list')
  return shops == null ? [] : shops;
}

async setFavShops(new_shop){
  var shops = await this.getFavShops()
  
  shops.push(new_shop)
  
  await this.storage.set('fav_shops',shops)
}
async setallFavShops(new_shops){  
  await this.storage.set('fav_shops',new_shops)
}
async getFavShops(){
  var shops = await  this.storage.get('fav_shops')
  return shops == null ? [] : shops;
}

async removeFav(id){
  var shops = await this.getFavShops()
  shops = shops.filter((val)=>{return val.id!=id})
  
  await this.storage.set('fav_shops',shops)
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
async clearFavShopss(){
  var shops = await  this.storage.remove('fav_shops')
  return shops == null ? [] : shops;
}
}

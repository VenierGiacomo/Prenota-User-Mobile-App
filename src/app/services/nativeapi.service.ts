import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { reject } from 'q';

const BASE_URL = 'https://giacomovenier.pythonanywhere.com/api/'
// const BASE_URL = 'http://127.0.0.1:8000/api/'

@Injectable({
  providedIn: 'root'
})
export class NativeApiService {

httpheader = new HttpHeaders({'Content-type':'application/json'}) //'Access-Control-Allow-Origin':'*'
res:any
mailApi = 'https://mailthis.to/giacomo'
constructor(private http: HttpClient, private HTTP: HTTP, private storage: Storage) {}
//Should be in store but import problems
 async newheader(){
  var token = await this.getToken()
  var authheader = new HttpHeaders({"Content-type":"application/json","Authorization":"JWT "+ token})
 return authheader
}
deleteStorage(){
  this.storage.clear()
}
async isvalidToken(){
  const token = await this.getToken().then(resp => {return resp}).catch(err => {return err});
        if (token) {
            var l = this.parseJwt(token) 
            var exp = 1000*l.exp
            var now = +new Date()
            if (now < exp){ 
                return true
            }
            else{
                return false
            }
        } else {
            return false
        }
    }
storeToken(token){
  var data={
    "token": token,
    "last_resfresh":  +new Date()
  }
  this.storage.set('token', JSON.stringify(data))
}
async getToken(){
  return new Promise(resolve => {
    this.storage.get('token').then(data => {
      var res:any  =JSON.parse(data)
     if( data==null){
       resolve(false)
      }else{
        var now = +new Date()
        if ((now - res.last_resfresh)> 14400000){  // 7.200.000 it's 2 hours
          this.refreshToken(res.token)
        }
        resolve(res.token)}
    }).catch(err=>{
      console.log('empty',err)});    
  })  

}


refreshToken(token){
  let url = BASE_URL+'auth/refresh/';
      let params = {
        'token': token
      }
      let headers = { };
      this.HTTP.setDataSerializer("json");
      this.HTTP.setHeader("prenotaApp","Accept", "application/json");
      this.HTTP.setHeader("prenotaApp","Content-Type", "application/json");
      this.HTTP.post(url, params,headers)
  .then((response:HTTPResponse) => {
    this.storeToken(response.data.token)
  })
  .catch((error:any) => {
    console.error(`POST ${url} ${error.error}`)
  });
}

login(email, password){
  let url = BASE_URL+'auth/';
      let params = {
        "email": email,
        "password": password,
      }
      let headers = { };
      this.HTTP.setDataSerializer("json");
      this.HTTP.setHeader("prenotaApp","Accept", "application/json");
      this.HTTP.setHeader("prenotaApp","Content-Type", "application/json");
      this.HTTP.post(url, params, headers)
  .then((response:HTTPResponse) => {
    this.storeToken(response.data.token)
  })
  .catch((error:any) => {
    console.error(`POST ${url} ${error.error}`)
  });
}
async register(first_name, last_name, email, sex,  phone, password){
  let url = BASE_URL+'auth/register/';
      let params = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "sex": sex,
        "phone": phone,
        "password": password,
      }

      this.HTTP.setDataSerializer("json");
      let headers = { };
      this.HTTP.setHeader("prenotaApp","Accept", "application/json");
      this.HTTP.setHeader("prenotaApp","Content-Type", "application/json");
      let responseData = await this.HTTP.post(url,params,headers).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
      var c:any = responseData
      this.storeToken(c.token)
      return responseData;
}
async getemployeeHours(id){
      var url = BASE_URL+'employeehours/?employee='+id
      this.HTTP.setHeader('*',"Accept", 'application/json');
      this.HTTP.setHeader('*','Content-Type', 'application/json');
      var headers_t = this.HTTP.getHeaders("*")
     let responseData = await this.HTTP.get(url,{},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
     return responseData;
}
async getemployeeHoursByShop(id){
  var url = BASE_URL+'employeehours/shop/?shop='+id;
      this.HTTP.setHeader('*',"Accept", 'application/json');
      this.HTTP.setHeader('*','Content-Type', 'application/json');
      var headers_t = this.HTTP.getHeaders("*")
     let responseData = await this.HTTP.get(url,{},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
     return responseData;
}

async getEmployees(){
  let url = BASE_URL+'employees/'
  let token 
  token = await this.getToken()
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  this.HTTP.setHeader('*','Authorization','JWT '+ token );
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
}

async bookAppointment(start, end, day, month, year,name, details, employee, service){
  var week = this.getWeekNumber(new Date(year, month, day))
  var data = {'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'details': details, 'service_n': service}
  let url = BASE_URL+'bookings/'
  let token 
  token = await this.getToken()
  this.HTTP.setDataSerializer("json");
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  this.HTTP.setHeader('*','Authorization','JWT '+ token );
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.post(url, data, headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
}
async bookAppointmentNoOwner(start, end, day, month, year,name, phone, details, employee, service, shop){
  var week = this.getWeekNumber(new Date(year, month, day))
  var data = {'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'phone': phone, 'details': details, 'service_n': service, 'shop':shop}
  let url = BASE_URL+'bookings/'
  let token 
  token = await this.getToken()
  this.HTTP.setDataSerializer("json");
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  this.HTTP.setHeader('*','Authorization','JWT '+ token );
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.post(url, data, headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
}

 async getAppointments(week){
  let url = BASE_URL+'bookings/week/'+week+'/'
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err.error});
  return responseData;
}
async getAppointmentsByshop(week,id){
  let url = BASE_URL+'bookings/week/'+week+'/shop/?shop='+id;
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err.error});
  return responseData;
}

// updateAppointment(id, start, end, day, month, year,name, details, employee):Observable<any>{
//   var week = this.getWeekNumber(new Date(year, month, day))
//   var data = {'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'details': details}
//   return this.http.put(BASE_URL+'bookings/'+id+'/', data, {headers: this.newheader()})
// }

async deleteAppointment(id){
  let url = BASE_URL+'bookings/'+id+'/'
  let token 
  token = await this.getToken()
  this.HTTP.setDataSerializer("json");
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  this.HTTP.setHeader('*','Authorization','JWT '+ token );
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.delete(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
}

async getStoreservice(id){
  let url = BASE_URL+'services/?owner='+id
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
  }
async getStoreservicebyStore(id){
  let url = BASE_URL+'services/byshop/?shop='+id
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
  return responseData;
  }
  async getUser(){
    const token = await this.getToken()
    var l 
    if (token) {
       l = await this.parseJwt(token) 
        this.HTTP.setHeader('*','Content-Type', 'application/json');
        this.HTTP.setHeader('*','Authorization','JWT '+ token );
        var headers_t = this.HTTP.getHeaders("*")
        let responseData = await  this.HTTP.get(BASE_URL+'auth/'+l.user_id,{},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
        return responseData
    }else{
      throw throwError("error");  
    }
   
  }
getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = +(new Date(Date.UTC(d.getUTCFullYear(),0,1)));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return  weekNo
}

parseJwt = (token) => {
  try {
  return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
  return null;
  }
  };
  async emailConfirmBooking(email,name,surname,day,month,year,time,service,shop){
    const token = await this.getToken()
    var data ={
      "email":email,
      "name":name,
      "surname":surname,
      "day":day,
      "month": month,
      "year":year,
      "time":time,
      "service":service,
      "shop":shop
    }
    this.HTTP.setHeader('*','Content-Type', 'application/json');
    this.HTTP.setHeader('*','Authorization','JWT '+ token );
    var headers_t = this.HTTP.getHeaders("*")
    let responseData = await this.HTTP.post(BASE_URL+'email/bookingconfirm', data,headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err});
    return responseData
  }
async getStores(){
  let url = BASE_URL+'store/list'
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err.error});
  return responseData
}
async getEmployeesfromshop(shop){
  let url = BASE_URL+'employees/store/?shop='+shop
  this.HTTP.setHeader('*',"Accept", 'application/json');
  this.HTTP.setHeader('*','Content-Type', 'application/json');
  var headers_t = this.HTTP.getHeaders("*")
  let responseData = await this.HTTP.get(url, {},headers_t).then(resp => {return JSON.parse(resp.data)}).catch(err => {return err.error});
  return responseData
}
  }
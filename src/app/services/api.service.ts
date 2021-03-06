import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
export class UserCache{
  constructor(
              public id: number,
              public name: string,
              public img: string,
              public wallet: number,
              ){}
  }
const BASE_URL = 'https://giacomovenier.pythonanywhere.com/api/'
// const BASE_URL = 'http://127.0.0.1:8000/api/'
@Injectable({
  providedIn: 'root'
})
export class ApiService {

httpheader = new HttpHeaders({'Content-type':'application/json'}) //'Access-Control-Allow-Origin':'*'

mailApi = 'https://mailthis.to/giacomo'
constructor(private http: HttpClient) { }
//Should be in store but import problems

newheader(){
  var authheader = new HttpHeaders({'Content-type':'application/json','Authorization':'JWT '+ this.getToken() })
 return authheader
}
deleteStorage(){
  localStorage.clear()
}
isvalidToken(){
  const token = this.getToken()
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
  localStorage.setItem('token', JSON.stringify(data))
}
getToken(){
  var storedtoken = JSON.parse(localStorage.getItem('token'));
  var now = +new Date()
  if(storedtoken != undefined  || storedtoken != null){
    if ((now - storedtoken.last_resfresh)> 7200000000){  // 7.200.000 it's 2 hours
      this.refreshToken(storedtoken.token).subscribe(
        data=>{
          this.storeToken(data.token)
        },
        err => {
          console.log(err.error,'err')
        }
      )
  }
  return storedtoken.token 
  }
}
deleteToken(){
  localStorage.removeItem('token')
}

refreshToken(token):Observable<any>{
  var data ={
    'token': token
  }
  return this.http.post(BASE_URL+'auth/refresh/', data,{headers: this.httpheader })
}

login(email, password):Observable<any>{
  var data ={
    "email": email,
    "password": password,
  }
  return this.http.post(BASE_URL+'auth/', data,{headers: this.httpheader })
}
register(first_name, last_name, email, sex,  phone, password):Observable<any>{
  var data ={
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    "sex": sex,
    "phone": phone,
    "password": password,
  }
  return this.http.post(BASE_URL+'auth/register/', data,{headers: this.httpheader })
}
registeremployee(first_name, last_name, email, sex,  phone, password):Observable<any>{
  var data ={
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    "sex": sex,
    "phone": phone,
    "password": password,
  }
  return this.http.post(BASE_URL+'auth/register/employee/', data,{headers: this.newheader() })
}
getEmployees(): Observable<any>{
  return this.http.get(BASE_URL+'employees/',{headers: this.newheader()})
}
getUser(){
  const token = this.getToken()
  var l 
  if (token) {
     l = this.parseJwt(token) 
     return this.http.get(BASE_URL+'auth/'+l.user_id,{headers: this.newheader()})
  }
  throw throwError("error");  
}

updateUser(first_name, last_name, email, phone){
  
  var data ={
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    // "sex": sex,
    "phone": phone,
    // "password": password,
  }
  const token = this.getToken()
  var l 
  if (token) {
     l = this.parseJwt(token)
  return this.http.put(BASE_URL+'auth/'+l.user_id, data ,{headers: this.newheader()})
  }
  throw throwError("error");  
}
getemployeeHours(id): Observable<any>{
     return this.http.get(BASE_URL+'employeehours/?employee='+id,{headers: this.httpheader})
}
getemployeeHoursByShop(id): Observable<any>{
  return this.http.get(BASE_URL+'employeehours/shop/?shop='+id,{headers: this.httpheader})
}
getCategoriebyStore(id): Observable<any>{
  return this.http.get(BASE_URL+'categories/shop/?shop='+id,{headers: this.httpheader})
}
getopenHours(id): Observable<any>{
  // modificato bene qua ma non server (non usa lo shop id)
        return this.http.get(BASE_URL+'closedhours/?shop='+id,{headers: this.httpheader})
}
setopenHours(data): Observable<any>{
  return this.http.post(BASE_URL+'closedhours/', data, {headers: this.newheader()})
}
setemployeeHours(data): Observable<any>{
  return this.http.post(BASE_URL+'employeehours/', data, {headers: this.newheader()})
}
setStoreservice( name, duration, sex, max_n, color){
var data = { 'name':name, 'duration':duration, 'sex':sex, 'max_n':max_n, 'color':color}
  return this.http.post(BASE_URL+'services/', data, {headers: this.newheader()})
}
getStoreservice(id){
  return this.http.get(BASE_URL+'services/',{headers: this.httpheader, params: {owner: id }})
}
getStoreservicebyStore(id){
  return this.http.get(BASE_URL+'services/byshop/',{headers: this.httpheader, params: {shop: id }})
}
getEmploservicebyStore(id){
  return this.http.get(BASE_URL+'employee/services/store/?store='+id,{headers: this.httpheader, params: {shop: id }})
}
setEmployeeservice(employee, service_id){
  var data = {'employee':employee, 'service_id':service_id}
    return this.http.post(BASE_URL+'employee/serices/', data, {headers: this.newheader()})
}
getEmployeesfromshop(shop): Observable<any>{
  return this.http.get(BASE_URL+'employees/store/?shop='+shop,{headers: this.httpheader })
}
getSpecificUser(id){
  return this.http.get(BASE_URL+'auth/'+id,{headers: this.httpheader })
}
deleteEmployeeservice(employee, service_id){
  return this.http.delete(BASE_URL+'employee/serices/'+employee+'/'+service_id+'/', {headers: this.newheader()})
}

bookAppointment(start, end, day, month, year,name, details, employee, service):Observable<any>{
  var week = this.getWeekNumber(new Date(year, month, day))
  var data = {'new':true, 'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'details': details, 'service_n': service}
    return this.http.post(BASE_URL+'bookings/', data,{headers: this.newheader()})
}
bookAppointmentNoOwner(start, end, day, month, year,name, phone, details, employee, service, shop, shadow?, adons?):Observable<any>{
  var week = this.getWeekNumber(new Date(year, month, day))
  // var data
  // if(adons){
   var data = {'new':true, 'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'phone': phone, 'details': details, 'service_n': service, 'shop':shop, 'adons':adons}
  // }else{
  //    data = {'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'phone': phone, 'details': details, 'service_n': service, 'shop':shop}
  // }
  if(shadow){
    return this.http.post(BASE_URL+'bookings/shadow/', data,{headers: this.newheader()})
  }else{
    return this.http.post(BASE_URL+'bookings/', data,{headers: this.newheader()})
  }
}
booknotifications(list_ids){
  var ids=list_ids.toString()
  return this.http.get(BASE_URL+'bookings/notifications/?list_ids='+ids,{headers: this.newheader() })
}
getAppointments(week):Observable<any>{
  return this.http.get(BASE_URL+'bookings/week/'+week+'/?owner=2', {headers: this.httpheader})
}


getClientAppointments():Observable<any>{
  const token = this.getToken()
  var l 
  if (token) {
     l = this.parseJwt(token) 
     return this.http.get(BASE_URL+'bookings/user/?user='+l.user_id,{headers: this.newheader()})
  }
  throw throwError("error"); 
}
getClientAppointmentsweek(week, year):Observable<any>{
  const token = this.getToken()
  var l 
  if (token) {
     l = this.parseJwt(token) 
     return this.http.get(BASE_URL+'bookings/user/week/'+week+'/?user='+l.user_id+'&year='+year,{headers: this.newheader()})
  }
  throw throwError("error"); 
}

getAppointmentsByshop(week,id):Observable<any>{
  return this.http.get(BASE_URL+'bookings/week/'+week+'/shop/?shop='+id, {headers: this.httpheader})
}
getAppointmentsByshop2(week,id):Observable<any>{
  return this.http.get(BASE_URL+'bookings/week/'+week+'/2shop/?shop='+id, {headers: this.httpheader})
}
getAppointmentsByshop5(week,id):Observable<any>{
  return this.http.get(BASE_URL+'bookings/week/'+week+'/5shop/?shop='+id, {headers: this.httpheader})
}
getMonthAppointments(month):Observable<any>{
  return this.http.get(BASE_URL+'bookings/month/'+month,{headers: this.newheader()})
}

updateAppointment(id, start, end, day, month, year,name, phone, details, employee, service, note):Observable<any>{
  var week = this.getWeekNumber(new Date(year, month, day))
  var data = {'new':true, 'start': start , 'end': end, 'day': day, 'week':week, 'month':month, 'year' : year, 'employee': employee,  'client_name' :name, 'details': details, 'service_n': service,'phone':phone, 'note':note}
  return this.http.put(BASE_URL+'bookings/'+id+'/', data, {headers: this.newheader()})
}

deleteAppointment(id):Observable<any>{
  return this.http.delete(BASE_URL+'bookings/'+id+'/',  {headers: this.newheader()})
}

createStore(store_name, address, city, zip_code):Observable<any>{
  var new_store ={
    'store_name': store_name,
    'address': address,
    'city': city,
    'zip_code': zip_code,
  }
  var header = new HttpHeaders({'Content-type':'application/json','Authorization':'JWT '+ this.getToken() })
  return this.http.post(BASE_URL+'store/', new_store,{headers: this.newheader()})
}

sendEmail(input: any) {
  return this.http.post(this.mailApi, input, { responseType: 'text' })
}

getemployeeHoursNoLogin(id): Observable<any>{
  return this.http.get(BASE_URL+'employeehours/?employee='+id,{headers: this.httpheader})

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
deleteEmployee(id){
  return this.http.delete(BASE_URL+'employees/'+id+'/',  {headers: this.newheader()})
}
deleteService(id):Observable<any>{
  return this.http.delete(BASE_URL+'services/'+id+'/',  {headers: this.newheader()})
}

parseJwt = (token) => {
try {
return JSON.parse(atob(token.split('.')[1]));
} catch (e) {
return null;
}
};
emailConfirmBooking(email,name,surname,day,month,year,time,service,shop){
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
  return this.http.post(BASE_URL+'email/bookingconfirm', data,{headers: this.newheader()})
}
getStores(){
    return this.http.get(BASE_URL+'store/list',{headers: this.httpheader})
}
getStores1(){
  return this.http.get(BASE_URL+'store/list1',{headers: this.httpheader})
}
getStoresDetails(id){
  return this.http.get(BASE_URL+'store/id/'+id,{headers: this.httpheader})
}
s

payBusiness(list_ids){
    return this.http.post(BASE_URL+'webhooks/pay/business/', {list_ids:list_ids},{headers: this.newheader()})
}

payBusinesswithCredits(list_ids){
  return this.http.post(BASE_URL+'webhooks/pay/business/credits/', {list_ids:list_ids},{headers: this.newheader()})
}

paymentMethods(){
  return this.http.post(BASE_URL+'webhooks/payment_methods/', {},{headers: this.newheader()})
}


stripeBusTicket(service,logged){
  if(logged){
    return this.http.post(BASE_URL+'webhooks/ticket', {services:service},{headers: this.newheader()})
  }else{
    return this.http.post(BASE_URL+'webhooks/ticket', {services:service},{headers: this.httpheader})
  }
}
isStoreClient(shop):Observable<any>{
    return this.http.get(BASE_URL+'store/clients/is/?shop='+shop,{headers: this.newheader()})
}
paywithStoredcard():Observable<any>{
  var httpheader = new HttpHeaders({'Content-type':'application/json','Authorization':'Bearer cdff994219cae592734638619022b4940003aa081939068bf03ae7555e43ce0e'}) 
  
  return this.http.put('https://api.sumup.com/v0.1/checkouts/16b96b30-e7b9-4380-be27-fd0b5d7465b5',{"payment_type": "card","token": "6678f1ab-1cae-4f7d-aad0-85381c99c3b9","customer_id": "DC000103"},{headers: httpheader})
}
stripePortalSession(){
  return this.http.post(BASE_URL+'webhooks/portal/stripe', {},{headers: this.newheader()})
}
getServiceAdons(service_id):Observable<any>{
  return this.http.get(BASE_URL+'serviceaddons/'+service_id,{headers: this.httpheader})
}

newCustomerSocket(channel,id){
  var data ={
    channel: channel,
    shop_id: id
  }
  return this.http.post(BASE_URL+'webhooks/new_customer_socket/',data,{headers: this.newheader()})
}
updateStoreClientQRCode(id):Observable<any>{
  return this.http.post(BASE_URL+'store/clients/QRCode',{id: id, client_name:'Only because required'}, {headers: this.newheader()})
}



}

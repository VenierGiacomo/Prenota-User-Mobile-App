import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PickerController, Platform } from '@ionic/angular';
import { PickerOptions, configFromSession } from '@ionic/core';
import Notiflix from "notiflix";
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { NativeApiService } from '../services/nativeapi.service';
import { ApiService } from '../services/api.service';
import { RegisterPage } from '../register/register.page';
import { MoreInfoPage } from '../more-info/more-info.page';
@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.page.html',
  styleUrls: ['./book-modal.page.scss'],
})
export class BookModalPage implements OnInit {
  year
  month
  day
  spin='block'
  today
  unique :any
  user:any= {first_name:'', last_name:''}
  confirm='none'
  service :any =''
  @Input() id
  @Input() image
  @Input() name
  @Input() role
  list_appointments
  services:any=[]
  week = []
  emplo_show:any=[]
  availableSpots
  openhours
  timeslot 
  selected_hour
  active_date:any = []
  employees_list:any = []
  months_days=[31, ((this.year%4==0 && this.year%100!=0)|| this.year%400==0)? 29 :28, 31 , 30, 31, 30, 31, 31, 30, 31, 30, 31]
  months_names=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
  total_service={name:'',duration:0,id:-1}
  selected_services:any=[]
  // rand = [ 6, 12, 21, 32 ,47 ,49 ]
  times =["06:45", "06:50", "06:55", "07:00", "07:05", "07:10", "07:15", "07:20", "07:25", "07:30", "07:35", "07:40", "07:45", "07:50", "07:55", "08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55", "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55","14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55", "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55", "18:00", "18:05", "18:10", "18:15", "18:20", "18:25", "18:30", "18:35", "18:40", "18:45", "18:50", "18:55", "19:00", "19:05", "19:10", "19:15", "19:20", "19:25", "19:30", "19:35", "19:40", "19:45", "19:50", "19:55", "20:00", "20:05", "20:10", "20:15", "20:20", "20:25", "20:30", "20:35", "20:40", "20:45", "20:50", "20:55", "21:00", "21:05", "21:10", "21:15", "21:20", "21:25", "21:30", "21:35", "21:40", "21:45", "21:50", "21:55", "22:00", "22:05", "22:10", "22:15","22:20", "22:25", "22:30", "22:35", "22:40", "22:45", "22:50", "22:55", "23:00", "23:05", "23:10", "23:15", "23:20", "23:25", "23:30", "23:35", "23:40", "23:45", "23:50", "23:55" ]
  rows = ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45", "24:00"]
  days= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
  months=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
  months_short=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
  years=[2020,2021]
  constructor(private apiNative:NativeApiService, private plt: Platform,private api: ApiService, private router: Router,private storage: StorageService, public modalController: ModalController, private pickerController: PickerController,) {}
// private apiNative: NativeApiService,
  ngOnInit() {
    Notiflix.Block.Standard('.service', 'Caricamento serivzi...');
    // this.api.storeToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwiZXhwIjoxNTk2MTkwMTU1LCJlbWFpbCI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1OTM1MjUyMzJ9.JuKYHCyGe9BNt-WNitG3cH0Dm36_gF290C3vTKAtDV8")
    // this.apiNative.storeToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwiZXhwIjoxNTk2MTkwMTU1LCJlbWFpbCI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1OTM1MjUyMzJ9.JuKYHCyGe9BNt-WNitG3cH0Dm36_gF290C3vTKAtDV8")
    var now = new Date()
    var today = now.getDay()
    this.day = now.getDate()+1
    this.month = now.getMonth()
    this.year = now.getFullYear()
    this.today= `${this.day} ${this.months[this.month]} ${this.year}`
    var now = new  Date()
  var month = now.getMonth()
  var day_number = now.getDate()+1
  for (let i=0;i<10;i++){
      if((day_number + i)<= this.months_days[month]){
        var day = {"number" :day_number + i, "week_day" : ((today+i)%7), "month":this.month}
        this.active_date.push(false)
        this.week.push(day)
      }else{
        var day = {"number" :day_number + i - this.months_days[month], "week_day" : ((today+i)%7), "month":this.month+1 }
        this.active_date.push(false)
        this.week.push(day)
      }
  }
    this.getservices()
    this.getAppointments(this.day)
    this.tokenValidation()
    this.calculateWorkdates()
    this.getEmployees()
    this.active_date[0]=true
  }
  getEmployees(){
    if(this.plt.is('hybrid')) {
      this.apiNative.getEmployeesfromshop(this.id).then(data=>{
        this.employees_list = data
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
      this.api.getEmployeesfromshop(this.id).subscribe(data=>{
        this.employees_list = data
      },err=>{
        console.log(err)
      })
    }
  
  }
  async closeModal(){
    await this.modalController.dismiss();
  }
  getservices(){
    if(this.plt.is('hybrid')) {
      this.apiNative.getStoreservicebyStore(this.id).then(
        data => {
          this.services =  data
          Notiflix.Block.Remove('.service');
        }).catch(
          err => {
            console.log(err,'no getStoreservice')
            Notiflix.Block.Remove('.service')})
    }
    else{
      this.api.getStoreservicebyStore(this.id).subscribe(
        data=>{
          this.services =  data
          Notiflix.Block.Remove('.service');
        err=>{
          console.log(err)
          Notiflix.Block.Remove('.service');
        }
      })
    }
  }
  async tokenValidation(){
    if (this.plt.is('hybrid')) {
      var token = await this.apiNative.isvalidToken()
      if(token){
        this.apiNative.getUser().then(data=>{
          this.user = data
        }).catch(err=>{
          console.log(err, ' no token')
        })
      }
    }
    else{
      if(this.api.isvalidToken()){
        this.api.getUser().subscribe(data=>{
          this.user = data
        },err=>{
          console.log(err)
        })
      }
    }
    
  }
  getAppointments(day){
    var date = new Date(this.year, this.month, day)
    var week = this.getWeekNumber(date)
    this.list_appointments=[]
    if (this.plt.is('hybrid')) {
      this.apiNative.getAppointmentsByshop(week,this.id).then(
        data=>{
         var appointments =  data
         for (let appointment of appointments){
           if (day == appointment.day){
            this.list_appointments.push(appointment)
           }
         }
         if (this.service !=''){
          this.calculateAvailability(date)
         }
        }).catch(err=>  console.log(err, 'no appointment'))
    }else{
      this.api.getAppointmentsByshop(week,this.id).subscribe(
        data=>{
         var appointments =  data
         for (let appointment of appointments){
           if (day == appointment.day){
            this.list_appointments.push(appointment)
           }
         }
         if (this.service !=''){
          this.calculateAvailability(date)
         }
        err=>{
          console.log(err)
        }
      })
    }
  }
  changeService(service){
    const index = this.selected_services.indexOf(service);
    if (index > -1) {
      this.selected_services.splice(index, 1);
    }else{
      this.selected_services.push(service)
    }
    var date = new Date(this.year, this.month, this.day)
    if(this.selected_services.length==1){
          this.total_service.id = this.selected_services[0].id
    }else{
      this.total_service.id=-1
    }
    this.calculateAvailability(date)
    setTimeout(() => {
      Notiflix.Block.Standard('.time', 'Calcolando disponibilità...');
    }, 50);

  }
  async DatePicker(date_avi, ind) {
      for (let indd in this.active_date){
        this.active_date[indd]=false
      }
      this.today= `${date_avi.number} ${date_avi.month} ${this.year}`
      this.day = date_avi.number
      this.month = date_avi.month
      this.active_date[ind] = true
      this.getAppointments(this.day)
      var date = new Date(this.year, this.month, this.day)
      this.calculateAvailability(date)
      
  }
  getOptionsArrray(array){
    let options = [];
    array.forEach(x => {
      options.push({text:x,value:x});
    });
    return options;
  }
  selectTime(time){
    this.selected_hour= time
    this.timeslot =this.times[time.start]
    this.confirm='block'
  }
  calculateWorkdates(){
    this.api.getemployeeHoursByShop(this.id).subscribe(data=>{
      var empl = data
      var x:any =[]
      for(let work of empl){
        for(let day of this.week){
          if(day.week_day == work.wkday){
          x.push(day)
          }
        }
      }
      this.unique= [...new Set(x)];
      this.unique.sort(function(a, b){
        if (a.month < b.month) return -1;
        if (a.month > b.month) return 1;
        if (a.number > b.number) return 1;
        if (a.number < b.number) return -1;
      })
      this.spin = 'none'
    })
  }
  calculateAvailability(date){
    this.emplo_show=[]
    this.total_service.duration=0
    this.total_service.name=''
        for(let service of this.selected_services){
          this.total_service.duration = this.total_service.duration + service.duration
          if(this.selected_services.indexOf(service) == this.selected_services.length-1){
            this.total_service.name = this.total_service.name+service.name
          }else{
            this.total_service.name = this.total_service.name+service.name+' + '
            this.total_service.id = -1
          }
        }
        if(this.selected_services.length==1){
           this.total_service.id = this.selected_services[0].id
        }else{
          this.total_service.id = -1
        }
        var day_of_week = date.getDay()-1
        if (day_of_week == -1){
          day_of_week= 6
        }

    this.availableSpots=[]
    if (this.plt.is('hybrid')) {
    this.apiNative.getemployeeHoursByShop(this.id).then(
      data=>{
        var days =  data
        var list = [];
        var litst = [];
        var app
        for (let day of days){
          if(day_of_week == day.wkday){
            litst.push(day.employee)
            var start = this.times.indexOf(this.rows[day.start])
            var end =  this.times.indexOf(this.rows[day.end])
            for (var i = start; i <= end; i++) {
              list.push({time: i  , employee: day.employee });
            }
          }
        } 
        for(let empl of this.employees_list){
          if(litst.indexOf(empl.employee)!= -1){
           this.emplo_show.push(true)
          }else{
            this.emplo_show.push(false)
          }
        }
        this.openhours = list
        for(let appointment of this.list_appointments){
          var start = this.times.indexOf(this.rows[appointment.start])
          var end = start+appointment.end -  appointment.start
          this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
        } 
        var max_ind = this.openhours.length-1
        for(let idx in this.openhours){
          let id:any = idx
          if(id ==0 || id == max_ind || this.openhours[id].time-this.openhours[id-1].time> 1  || this.openhours[id].employee-this.openhours[id-1].employee!= 0 ||  app.duration == this.total_service.duration){
            if (app != undefined){
              if(app.duration>=   this.total_service.duration){
                this.availableSpots.push(app)
              }
            }
            if(this.rows.indexOf(this.times[this.openhours[id].time])!=-1){
              app = {start: this.openhours[id].time, duration: 1, employee:this.openhours[id].employee}
            }
          }else{
              app.duration +=1
          }
        }
        this.availableSpots.sort(function(a, b) {
             return a.start - b.start;
          });
          console.log( this.availableSpots)
          this.availableSpots=[...new Set(this.availableSpots)]
          Notiflix.Block.Remove('.time');
    }).catch(
      err=>{
        console.log(err, 'adfvdf')
        Notiflix.Block.Remove('.time');}
    )}else{
      this.api.getemployeeHoursByShop(this.id).subscribe(
        data=>{
          var days =  data
          var list = [];
          var litst = [];
          var app
          for (let day of days){
            if(day_of_week == day.wkday){
              litst.push(day.employee)
              var start = this.times.indexOf(this.rows[day.start])
              var end =  this.times.indexOf(this.rows[day.end])
              for (var i = start; i <= end; i++) {
                list.push({time: i  , employee: day.employee });
              }
            }
          } 
          for(let empl of this.employees_list){
            if(litst.indexOf(empl.employee)!= -1){
             this.emplo_show.push(true)
            }else{
              this.emplo_show.push(false)
            }
          }
          this.openhours = list
          for(let appointment of this.list_appointments){
            var start = this.times.indexOf(this.rows[appointment.start])
            var end = start+appointment.end -  appointment.start
            this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
          } 
          var max_ind = this.openhours.length-1
          for(let idx in this.openhours){
            let id:any = idx
            if(id ==0 || id == max_ind || this.openhours[id].time-this.openhours[id-1].time> 1  || this.openhours[id].employee-this.openhours[id-1].employee!= 0 ||  app.duration == this.total_service.duration){
              if (app != undefined){
                if(app.duration>=   this.total_service.duration){
                  this.availableSpots.push(app)
                }
              }
              if(this.rows.indexOf(this.times[this.openhours[id].time])!=-1){
                app = {start: this.openhours[id].time, duration: 1, employee:this.openhours[id].employee}
              }
            }else{
                app.duration +=1
            }
          }
          this.availableSpots.sort(function(a, b) {
               return a.start - b.start;
            });
            console.log( this.availableSpots)
            this.availableSpots=[...new Set(this.availableSpots)]
            Notiflix.Block.Remove('.time');
      }, err=>{
        console.log(err)
        Notiflix.Block.Remove('.time');
      })
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

async book(){
  var appointment = {
    studio: this.name,
    date: this.today,
    service: this.total_service.name,
    time: this.timeslot,
  }
  var token: any = await this.apiNative.isvalidToken()
  if (this.plt.is('hybrid')) {
    if(token){
      this.storage.setAppointment(appointment)
      Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
      var client_name = this.user.first_name+' '+ this.user.last_name
      var start = this.rows.indexOf(this.times[this.selected_hour.start])
      var end = start + this.total_service.duration
           //  bookAppointmentNoOwner(start, end,        day,      month,      year,        name,           phone,                  details,                    employee,               service, shop):Observable<any>{
      this.apiNative.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.total_service.name, this.selected_hour.employee, this.total_service.id,this.id).then(data=>{ 
      this.sendEmailConfirmation(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.selected_hour.start],this.total_service.name,"Wellness Clinic")
      this.confirm='none'
      Notiflix.Block.Remove('.cont');
       Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
       this.closeModal()
       this.router.navigateByUrl('tabs/tab2')}).catch(
      err=>{
        Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
        console.log(err)
        Notiflix.Block.Remove('.cont');
    })
    }else{
      this.presentRegisterModal()
    }
  }else{
    if(this.api.isvalidToken()){
      this.storage.setAppointment(appointment)
      Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
      var client_name = this.user.first_name+' '+ this.user.last_name
      var start = this.rows.indexOf(this.times[this.selected_hour.start])
      var end = start + this.total_service.duration
           //  bookAppointmentNoOwner(start, end,        day,      month,      year,        name,           phone,                  details,                    employee,               service, shop):Observable<any>{
      this.api.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.total_service.name, this.selected_hour.employee, this.total_service.id,this.id).subscribe(data=>{ 
      this.sendEmailConfirmation(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.selected_hour.start],this.total_service.name,"Wellness Clinic")
      this.confirm='none'
      Notiflix.Block.Remove('.cont');
       Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
       this.closeModal()
       this.router.navigateByUrl('tabs/tab2')},
      err=>{
        Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
        console.log(err)
        Notiflix.Block.Remove('.cont');
    })
    }else{
      this.presentRegisterModal()
    }
  }
  }
  async bookfromLogin(email,first_name,last_name){
    var appointment = {
      studio: this.name,
      date: this.today,
      service: this.total_service.name,
      time: this.timeslot,
    }
    if (this.plt.is('hybrid')) {
      var token = this.apiNative.isvalidToken()
      if(token){
        this.storage.setAppointment(appointment)
        Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
        var start = this.rows.indexOf(this.times[this.selected_hour.start])
        var end = start + this.total_service.duration
        var client_name =first_name+' '+ last_name
             //  bookAppointmentNoOwner(start, end,        day,      month,      year,        name,           phone,                  details,                    employee,               service, shop):Observable<any>{
        this.apiNative.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.total_service.name, this.selected_hour.employee, this.total_service.id,this.id).then(data=>{ 
        this.sendEmailConfirmation(email,first_name, last_name,this.day,this.months_names[this.month],this.year,this.times[this.selected_hour.start],this.total_service.name,"Wellness Clinic")
        this.confirm='none'
        Notiflix.Block.Remove('.cont');
         Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
         this.closeModal()
         this.router.navigateByUrl('tabs/tab2')}).catch(
        err=>{
          Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
          Notiflix.Block.Remove('.cont');
      })
      }else{
        this.presentRegisterModal()
      }
    }else{
      if(this.api.isvalidToken()){
        this.storage.setAppointment(appointment)
        Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
        var client_name =first_name+' '+ last_name
        var start = this.rows.indexOf(this.times[this.selected_hour.start])
        var end = start + this.total_service.duration
             //  bookAppointmentNoOwner(start, end,      day,      month,      year,        name,           phone,                  details,                    employee,               service, shop):Observable<any>{
        this.api.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.total_service.name, this.selected_hour.employee, this.total_service.id,this.id).subscribe(data=>{ 
        this.sendEmailConfirmation(email,first_name,last_name,this.day,this.months_names[this.month],this.year,this.times[this.selected_hour.start],this.total_service.name,"Wellness Clinic")
        this.confirm='none'
        Notiflix.Block.Remove('.cont');
         Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
         this.closeModal()
         this.router.navigateByUrl('tabs/tab2')},
        err=>{
          Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
          console.log(err)
          Notiflix.Block.Remove('.cont');
      })
      }else{
        this.presentRegisterModal()
      }
    }
    }
  sendEmailConfirmation(email, name, surname, day, month, year, time, servcie, shop){
    if (this.plt.is('hybrid')) {
      this.apiNative.emailConfirmBooking(email,name,surname,day,month,year,time,servcie,shop).then(
        data=>{
          console.log(data)
        }).catch(err=>{
            console.log(err)
        }
      )
    }else{
      this.api.emailConfirmBooking(email,name,surname,day,month,year,time,servcie,shop).subscribe(
        data=>{
          console.log(data)
        },err=>{
            console.log(err)
        }
      )
    }
}
async presentRegisterModal() {
  await this.closeModal().then(async ()=>{
    const modal = await this.modalController.create({
      component:RegisterPage,
      swipeToClose: true,
      cssClass: 'select-modal' ,
      componentProps: { 
        homeref: this
      }
    });
    return await modal.present();
  })
 
}
async infoModal() {
  const modal = await this.modalController.create({
    component:MoreInfoPage,
    swipeToClose: true,
    cssClass: 'select-modal' ,
  });
  return await modal.present();
}
}
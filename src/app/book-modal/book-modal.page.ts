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
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { combineLatest } from 'rxjs';
import { CodeNode } from 'source-list-map';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
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
  cont_scroll =false
  today
  unique :any
  user:any= {first_name:'', last_name:'',phone:''}
  confirm='none'
  service :any = []
  o:any ={}
  @Input() id
  @Input() image
  @Input() name
  @Input() role
  @Input() max_spots
  @Input() website
  list_appointments
  services:any=[]
  week = []
  emplo_show:any=[]
  availableSpots
  openhours
  timeslot 
  final_spots
  employees_serivces
  empl_hours
  results_empl_serv:any=[]
  selected_hour
  active_date:any = []
  employees_list:any = []
  cont = 0 
  active_services= []
  app_to_book:any
  week_name = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"]
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
  constructor(private safariViewController: SafariViewController, private localNotifications: LocalNotifications, private apiNative:NativeApiService, private plt: Platform,private api: ApiService, private router: Router,private storage: StorageService, public modalController: ModalController, private pickerController: PickerController,) {}
// private apiNative: NativeApiService,
  async ngOnInit() {
    Notiflix.Block.Standard('.service', 'Caricamento serivzi...');
    // this.api.storeToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwiZXhwIjoxNTk2MTkwMTU1LCJlbWFpbCI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1OTM1MjUyMzJ9.JuKYHCyGe9BNt-WNitG3cH0Dm36_gF290C3vTKAtDV8")
    // this.apiNative.storeToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwiZXhwIjoxNTk2MTkwMTU1LCJlbWFpbCI6ImdpYWNvbW92ZW5pZXJAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1OTM1MjUyMzJ9.JuKYHCyGe9BNt-WNitG3cH0Dm36_gF290C3vTKAtDV8")
    var now = new Date()
    var today = now.getDay()
    this.day = now.getDate()
    this.month = now.getMonth()
    this.year = now.getFullYear()
    var now = new  Date()
    var month = now.getMonth()
    var day_number = now.getDate()
  
  for (let i=0;i<11;i++){
      if((day_number + i)<= this.months_days[month]){
        var day = {"number" :day_number + i, "week_day" : ((today+i-1)%7), "month":this.month}
        this.active_date.push(false)
        this.week.push(day)
      }else{
        var day = {"number" :day_number + i - this.months_days[month], "week_day" : ((today+i-1)%7), "month":this.month+1 }
        this.active_date.push(false)
        this.week.push(day)
      }
  }
    await this.getservices()
    // this.getAppointments(this.day)
    await this.tokenValidation()
    await this.calculateWorkdates()
    await this.getEmployees()
    this.active_date[0]=true
    if(this.plt.is('hybrid')) {
      this.apiNative.getEmploservicebyStore(this.id).then(async data=>{
        this.employees_serivces = await data
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
    this.api.getEmploservicebyStore(this.id).subscribe(async data=>{
      this.employees_serivces = await data
        },err=>{
          console.log(err)
        })
      }
  }
  getEmployees(){
    if(this.plt.is('hybrid')) {
      this.apiNative.getEmployeesfromshop(this.id).then(async data=>{
        this.employees_list = await data
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
      this.api.getEmployeesfromshop(this.id).subscribe( async data=>{
        this.employees_list = await data
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
        async data => {
          this.services =  await data
          Notiflix.Block.Remove('.service');
        }).catch(
          err => {
            console.log(err,'no getStoreservice')
            Notiflix.Block.Remove('.service')})
    }
    else{
      this.api.getStoreservicebyStore(this.id).subscribe(
        async data=>{
          this.services =  await data
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
        this.apiNative.getUser().then(async data=>{
          this.user =  await data
        }).catch(err=>{
          console.log(err, ' no token')
        })
      }
    }
    else{
      if(this.api.isvalidToken()){
        this.api.getUser().subscribe( async data=>{
          this.user = await data
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
        async data=>{
         var appointments =  await data
        for (let appointment of appointments){
           if (day == appointment.day){
            this.list_appointments.push(appointment)
           }
         }
       
          await this.calculateAvailability(date)

        }).catch(err=>  console.log(err, 'no appointment'))
    }else{
      this.api.getAppointmentsByshop(week,this.id).subscribe(
        async data=>{
         var appointments =  await data
         for (let appointment of appointments){
           if (day == appointment.day){
            this.list_appointments.push(appointment)
           }
         }
        
          await this.calculateAvailability(date)
         
        err=>{
          console.log(err)
        }
      })
    }
  }
  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
  selectService(service){
    this.cont=0
    const index = this.service.indexOf(service);
    if (index > -1) {
      this.service.splice(index, 1);
    }else{
      this.service.push(service)
    }
    if( this.service.length!=0){
      this.selected_services = ' selec'
      this.getAppointments(this.day)
    }
    var date = new Date(this.year, this.month, this.day)
    // this.calculateAvailability(date)
  }

  async DatePicker(date_avi, ind) {
    Notiflix.Block.Standard('.time', 'Calcolando disponibilità...');
      for (let indd in this.active_date){
        this.active_date[indd]=false
      }
      this.today= `${date_avi.number} ${this.months[date_avi.month]} ${this.year}`
      this.day = date_avi.number
      this.month = date_avi.month
      this.active_date[ind] = true
      this.getAppointments(this.day)
      var date = new Date(this.year, this.month, this.day)
      // await this.calculateAvailability(date)
      
  }
  getOptionsArrray(array){
    let options = [];
    array.forEach(x => {
      options.push({text:x,value:x});
    });
    return options;
  }
  selectTime(spot){
    this.selected_hour  = spot[0]
    this.timeslot = this.times[spot[0].start]
    this.confirm='block'
    this.app_to_book = spot
    // console.log( this.app_to_book)
  }
  async calculateWorkdates(){
    if (this.plt.is('hybrid')) {
      await this.apiNative.getemployeeHoursByShop(this.id).then(async data=>{
        var empl = await data
        var x:any =[]
        for(let work of empl){
          for(let day of this.week){
            if(day.week_day == work.wkday){
              if(day.number<=this.day+1 && day.month==this.month){
              }else{
                x.push(day)
              }
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
        this.day=this.unique[0].number
        this.month =this.unique[0].month
        // console.log(this.unique)
        this.today= `${this.day} ${this.months[this.month]} ${this.year}`
        this.spin = 'none'
        this.getAppointments(this.day)
      }).catch(err =>{console.log(err) })
    }else{
       await this.api.getemployeeHoursByShop(this.id).subscribe(async data=>{
      var empl = await data
      var x:any =[]
      for(let work of empl){
        for(let day of this.week){
          if(day.week_day == work.wkday){
            if(day.number<=this.day+1 && day.month==this.month){
            }else{
              x.push(day)
            }
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
      this.day=this.unique[0].number
      this.month =this.unique[0].month
      // console.log(this.unique)
      this.today= `${this.day} ${this.months[this.month]} ${this.year}`
      this.spin = 'none'
      this.getAppointments(this.day)
    },err =>{
      console.log(err) 
  }) }
  }
  // async calculateAvailability(date){
  //   Notiflix.Block.Standard('.time', 'Calcolando disponibilità...');
  //   this.emplo_show=[]
  //   this.total_service.duration=0
  //   this.total_service.name=''
  //       for(let service of this.selected_services){
  //         this.total_service.duration = this.total_service.duration + service.duration
  //         if(this.selected_services.indexOf(service) == this.selected_services.length-1){
  //           this.total_service.name = this.total_service.name+service.name
  //         }else{
  //           this.total_service.name = this.total_service.name+service.name+' + '
  //           this.total_service.id = -1
  //         }
  //       }
  //       if(this.selected_services.length==1){
  //          this.total_service.id = this.selected_services[0].id
  //       }else{
  //         this.total_service.id = -1
  //       }
  //       var day_of_week = date.getDay()-1
  //       if (day_of_week == -1){
  //         day_of_week= 6
  //       }
  //   this.availableSpots=[]
  //   if (this.plt.is('hybrid')) {
  //   this.apiNative.getemployeeHoursByShop(this.id).then(
  //     async data=>{
  //       var days =  await data
  
  //         var list = [];
  //         var litst = [];
  //         var app
  //         for (let day of days){
  //           if(day_of_week == day.wkday){
  //             litst.push(day.employee)
  //             var start = this.times.indexOf(this.rows[day.start])
  //             var end =  this.times.indexOf(this.rows[day.end])
  //             for (var i = start; i <= end; i++) {
  //               list.push({time: i  , employee: day.employee });
  //             }
  //           }
  //         } 
  //         for(let empl of this.employees_list){
  //           if(litst.indexOf(empl.employee)!= -1){
  //            this.emplo_show.push(true)
  //           }else{
  //             this.emplo_show.push(false)
  //           }
  //         }
  //         this.openhours = list
  //         // console.log(this.list_appointments)
  //         for(let appointment of this.list_appointments){
  //           var start = this.times.indexOf(this.rows[appointment.start])
  //           var end = start+appointment.end -  appointment.start
  //           this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
  //         }
  //         var max_ind = this.openhours.length-1
  //         for(let idx in this.openhours){
  //           let id:any = idx
  //           if(id ==0 || id == max_ind || this.openhours[id].time-this.openhours[id-1].time> 1  || this.openhours[id].employee-this.openhours[id-1].employee!= 0 ||  app == undefined || app.duration == this.total_service.duration){
  //             if (app != undefined){
  //               if(app.duration>=this.total_service.duration){
  //                 this.availableSpots.push(app)
  //               }
  //             }
  //             if(this.rows.indexOf(this.times[this.openhours[id].time])!=-1){
  //               app = {start: this.openhours[id].time, duration: 1, employee:this.openhours[id].employee}
  //             }
  //           }else{
  //               app.duration +=1
  //           }
  //         }
  //         this.availableSpots.sort(function(a, b) {
  //              return a.start - b.start;
  //           });
  //         this.availableSpots=[...new Set(this.availableSpots)]
  //           if(this.max_spots!=-1){
  //             var o = await this.groupBy( this.availableSpots, 'employee')
  //             // console.log( this.availableSpots, o,1)
  //             this.availableSpots = []
  //             setTimeout(() => {
  //             for(let ind in this.employees_list){
  //               var empl_id = this.employees_list[ind].employee.toString()
  //               if(o[empl_id]!=undefined){
  //                 var x = Math.floor(o[empl_id].length/(this.max_spots+2))
  //                 var int:any = ind
  //                 // console.log(o[empl_id])
  //                 if(x== 0 || x==-1 ){
  //                   for(let el of o[empl_id]){
  //                     this.availableSpots.push(el)
  //                   }
  //                 }else{
  //                   if(int%2 ==0){
  //                     for(let i =1; i<=this.max_spots ; i++){
  //                       // console.log(o[empl_id][(x*(i+1))-1], (x*(i+1))-1)
  //                       this.availableSpots.push(o[empl_id][(x*(i+1))-1])
  //                     }
  //                   }else{
  //                     for(let i =1; i<=this.max_spots ; i++){
  //                       // console.log( o[empl_id][x*(i+1)], x*(i+1))
  //                       this.availableSpots.push(o[empl_id][x*(i+1)])
  //                     }
  //                   }
  //                 }
                  
  //               }
  //               }
                   
  //            this.availableSpots=[...new Set(this.availableSpots)]
  //            this.o = this.groupBy( this.availableSpots, 'employee')
             
  //            Notiflix.Block.Remove('.time');
  //           }, 800);
  //           }else{
  //             this.o = this.groupBy( this.availableSpots, 'employee')
  //             Notiflix.Block.Remove('.time');
  //           }}).catch(
  //     err=>{
  //       console.log(err)
  //       Notiflix.Block.Remove('.time');}
  //   )}else{
  //     this.api.getemployeeHoursByShop(this.id).subscribe(
  //       async data=>{
  //         var days =  await data
  
  //         var list = [];
  //         var litst = [];
  //         var app
  //         for (let day of days){
  //           if(day_of_week == day.wkday){
  //             litst.push(day.employee)
  //             var start = this.times.indexOf(this.rows[day.start])
  //             var end =  this.times.indexOf(this.rows[day.end])
  //             for (var i = start; i <= end; i++) {
  //               list.push({time: i  , employee: day.employee });
  //             }
  //           }
  //         } 
  //         for(let empl of this.employees_list){
  //           if(litst.indexOf(empl.employee)!= -1){
  //            this.emplo_show.push(true)
  //           }else{
  //             this.emplo_show.push(false)
  //           }
  //         }
  //         this.openhours = list
  //         for(let appointment of this.list_appointments){
  //           var start = this.times.indexOf(this.rows[appointment.start])
  //           var end = start+appointment.end -  appointment.start
  //           this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
  //         }
  //         var max_ind = this.openhours.length-1
  //         for(let idx in this.openhours){
  //           let id:any = idx
  //           if(id ==0 || id == max_ind || this.openhours[id].time-this.openhours[id-1].time> 1  || this.openhours[id].employee-this.openhours[id-1].employee!= 0 ||  app == undefined || app.duration == this.total_service.duration){
  //             if (app != undefined){
  //               if(app.duration>=this.total_service.duration){
  //                 this.availableSpots.push(app)
  //               }
  //             }
  //             if(this.rows.indexOf(this.times[this.openhours[id].time])!=-1){
  //               app = {start: this.openhours[id].time, duration: 1, employee:this.openhours[id].employee}
  //             }
  //           }else{
  //               app.duration +=1
  //           }
  //         }
  //         this.availableSpots.sort(function(a, b) {
  //              return a.start - b.start;
  //           });
  //         this.availableSpots=[...new Set(this.availableSpots)]
  //           if(this.max_spots!=-1){
  //             var o = await this.groupBy( this.availableSpots, 'employee')
  //             // console.log( this.availableSpots, o,1)
  //             this.availableSpots = []
  //             setTimeout(() => {
  //             for(let ind in this.employees_list){
  //               var empl_id = this.employees_list[ind].employee.toString()
  //               if(o[empl_id]!=undefined){
  //                 var x = Math.floor(o[empl_id].length/(this.max_spots+2))
  //                 var int:any = ind
  //                 // console.log(o[empl_id])
  //                 if(x== 0 || x==-1 ){
  //                   for(let el of o[empl_id]){
  //                     this.availableSpots.push(el)
  //                   }
  //                 }else{
  //                   if(int%2 ==0){
  //                     for(let i =1; i<=this.max_spots ; i++){
  //                       // console.log(o[empl_id][(x*(i+1))-1], (x*(i+1))-1)
  //                       this.availableSpots.push(o[empl_id][(x*(i+1))-1])
  //                     }
  //                   }else{
  //                     for(let i =1; i<=this.max_spots ; i++){
  //                       // console.log( o[empl_id][x*(i+1)], x*(i+1))
  //                       this.availableSpots.push(o[empl_id][x*(i+1)])
  //                     }
  //                   }
  //                 }
                  
  //               }
  //               }
                   
  //            this.availableSpots=[...new Set(this.availableSpots)]
  //            this.o = this.groupBy( this.availableSpots, 'employee')
  //           //  console.log( this.availableSpots, this.o,2)
  //            Notiflix.Block.Remove('.time');
  //           }, 800);
  //           }else{
  //             this.o = this.groupBy( this.availableSpots, 'employee')
  //             Notiflix.Block.Remove('.time');
  //           }
  //     }, err=>{
  //       console.log(err)
  //       Notiflix.Block.Remove('.time');
  //     })
  //   }
  // }

  emploShow(){
    this.emplo_show=[]
  for (let empl of this.employees_list){
    var x = 0
    for (let el of this.final_spots){
       if(empl.employee==el[0].employee){
          x= 1
       }
     }
     if(x==1){
      this.emplo_show.push(true)
     }else{
      this.emplo_show.push(false)
     }
    }
  }
  async itsemploJob(){
    this.results_empl_serv =[]
    var items = this.employees_serivces,
    grouped = [];
items = await items.filter(function(value, index, arr){ ;return value.service_id != null })
items.forEach(function (a) {
    this[a.employee] || grouped.push(this[a.employee] = []);
    this[a.employee].push(a);
}, Object.create(null));
    for(let service of this.service){
      for(let ind in grouped){
                if(this.results_empl_serv.length<grouped.length){
          this.results_empl_serv.push([grouped[ind].filter(function(value, index, arr){ return value.service_id == service.id})])
        }else{ 
          var x = grouped[ind].filter(function(value, index, arr){ return value.service_id == service.id})
          if(x.length != 0 ){
              this.results_empl_serv[ind].push(x)
              
          }
        }
      }
    }
  }
  async calculateAvailability(date){
    this.itsemploJob()
    Notiflix.Block.Standard('.time', 'Calcolando disponibilità...');
      this.total_service.duration=0
      this.total_service.name=''
          for(let service of this.service){
            // this.total_service.duration = this.total_service.duration + service.duration
            if(this.service.indexOf(service) == this.service.length-1){
              this.total_service.name = this.total_service.name+service.name
            }else{
              this.total_service.name = this.total_service.name+service.name+' + '
              this.total_service.id = -1
            }
          }
          if(this.service.length==1){
             this.total_service.id = this.selected_services[0].id
          }else{
            this.total_service.id = -1
          }
    for(let serv_ind in this.service){
      // console.log(serv_ind,serv_ind =='0',this.service[serv_ind])
      if(serv_ind =='0'){
        var day_of_week = date.getDay()-1
        if (day_of_week == -1){
          day_of_week= 6
        }
        this.availableSpots=[]
        this.api.getemployeeHoursByShop(this.id).subscribe(async  data=>{
            this.empl_hours =  await data
            var list = [];
            var app
            for (let day of this.empl_hours){
              if(day_of_week == day.wkday){
                var start = this.times.indexOf(this.rows[day.start])
                var end =  this.times.indexOf(this.rows[day.end])
                for (var i = start; i <= end; i++) {
                  list.push({time: i  , employee: day.employee });
                }
              }
            }
          
            this.openhours = await list
            for(let appointment of this.list_appointments){
              var start = this.times.indexOf(this.rows[appointment.start])
              var end = start+appointment.end -  appointment.start
              this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
            } 
            for (let empl of this.employees_serivces){
              if( empl.service_id == this.service[0].id){
                var max_ind = this.openhours.length-1
                // let _mid =0
                for(let idx in this.openhours){
                  // console.log(idx ,this.openhours[idx].employee)
                  if(this.openhours[idx].employee==empl.employee){
                    let id:any = idx
                    // console.log(id , this.openhours[id] , this.openhours[id-1] , this.openhours[id], this.openhours[id-1],  app , this.service[serv_ind])
                    if(id ==0 || id == max_ind || this.openhours[id].time-this.openhours[id-1].time> 1  || this.openhours[id].employee-this.openhours[id-1].employee!= 0 || app == undefined || app.duration == this.service[serv_ind].duration_book){
                      if (app != undefined){
                        if(app.duration >=   this.service[serv_ind].duration_book){
                          this.availableSpots.push(app)
                        }
                      }
                      if(this.rows.indexOf(this.times[this.openhours[id].time])!=-1){
                        app = {start: this.openhours[id].time, duration: 1, employee:this.openhours[id].employee, service: this.service[0].id}
                      }
                  
                    }else{
                        app.duration +=1
                    }
                  }
                  }
                }
              }
                  this.final_spots=[]

                this.availableSpots.sort(function(a, b) {
                    return a.start - b.start;
                  });
                this.availableSpots= await [...new Set(this.availableSpots)]
                  // console.log(this.availableSpots)
                  for(let spot of this.availableSpots ){
                    this.final_spots.push([spot])
                  }
                 this.final_spots=await [...new Set(this.final_spots)]
                 
                 this.final_spots.sort(function(a, b) {
                   return a[0].start - b[0].start;
                });
                // console.log(this.final_spots, )
                await this.emploShow()
              Notiflix.Block.Remove('.time');
                  Notiflix.Block.Remove('.bookings-time');
            
    
            }, err=>{
              console.log(err,'emplohours')
              Notiflix.Block.Remove('.bookings-time');
            })
           
      }else{
        // Notiflix.Block.Standard('.bookings-time', 'Verificando la disponibilità...');
        // console.log(this.availableSpots)
        this.final_spots=[]
        // console.log(this.service,this.employees_serivces)
        var list = [];
        var app
        for (let day of this.empl_hours){
          if(day_of_week == day.wkday){
            var start = this.times.indexOf(this.rows[day.start])
            var end =  this.times.indexOf(this.rows[day.end])
            for (var i = start; i <= end; i++) {
              list.push({time: i  , employee: day.employee });
            }
          }
        }
        this.openhours = list
        for(let appointment of this.list_appointments){
          var start = this.times.indexOf(this.rows[appointment.start])
          var end = start+appointment.end -  appointment.start
          this.openhours = this.openhours.filter(function(value, index, arr){ return (value.time < start && appointment.employee==value.employee )|| (value.time  >= end && appointment.employee==value.employee ) || appointment.employee!=value.employee})
        } 
        var o:any = this.groupBy( this.openhours, 'employee')
      setTimeout(async () => {
        this.final_spots=[]
        var duration = this.service[serv_ind].duration_book
        // console.log(duration)
        for (let empl of this.employees_serivces){
          if( empl.service_id == this.service[serv_ind].id){
              var x:string = empl.employee
              for(let spot of this.availableSpots){
                // console.log(spot)
                let obj = this.openhours.find(obj => obj.time == (Math.ceil(spot.duration/3)*3)+spot.start && obj.employee == empl.employee);
                if(obj!=undefined){
                  var ind = this.openhours.indexOf(obj)
                  if(ind+duration<this.openhours.length){
                    if (obj.time+duration == this.openhours[ind+duration].time && x!=undefined){
                      this.final_spots.push([spot, {start: obj.time, duration: duration,employee:x, service: this.service[serv_ind].id}])
                    }
                  }
                  
                }
              // console.log(obj,'hi',duration)
              }
          }
        // console.log(this.service[serv_ind],empl)
          // if( empl.service_id == this.service[serv_ind].id){
          //   var x:string = empl.employee
          //   console.log(spot)
          //   // console.log(o[x])
          // }
        
      }
   
      this.final_spots=[...new Set(this.final_spots)]
      this.final_spots.sort(function(a, b) {
        return a[0].start - b[0].start;
     });
     this.final_spots=[...new Set(this.final_spots)]
     var indx:number 
     for (let ind in this.final_spots){
       indx=+ind
       for( let i =indx+1; i<this.final_spots.length;i++ ){
        if(this.final_spots[ind][0]==this.final_spots[i][0]){
          this.final_spots.splice(i,1)
        }
       }
       
     }
 
    await this.emploShow()
     Notiflix.Block.Remove('.bookings-time');
    //  console.log(this.final_spots, 'adfv') 
        // console.log(this.openhours)
        // Notiflix.Block.Remove('.time');
        // // console.log(this.availableSpots, 'hi')
        //     Notiflix.Block.Remove('.bookings-time');
      
    }, 700);
  }
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
          for (let  ind in this.app_to_book){
            Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
            var client_name = this.user.first_name+' '+ this.user.last_name
            var start = this.rows.indexOf(this.times[this.app_to_book[ind].start])
            var end = start + this.app_to_book[ind].duration
            // console.log(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id,this.name)
            this.apiNative.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id).then(async data=>{
              // console.log(data)
              if( ind == '0'){
                // console.log(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.total_service.name,this.name)
                this.sendEmailConfirmation(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.service[ind].name,this.name)
              }this.closeModal()
          Notiflix.Block.Remove('.cont');
           Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
           await this.closeModal()
           await this.router.navigateByUrl('tabs/tab2')
          var x = this.timeslot.split(":")
          var month = this.month
          var day = this.day
          if (day!=1){
              day=day-1
          }else{
              day = this.months_days[this.month-1]
              month=month-1
          }
          this.localNotifications.schedule({
            text: `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} il ${this.today} alle ${this.timeslot}`,
            trigger: {at: new Date(this.year, month, day, 11)},
            led: 'FF0000',
            sound: null
          });
          
          this.localNotifications.schedule({
          text: `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} oggi alle ${this.timeslot}`,
          trigger: {at: new Date(this.year, this.month, this.day, x[0]-2)},
          led: 'FF0000',
          sound: null
        });
          }).catch(
          err=>{
            Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
            console.log(err)
            Notiflix.Block.Remove('.cont');
        })
        }
      }else{
          this.presentRegisterModal()
        }
      }else{
        var month = this.month
        var day = this.day
      if (day!=1){
        day=day-1
      }else{
        day = this.months_days[this.month]-1
        month=month-1
      }
   var x = this.timeslot.split(":")
    // console.log(new Date(this.year, month, this.day, x[0]-2), `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} oggi alle ${this.timeslot}`, new Date(this.year, this.month, day, 11),`Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} il ${this.today} alle ${this.timeslot}`,)
    if(this.api.isvalidToken()){

      for (let  ind in this.app_to_book){
        Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
        var client_name = this.user.first_name+' '+ this.user.last_name
        var start = this.rows.indexOf(this.times[this.app_to_book[ind].start])
        var end = start + this.app_to_book[ind].duration
        // console.log(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id,this.name)
        this.api.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id).subscribe(data=>{
          // console.log(data)
          if( ind == '0'){
            // console.log(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.total_service.name,this.name)
            this.sendEmailConfirmation(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.service[ind].name,this.name)
          }this.closeModal()
      Notiflix.Block.Remove('.cont');
       Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
       this.closeModal()
       this.router.navigateByUrl('tabs/tab2')},
      err=>{
        Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
        console.log(err)
        Notiflix.Block.Remove('.cont');
        })
      }
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
      var token = await this.apiNative.isvalidToken() //occhio l/await non testato
      if(token){
        await this.storage.setAppointment(appointment)
        Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
        for (let  ind in this.app_to_book){
          Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
          var client_name =first_name+' '+ last_name
          var start = this.rows.indexOf(this.times[this.app_to_book[ind].start])
          var end = start + this.app_to_book[ind].duration
          // console.log(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id,this.name)
          this.apiNative.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id).then( async data=>{
            // console.log(data)
            if( ind == '0'){
              // console.log(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.total_service.name,this.name)
              this.sendEmailConfirmation(this.user.email,this.user.first_name,this.user.last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.service[ind].name,this.name)
            }this.closeModal()
        Notiflix.Block.Remove('.cont');
         Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
         await this.closeModal()
         await this.router.navigateByUrl('tabs/tab2')
        var x = this.timeslot.split(":")
        var month = this.month
        var day = this.day
        if (day!=1){
            day=day-1
        }else{
            day = this.months_days[this.month-1]
            month=month-1
        }
        this.localNotifications.schedule({
          text: `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} il ${this.today} alle ${this.timeslot}`,
          trigger: {at: new Date(this.year, month, day, 11)},
          led: 'FF0000',
          sound: null
        });
        
        this.localNotifications.schedule({
        text: `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} oggi alle ${this.timeslot}`,
        trigger: {at: new Date(this.year, this.month, this.day, x[0]-2)},
        led: 'FF0000',
        sound: null
      });
        }).catch(
        err=>{
          Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
          console.log(err)
          Notiflix.Block.Remove('.cont');
      })
      }
      }else{
        this.presentRegisterModal()
      }
    }else{
      var token = await this.api.isvalidToken()
       var month = this.month
        var day = this.day
      if (day!=1){
        day=day-1
      }else{
        day = this.months_days[this.month]-1
        month=month-1
      }
   var x = this.timeslot.split(":")
    // console.log(new Date(this.year, month, this.day, x[0]-2), `Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} oggi alle ${this.timeslot}`, new Date(this.year, this.month, day, 11),`Ricordati il tuo appuntamento presso ${this.name}.\n${this.total_service.name} il ${this.today} alle ${this.timeslot}`,)
    if(this.api.isvalidToken()){
    for (let  ind in this.app_to_book){
      await this.storage.setAppointment(appointment)
      Notiflix.Block.Standard('.cont', 'Prenotaizone in corso...');
      var client_name =first_name+' '+ last_name
      var start = + this.rows.indexOf(this.times[this.app_to_book[ind].start])
      end = start + this.app_to_book[ind].duration
      // console.log(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id,this.name)
      this.api.bookAppointmentNoOwner(start, end, this.day, this.month, this.year, client_name, this.user.phone,  this.service[ind].name, this.app_to_book[ind].employee, this.app_to_book[ind].service,this.id).subscribe(async data=>{
        // console.log(data)
        if( ind == '0'){
          // console.log(email,first_name,last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.total_service.name,this.name)
            this.sendEmailConfirmation(email,first_name,last_name,this.day,this.months_names[this.month],this.year,this.times[this.app_to_book[ind].start],this.service[ind].name,this.name)
          }
          await this.storage.setAppointment(appointment)
          this.closeModal()
      Notiflix.Block.Remove('.cont');
       Notiflix.Report.Success("L'appuntamento è stato prenotato", 'Controlla la tua email per ulteriori informazioni', 'OK');
       await this.closeModal()
       await this.router.navigateByUrl('tabs/tab2')},
      err=>{
        Notiflix.Report.Failure("Errore, prenotazione fallita", 'Controlla la tua connessione o prova a cambiare orario', 'Annulla');
        console.log(err)
        Notiflix.Block.Remove('.cont');
        })
      }
      }else{
        this.presentRegisterModal()
      }
    }
    }
  sendEmailConfirmation(email, name, surname, day, month, year, time, servcie, shop){
    if (this.plt.is('hybrid')) {
      this.apiNative.emailConfirmBooking(email,name,surname,day,month,year,time,servcie,shop).then(
        data=>{
          // console.log(data)
        }).catch(err=>{
            console.log(err)
        }
      )
    }else{
      this.api.emailConfirmBooking(email,name,surname,day,month,year,time,servcie,shop).subscribe(
        data=>{
          // console.log(data)
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
  this.safariViewController.isAvailable()
  .then((available: boolean) => {
      if (available) {

        this.safariViewController.show({
          url: this.website,
          hidden: false,
          animated: true,
          transition: 'curl',
          enterReaderModeIfAvailable: false,
          tintColor: '#0061d5'
        })
        .subscribe((result: any) => {
            if(result.event === 'opened') console.log('Opened');
            else if(result.event === 'loaded') console.log('Loaded');
            else if(result.event === 'closed') console.log('Closed');
          },
          (error: any) => console.error(error)
        );

      } else {
        console.log('no available')
      }
    }
  );
}
}
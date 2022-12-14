import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  batch: any

  showRegister: boolean = true
  showPayment: boolean = false
  showBatch: boolean = false
  showMembership: boolean = false

  userData = {
    username: '',
    idproof: '',
    phone: '',
    address: ''
  }

  month: any
  totalAmount: any
  phone: any
  formateDate: any
  paymentHistory: any

  // http://127.0.0.1:8000/api/batch
  // http://127.0.0.1:8000/api/user
  // http://127.0.0.1:8000/api/user/+id
  // http://127.0.0.1:8000/api/booked
  // http://127.0.0.1:8000/api/payment

  currentDate: any
  constructor(private http: HttpClient) {
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/batch')
      .subscribe(
        rec => {
          this.batch = rec
          console.log(rec, "Data")
        }
      )
  }

  onBack(tab: any) {
    if (tab == 'payment') {
      this.showRegister = false
      this.showPayment = true
      this.showBatch = false
      this.showMembership = false
    }
    if (tab == 'member') {
      this.showRegister = false
      this.showPayment = false
      this.showBatch = false
      this.showMembership = true
    }
    if (tab == 'register') {
      this.showRegister = true
      this.showPayment = false
      this.showBatch = false
      this.showMembership = false
    }
  }

  onRegister(getName: any, getId: any, getPhone: any, getAddress: any) {
    this.userData.username = getName
    this.userData.idproof = getId
    this.userData.phone = getPhone
    this.userData.address = getAddress
    this.phone = getPhone
    this.http.post<any>('http://127.0.0.1:8000/api/user', this.userData)
      .subscribe(res => {
      if (res.error) { alert("User Register Failed " + res.error[0]) }
      else {
        alert("User Register Successfully")
        this.showRegister = false
        this.showPayment = true
        this.showBatch = false
        }
      })  
  }

  selectmonth(month: any) {
    var monthInt: number = + month
    this.month = monthInt
    this.totalAmount = monthInt * 500
  }

  onPay(getPhone: any) {
    var phone = getPhone
    if (this.phone){
      var phone = this.phone
    }
    var fullDate = new Date(new Date().setMonth(new Date().getMonth() + this.month))
    this.formateDate = fullDate.getFullYear() + "-" + (fullDate.getMonth() + 1) + "-" + (fullDate.getDate() - 1)

    var data = {
                "phone": phone,
                "paymentId": "pay-id-123",
                "datePaid": this.formateDate,
                "amount": this.totalAmount,
              }

    this.http.post<any>('http://127.0.0.1:8000/api/payment', data)
    .subscribe(res => {
      if (res.error) { alert("Payment Failed " + res.error[0]) 
        // setTimeout(() => {
         
        //   const body = { status: 'Done' }
        //   this.http.put<any>('http://127.0.0.1:8000/api/history/' + res.id, body)  //id
        //     .subscribe(data => {
        //       console.log("save", this.userData)
        //       if (data) {
                
        //         console.log("save", data.status)
        //       }
        //     })
        // }, 3000)
      
      }
      else {
        alert("Payment Successfully")
        this.showRegister = false
        this.showPayment = false
        this.showBatch = true
      }

    })
  }


  onSlot(getSlot: any) {
    var data = {
      "phone": this.phone,
      "slotBooked": this.formateDate,
      "slot": getSlot,
    }

    this.http.post<any>('http://127.0.0.1:8000/api/booked', data)
      .subscribe(res => {
        if (res.error) {
          alert("Payment Failed " + res.error[0])
          // setTimeout(() => {

          //   const body = { status: 'Done' }
          //   this.http.put<any>('http://127.0.0.1:8000/api/history/' + res.id, body)  //id
          //     .subscribe(data => {
          //       console.log("save", this.userData)
          //       if (data) {

          //         console.log("save", data.status)
          //       }
          //     })
          // }, 3000)

        }
        else {
          this.paymentHistory = res
          alert("Payment Successfully")
          this.showRegister = false
          this.showPayment = false
          this.showBatch = false
          this.showMembership = true
        }

      }) 
  }

  showMember(getPhone:any) {
    this.phone = getPhone
    this.http.get('http://127.0.0.1:8000/api/user?phone='+this.phone)
      .subscribe(
        rec => {
          if(rec){
            // history of booking
            this.paymentHistory=rec
          }
          else{
            // please Book a slot
          }
        }
      )


    
  }
  // planfilter(getData: any) {
  //   let params = new HttpParams();
  //   params = params.append('state', this.selectState);
  //   params = params.append('operator', this.selectOperator)
  //   params = params.append('plan_category', getData)
  //   console.log("Param .........", params)
  //   this.http.get('http://127.0.0.1:8000/api/plan', { params: params })
  //     .subscribe(
  //       rec => {
  //         this.plans = rec
  //         console.log(rec, "Data")
  //       }
  //     )
  // }

  
  Close() {
    // this.btnPay = true
    // this.loadWait = false
    // this.loadDone = false
    this.showRegister = true
    this.showPayment = false
    this.showBatch = false
  }


}

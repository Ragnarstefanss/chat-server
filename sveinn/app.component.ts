import { Component } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  socket: any;
  userName: string;
  loginFailed: boolean = false;
  loginSucceeded: boolean = false;
  test: any;
  rlist: any;

  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function(){
      console.log("connect");
    });
    this.socket.on("roomlist", function(r){
      console.log("Receiving a list of rooms");
      console.log(r);
      this.rlist = r;
      console.log(this.rlist);
    });
  }
  onLogin() {
    this.socket.emit("adduser", this.userName, succeeded => {
      if (!succeeded) {
        this.loginFailed = true;
      } else {
        console.log("Login succeeded!");
        this.socket.emit("rooms");
        this.title = "nope";
        this.test = "bleh";
      }
    });
  }

}

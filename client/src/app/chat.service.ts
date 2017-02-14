import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatService {

  socket : any;
  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function(){
      console.log("connect");
    });
  }
  login(userName: string) : Observable<boolean> {
    let observable = new Observable( observer => {
      this.socket.emit("adduser", userName, succeeded => {
        console.log("Reply received");
        observer.next(succeeded);
      });
    });
    return observable;
  }

    getRoomList() : Observable<string[]> {
      const obs = new Observable(observer => {
        this.socket.emit("rooms");
        this.socket.on("roomlist", (lst) => {
          const strArr: string[] = [];
          for(var x in lst){
            if(lst.hasOwnProperty(x)) {
              strArr.push(x);
            }
          }
          observer.next(strArr);
        })
      });
      return obs;
    }

    addRoom(roomName: string) :  Observable<boolean> {
      const observable = new Observable(observer => {
        //todo: VALIDATE THAT THE ROOM NAME IS VALIDATE
        var param =  {
          room: roomName
        }
        this.socket.emit("joinroom", param, function(a : boolean, b) {
          observer.next(a);
        });
      });
      return observable;
    }
}

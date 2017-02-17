import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket : any;
  bleh: any;
  constructor() {
          this.socket = io("http://localhost:8080/");
      this.socket.on("connect", function(){
        console.log("connect");
      });
   }
   login(userName : string) : Observable<boolean>{
     let observable = new Observable(observer => {
       this.socket.emit("adduser", userName, succeeded =>{
        console.log("Reply receved");
        observer.next(succeeded);
      });
     });

    return observable;
   }
   getRoomsList() : Observable<string[]> {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        let strArr: string[] = [];
        for(var x in lst){
          strArr.push(x);
          console.log((lst).lobby.topic);
          console.log((lst[x]));
          console.log((lst[x]).topic);
        }
        observer.next(strArr);
      })
    });
    return obs;
   }
/*
  joinRoom(room : string) : Observable<boolean>{
     let observable = new Observable(observer => {
       this.socket.emit("adduser", room, succeeded =>{
        console.log("Reply receved");
        observer.next(succeeded);
      });
     });

    return observable;
   }
*/
   joinRoom(roomName: string) : Observable<boolean>{
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
    showChat(roomName: string) : Observable<string[]> {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        let strArr: string[] = [];

        for(var x in lst){
          if(x == roomName)
          {
            for(var y in (lst[x]["messageHistory"]))
            {
              console.log("y :"+ y);
               var tempMsg =(lst[x]["messageHistory"][y]["nick"])+": "+(lst[x]["messageHistory"][y]["message"])+"  "+(lst[x]["messageHistory"][y]["timestamp"]);
               //var tempMsg =(lst[x]["messageHistory"][y]);
        console.log(tempMsg);
          strArr.push(tempMsg);
            }
          }
        //console.log((lst).lobby.topic);
          //console.log((lst[x]));
          //console.log((lst[x]).topic);
        }
        observer.next(strArr);
      })
    });
    return obs;
   }

   showUsers(roomName: string) : Observable<string[]> {
    let obs = new Observable(observer => {

    //this.socket.on('updatechat',(roomname,lst) => {
      this.socket.on('updateusers', (roomName, users, ops) =>{
        let strArr: string[] = [];
          for(var x in users){
              strArr.push(x);
          }
          observer.next(strArr);
      })

    });
    return obs;
      /*
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        let strArr: string[] = [];

        for(var x in lst){
          if(x == roomName)
          {
            for(var y in (lst[x]["users"]))
            {
              console.log("y :"+ y);

               //var tempMsg =(lst[x]["messageHistory"][y]);
        console.log((lst[x]["users"][y]));
          strArr.push((lst[x]["users"][y]));
            }
          }
        //console.log((lst).lobby.topic);
          //console.log((lst[x]));
          //console.log((lst[x]).topic);
        }
        observer.next(strArr);
      })
    });
    return obs;
    */
   }

   sendmsg(roomname: string, Msg: string) : Observable<string[]>{
      const observable = new Observable(observer => {
        //todo: VALIDATE THAT THE ROOM NAME IS VALIDATE
        var param =  {
          roomName: roomname,
          msg: Msg
        }
        this.socket.emit("sendmsg", param);

        this.socket.on('updatechat',(roomname,lst) => {
          console.log("updatechat");
          console.log(lst);
          let strArr: string[] = [];
          for(var x in lst){
            var tempMsg =(lst[x]["nick"])+": "+(lst[x]["message"])+"  "+(lst[x]["timestamp"]);
            console.log(tempMsg);
          strArr.push(tempMsg);
        }
        observer.next(strArr);
        })
        /*
        this.socket.emit("sendmsg", param, function(a : boolean, b){
          observer.next(a);

        });
        */
        //io.sockets.emit('updatechat', data.roomName, rooms[data.roomName].messageHistory);

   });
   console.log(observable);
   return observable;
  }

  Leave(room:string) : Observable<boolean>{
     const observable = new Observable(observer => {
            var mess = "left the room";
       var param =  {
          roomName: room,
          msg: mess
        }
        this.socket.emit("sendmsg", param);
       this.socket.emit('partroom',room, function(a : boolean, b) {
          observer.next(a);
        });




     });
    //		io.sockets.emit('updateusers', room, rooms[room].users, rooms[room].ops);
		//io.sockets.emit('servermessage', "part", room, socket.username);
    return observable;
  }

  /*
joinRoom(roomName: string) : Observable<boolean>{
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
  */



  //partroom

}

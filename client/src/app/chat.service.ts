import {
  Injectable
} from '@angular/core';
import * as io from "socket.io-client";
import {
  Observable
} from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket: any;
  bleh: any;
  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function() {
      console.log("connect");
    });
  }
  login(userName: string): Observable < boolean > {
    let observable = new Observable(observer => {
      this.socket.emit("adduser", userName, succeeded => {
        console.log("Reply receved");
        observer.next(succeeded);
      });
    });

    return observable;
  }
  getRoomsList(): Observable < string[] > {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        let strArr: string[] = [];
        for (var x in lst) {
          strArr.push(x);
        }
        observer.next(strArr);
      })
    });
    return obs;
  }

  joinRoom(roomName: string): Observable < boolean > {
    const observable = new Observable(observer => {
      //todo: VALIDATE THAT THE ROOM NAME IS VALIDATE
      var param = {
        room: roomName
      }
      this.socket.emit("joinroom", param, function(a: boolean, b) {
        observer.next(a);
      });
    });
    return observable;
  }
  showChat(roomName: string): Observable < string[] > {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {
        let strArr: string[] = [];

        for (var x in lst) {
          if (x == roomName) {
            for (var y in (lst[x]["messageHistory"])) {
              var tempMsg = (lst[x]["messageHistory"][y]["nick"]) + ": " + (lst[x]["messageHistory"][y]["message"]) + "  " + (lst[x]["messageHistory"][y]["timestamp"]);
              strArr.push(tempMsg);
            }
          };
        }
        observer.next(strArr);
      })
    });
    return obs;
  }

  showUsers(roomName: string): Observable < string[] > {
    let obs = new Observable(observer => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        let strArr: string[] = [];
        for (var x in users) {
          var temp = x + " *OP*";
          strArr.push(temp);
        }
        for (var x in users) {
          strArr.push(x);
        }
        observer.next(strArr);
      })

    });
    return obs;
  }

  sendmsg(roomname: string, Msg: string): Observable < string[] > {
    const observable = new Observable(observer => {
      //todo: VALIDATE THAT THE ROOM NAME IS VALIDATE
      var param = {
        roomName: roomname,
        msg: Msg
      }
      this.socket.emit("sendmsg", param);

      this.socket.on('updatechat', (roomname, lst) => {
        let strArr: string[] = [];
        for (var x in lst) {
          var tempMsg = (lst[x]["nick"]) + ": " + (lst[x]["message"]) + "  " + (lst[x]["timestamp"]);
          strArr.push(tempMsg);
        }
        observer.next(strArr);
      })
    });
    return observable;
  }

  Leave(room: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var mess = "left the room";
      var param = {
        roomName: room,
        msg: mess
      }
      this.socket.emit("sendmsg", param);
      this.socket.emit('partroom', room, function(a: boolean, b) {
        observer.next(a);
      });
    });

    return observable;
  }
  //partroom

}

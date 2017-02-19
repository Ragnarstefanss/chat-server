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
  user: string;
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
        this.user = userName;
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
          console.log("user is " + this.user);
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
              console.log("y :" + y);
              var tempMsg = (lst[x]["messageHistory"][y]["nick"]) + ": " + (lst[x]["messageHistory"][y]["message"]) + "  " + (lst[x]["messageHistory"][y]["timestamp"]);
              //var tempMsg =(lst[x]["messageHistory"][y]);
              console.log(tempMsg);
              strArr.push(tempMsg);
            }
          }
        }
        observer.next(strArr);
      })
    });
    return obs;
  }

  showUsers(roomName: string): Observable < string[] > {
    let obs = new Observable(observer => {

      //this.socket.on('updatechat',(roomname,lst) => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        let strArr: string[] = [];
        for (var x in ops) {
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

  showTopic(roomName: string): Observable < string > {
    let obs = new Observable(observer => {

      this.socket.on('updatetopic', (r, topic, username) => {
        if (r == roomName) {
          console.log("topic changed");
          observer.next(topic);
        }
      });

    });
    return obs;
  }



  CheckOp(roomName: string): Observable < boolean > {
    let obs = new Observable(observer => {

      //this.socket.on('updatechat',(roomname,lst) => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        var isOp = false;
        for (var x in ops) {
          if (x == this.user) {
            isOp = true;
            console.log("you are an OP go kill anons");
          }

        }
        observer.next(isOp);
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

      this.socket.on('updatechat', (room, lst) => {
        console.log("updatechat");
        console.log(lst);
        if (room == roomname) {
          let strArr: string[] = [];
          for (var x in lst) {

            var tempMsg = (lst[x]["nick"]) + ": " + (lst[x]["message"]) + "  " + (lst[x]["timestamp"]);
            console.log(tempMsg);
            strArr.push(tempMsg);

          }
          observer.next(strArr);
        }
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

  disconnect(room: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var mess = "disconnected ";
      var param = {
        roomName: room,
        msg: mess
      }
      this.socket.emit("sendmsg", param);
      this.socket.emit("disconnect", function(a: boolean, b) {
        observer.next(a);
      })
    });
    return observable;
  }
  setTopic(room: string, topic: string): Observable < string > {
    const observable = new Observable(observer => {
      var mess = "disconnected ";
      var param = {
        room: room,
        topic: topic
      }
      this.socket.emit("settopic", param);
    })
    return observable;
  }
  kick(username: string, r: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var param = {
        room: r,
        user: username
      }
      var wasKicked;
      var mess = "user " + username + "was kicked by " + this.user;
      var param2 = {
        roomName: r,
        msg: mess
      }
      this.socket.emit("sendmsg", param2);
      this.socket.emit("kick", param, function(a: boolean) {
        observer.next(a);
      });

    })
    return observable;

  }
  ban(username: string, r: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var param = {
        room: r,
        user: username
      }
      var mess = "user " + username + "was banned by " + this.user + " for being an asshole";
      var param2 = {
        roomName: r,
        msg: mess
      }
      this.socket.emit("sendmsg", param2);
      this.socket.emit("ban", param, function(a: boolean) {
        observer.next(a);
      });

    })
    return observable;

  }
  Op(username: string, r: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var param = {
        room: r,
        user: username
      }
      var mess = "user " + username + "was OPed by " + this.user;
      var param2 = {
        roomName: r,
        msg: mess
      }
      this.socket.emit("sendmsg", param2);
      this.socket.emit("op", param, function(a: boolean) {
        observer.next(a);
      });
    })
    return observable;

  }
  deban(username: string, r: string): Observable < boolean > {

    const observable = new Observable(observer => {
      var param = {
        room: r,
        user: username
      }
      var mess = "user " + username + "was debaned by" + this.user + " try to behave your self this time";
      var param2 = {
        roomName: r,
        msg: mess
      }
      this.socket.emit("sendmsg", param2);
      this.socket.emit("deban", param, function(a: boolean) {
        observer.next(a);
      });

    })
    return observable;

  }
  deOp(username: string, r: string): Observable < boolean > {
    const observable = new Observable(observer => {

      var mess = "user " + username + "was DeOped by" + this.user;
      var param2 = {
        roomName: r,
        msg: mess
      }
      var param = {
        room: r,
        user: username
      }
      this.socket.emit("sendmsg", param2);
      this.socket.emit("deop", param, function(a: boolean) {
        observer.next(a);
      });

    })
    return observable;

  }

  privatemsg(username: string, room: string, message: string) {

  }
  onKickBan(roomname: string): Observable < boolean > {
    const observable = new Observable(observer => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        var temp = false;
        for (var x in ops) {
          if (this.user == x) {
            temp = true;
          }
        }
        for (var x in users) {
          {
            temp = true;
          }
        }
        observer.next(temp);
      })

    });
    return observable;
  }

}

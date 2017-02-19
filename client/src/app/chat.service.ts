import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

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

  getUsers(): Observable < string[] > {
    let obs = new Observable(observer => {
      this.socket.emit("users");
      this.socket.on("userlist", (lst) => {
        let strArr: string[] = [];
        for (var x in lst) {
          strArr.push(lst[x]);
          console.log("user is " + this.user);
        }
        observer.next(strArr);
      })
    });
    return obs;
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
      if (this.user != undefined) {
        console.log("user is " + this.user);
        this.socket.emit("joinroom", param, function(a: boolean, b) {
          observer.next(a);
        });
      } else {
        observer.next(false);
      }

    });
    return observable;
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
      if (this.user != undefined) {
        this.socket.on('updatetopic', (r, topic, username) => {
          if (r == roomName) {
            console.log("topic changed");
            observer.next(topic);
          }
        });
      } else {
        observer.next("not logged inn");
      }


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
      if (this.user != undefined) {
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

              var tempMsg = (lst[x]["nick"]) + ": " + (lst[x]["message"]);
              console.log(tempMsg);
              strArr.push(tempMsg);

            }
            observer.next(strArr);
          }
        })
      }
    });
    return observable;
  }

  showPs(): Observable < string > {
    const observable = new Observable(observer => {
      this.socket.on('recv_privatemsg', (username, message) => {
        var tempMsg = "(PS)" + username + ": " + message + "  ";
        observer.next(tempMsg);
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
      console.log("leave");
      this.socket.emit("sendmsg", param);
      this.socket.emit('partroom', room, function(a: boolean, b) {
        observer.next(a);
      });
    });
    return observable;
  }
  //Disconnect is kinda broken it does redirect them to the login page but the disconnect message wount activate until you refresh the page
  disconnect(room: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var mess = "disconnected ";
      var param = {
        roomName: room,
        msg: mess
      }
      console.log("Disconnect");
      this.socket.emit("sendmsg", param);
      console.log("disconnecting!");
      //this.socket.emit("disconnect", function (a: boolean, b) {observer.next(true);
      this.socket.emit("disconnect");
      observer.next(true);
    });
    return observable;
  }
  setTopic(room: string, topic: string): Observable < string > {
    const observable = new Observable(observer => {
      var param = {
        room: room,
        topic: topic
      }
      this.socket.emit("settopic", param, function(a: boolean, b) {});
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
      var mess = username + " was kicked by " + this.user;
      var param2 = {
        roomName: r,
        msg: mess
      }
      console.log("kick");
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
      var mess = username + " was banned by " + this.user;
      var param2 = {
        roomName: r,
        msg: mess
      }
      console.log("ban");
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
      var mess = username + " was OPed by " + this.user;
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
      var mess = username + " was debaned by" + this.user + " try to behave your self this time";
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

      var mess = username + " was DeOped by" + this.user;
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

  privatemsg(username: string, room: string, Message: string): Observable < boolean > {
    const observable = new Observable(observer => {
      var param = {
        nick: username,
        message: Message
      }
      this.socket.emit("privatemsg", param, function(a: boolean, b) {
        observer.next(a);
      })

    });
    return observable;
  }
  onKickBan(roomname: string): Observable < boolean > {
    const observable = new Observable(observer => {
      this.socket.on('banned', (room, user, username) => {
        if (room == roomname && user == this.user) {
          observer.next(true);
          console.log("you got banned");
        }
      });
      this.socket.on('kicked', (room, user, username) => {
        if (room == roomname && user == this.user) {
          observer.next(true);
          console.log("you got kicked");
        }
      });
    });
    return observable;
  }

}

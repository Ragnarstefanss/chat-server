import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  constructor(private chatService: ChatService, private router: Router, private route: ActivatedRoute) { }
  msg: string;
  roomId: string;
  users: string[];
  messageHistory: string[];
  topic: string;
  newTopic: string;
  admin: boolean = false;
  psUser: string;
  psMsg: string;
  OpUser: string;
  PsmessageHistory: string[];

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
    this.chatService.showTopic(this.roomId).subscribe(lst => {
      if (lst == "not logged inn") {
        console.log("not logged in returning to login");
        this.router.navigate(["./"]);
      }
      console.log("lst :" + lst);
      this.topic = lst;
    })
    this.chatService.sendmsg(this.roomId, "Joined").subscribe(lst => {
      //console.log("succeeded?" + succeeded);
      this.messageHistory = lst;
    });
    this.chatService.showUsers(this.roomId).subscribe(lst => {
      console.log("lst :" + lst);
      this.users = lst;
    })
    this.chatService.CheckOp(this.roomId).subscribe(lst => {
      console.log("lst :" + lst);
      if (lst == true) {
        console.log("you are an op");
        this.admin = true;
      }
      else {
        this.admin = false;
      }
    })
    this.chatService.onKickBan(this.roomId).subscribe(succeeded => {
      if (succeeded === true) {
        this.router.navigate(["./rooms"]);
      }
    })
    this.chatService.showPs().subscribe(result => {
      console.log("result = " + result);
      if (this.PsmessageHistory == undefined) {
        this.PsmessageHistory = [];
      }
      this.PsmessageHistory.push(result);
    })

  }
  onSend() {
    console.log("sendmsg called in component");
    if (this.msg.length < 1) {
      return;
    }
    this.chatService.sendmsg(this.roomId, this.msg).subscribe(lst => {
      //console.log("succeeded?" + succeeded);
      this.messageHistory = [];
      this.messageHistory = lst;
      this.msg = "";
    });

    console.log("message sent");
  }
  onLeave() {
    this.chatService.Leave(this.roomId).subscribe(succeeded => {
      if (succeeded === true) {
        console.log("bleh test");
        this.router.navigate(["./rooms"]);
      }
      else {
        console.log("bleh else");
      }
    });
    this.router.navigate(["./rooms"]);
  }
  //does not work propperly you
  onDisconnect() {
    this.chatService.disconnect(this.roomId).subscribe(succeeded => {
      console.log(succeeded);
      if (succeeded == true) {
        this.router.navigate(["../"]);
      }
      this.router.navigate(["../"]);
    });


  }
  onChangeTopic() {
    this.chatService.setTopic(this.roomId, this.newTopic).subscribe(succeeded => {
    });
  }
  onKick() {
    this.chatService.kick(this.OpUser, this.roomId).subscribe(succeeded => {
      console.log("kicked " + this.OpUser);
    });
  }
  onBan() {
    var isInRoom = false;
    for (var u in this.users) {
      if (this.users[u] == this.OpUser) {
        console.log("user is in room");
        isInRoom = true;
      }
    }
    if (isInRoom == true) {
      this.chatService.ban(this.OpUser, this.roomId).subscribe(succeeded => {
      });
    }

  }
  onDeBan() {
    console.log("deban");
    this.chatService.deban(this.OpUser, this.roomId).subscribe(succeeded => {
    });
  }
  onOp() {
    var isInRoom = false;
    for (var u in this.users) {
      if (this.users[u] == this.OpUser) {
        console.log("user is in room");
        isInRoom = true;
      }
    }
    if (isInRoom == true) {
      this.chatService.Op(this.OpUser, this.roomId).subscribe(succeeded => {
      });
    }

  }
  onDeOp() {
    var isInRoom = false;
    var test = this.OpUser + " *OP*";
    for (var u in this.users) {

      if (this.users[u] == test) {
        isInRoom = true;
      }
    }

    if (isInRoom == true) {
      this.chatService.deOp(this.OpUser, this.roomId).subscribe(succeeded => {
      });
    }
  }
  onPsMsg() {
    this.chatService.privatemsg(this.psUser, this.roomId, this.psMsg).subscribe(succeeded => {
      var tempMsg = "(" + this.psUser + ")" + ": " + this.psMsg;
      if (this.PsmessageHistory == undefined) {
        this.PsmessageHistory = [];
      }
      this.PsmessageHistory.push(tempMsg);
    });
  }
}

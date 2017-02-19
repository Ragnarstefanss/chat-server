import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  constructor(private chatService: ChatService, private router: Router, private route: ActivatedRoute) {}
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

    this.chatService.sendmsg(this.roomId, "Joined").subscribe(lst => {
      //console.log("succeeded?" + succeeded);
      this.messageHistory = [];
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
    })

    this.chatService.showTopic(this.roomId).subscribe(lst => {
      console.log("lst :" + lst);
      this.topic = lst;
    })
    this.chatService.onKickBan(this.roomId).subscribe(succeeded => {
      if (succeeded === true) {
        this.router.navigate(["./rooms"]);
      }

    })
    this.chatService.showPs().subscribe(result => {
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
    });

    console.log("message sent");
  }
  onLeave() {
    this.chatService.Leave(this.roomId).subscribe(succeeded => {
      if (succeeded === true) {
        console.log("bleh test");
        this.router.navigate(["./rooms"]);
      } else {
        console.log("bleh else");
      }
    });
    this.router.navigate(["./rooms"]);
  }
  onDisconnect() {

    this.chatService.disconnect(this.roomId).subscribe(succeeded => {});

    this.router.navigate(["./"]);
  }
  onChangeTopic() {
    this.chatService.setTopic(this.roomId, this.newTopic).subscribe(succeeded => {});
  }
  onKick() {
    this.chatService.kick(this.OpUser, this.roomId).subscribe(succeeded => {
      console.log("kicked " + this.OpUser);
    });
  }
  onBan() {
    this.chatService.ban(this.OpUser, this.roomId).subscribe(succeeded => {});

  }
  onDeBan() {
    console.log("deban");
    this.chatService.deban(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onOp() {
    this.chatService.Op(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onDeOp() {
    this.chatService.deOp(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onPsMsg() {
    this.chatService.privatemsg(this.psUser, this.roomId, this.psMsg).subscribe(succeeded => {  });
  }
}

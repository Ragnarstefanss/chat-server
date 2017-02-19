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

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
    this.chatService.sendmsg(this.roomId, "Joined").subscribe(lst => {

      this.messageHistory = lst;
    });
    this.chatService.showUsers(this.roomId).subscribe(lst => {
      this.users = lst;
    })
    this.chatService.CheckOp(this.roomId).subscribe(lst => {
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
      if (succeeded === false) {
        this.router.navigate(["./rooms"]);
      }

    })

  }
  onSend() {
    if (this.msg.length < 1) {
      return;
    }
    this.chatService.sendmsg(this.roomId, this.msg).subscribe(lst => {
      //console.log("succeeded?" + succeeded);
      this.msg = "";
      this.messageHistory = lst;
    });
    console.log("message sent");
  }
  onLeave() {
    this.chatService.Leave(this.roomId).subscribe(succeeded => {
      if (succeeded === true) {
        this.router.navigate(["./rooms"]);
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
      this.OpUser = "";
      console.log("kicked " + this.OpUser);
    });
  }
  onBan() {
    this.OpUser = "";
    this.chatService.ban(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onDeBan() {
    this.OpUser = "";
    this.chatService.deban(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onOp() {
    this.OpUser = "";
    this.chatService.Op(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onDeOp() {
    this.OpUser = "";
    this.chatService.deOp(this.OpUser, this.roomId).subscribe(succeeded => {});
  }
  onPsMsg() {
    //this.chatService.privatemsg(this.OpUser, this.roomId,this.psMsg).subscribe(succeeded => {});
  }
}

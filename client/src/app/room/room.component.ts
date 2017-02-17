import { Component, OnInit } from '@angular/core';
import { ChatService} from "../chat.service";
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

    ngOnInit() {
      this.roomId = this.route.snapshot.params['id'];
      this.chatService.sendmsg(this.roomId, "Joined").subscribe(lst => {
      this.messageHistory = lst;
    });
    this.chatService.showUsers(this.roomId).subscribe(lst => {
      this.users = lst;
    })

  }
  onSend() {
    if (this.msg.length < 1) {
      return;
    }
    this.chatService.sendmsg(this.roomId, this.msg).subscribe(lst => {
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
}

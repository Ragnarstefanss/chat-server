import { Component, OnInit } from '@angular/core';
import { ChatService} from "../chat.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {


  constructor(private chatService : ChatService,private router: Router,private route : ActivatedRoute) { }

  msg: string;
roomId : string;
users : string[];
messageHistory : string[];
topic: string;

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
    /*
    this.chatService.showChat(this.roomId).subscribe(lst => {
      console.log("lst :"+lst);
      this.messageHistory = lst;
    })
    */
    this.chatService.sendmsg(this.roomId,"Joined").subscribe(lst =>{
        //console.log("succeeded?" + succeeded);
        this.messageHistory = lst;
      });
    this.chatService.showUsers(this.roomId).subscribe(lst => {
      console.log("lst :"+lst);
      this.users = lst;
    })

  }
  onSend() {
      console.log("sendmsg called in component");
      if(this.msg.length < 1)
      {
        return;
      }
      this.chatService.sendmsg(this.roomId,this.msg).subscribe(lst =>{
        //console.log("succeeded?" + succeeded);
        this.messageHistory = lst;
      });

      console.log("message sent");
  }
  onLeave(){
    this.chatService.Leave(this.roomId).subscribe(succeeded =>{
        if(succeeded === true)
        {
          console.log("bleh test");
          this.router.navigate(["./rooms"]);
        }
        else
        {
          console.log("bleh else");
        }
  });
  this.router.navigate(["./rooms"]);
  }
}

import { Component, OnInit } from '@angular/core';
import { IonTabButton , IonTabs,IonTabBar, IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabButton,IonTabs, IonTabBar, IonIcon]
})
export class TabsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

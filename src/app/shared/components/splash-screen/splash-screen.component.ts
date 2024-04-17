import { CommonModule } from '@angular/common';
import { SplashScreenService } from './../../services/splash-screen/splash-screen.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SplashScreenComponent implements OnDestroy {
  public showSplash = true;
  private splashScreenService = inject(SplashScreenService);

  splashSubscription: Subscription;

  constructor() { 
    this.splashSubscription = this.splashScreenService.onChanges.subscribe((show: boolean) => {
      this.showSplash = show;
    });
  }

  ngOnDestroy(): void {
    this.splashSubscription.unsubscribe();
  }

}

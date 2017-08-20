import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarActions } from './services/actions.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  sidebarIsOpen: boolean;

  constructor(private sidebarActions: SidebarActions){
    this.sidebarIsOpen = this.sidebarActions.getState();

    this.subscriptions.push(
      this.sidebarActions.isOpenChange.subscribe(state => {
        this.sidebarIsOpen = state;
      })
    )
  }

  ngOnInit() {
  	const $preloader = $('body').children('#preloader');
  	
  	window.onload = () => {
			$preloader.animate({opacity: 0}, 1000, function() {
         $(this).css({'display':'none'});
			});
		};
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

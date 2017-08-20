import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { FeedbackService } from '../feedback.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'feedback-form',
  templateUrl: 'feedback-form.component.html',
  styleUrls: ['../scss/main.scss', 'feedback-form.component.scss'],
  providers: [NgForm]
})
export class FeedbackFormComponent implements OnInit, OnDestroy {
  @Output() onSended = new EventEmitter<boolean>();
  subscriptions: Subscription[] = [];

  constructor(private appService: FeedbackService, private notifyService: NotificationService) {}

  ngOnInit() {
    $('html').css({'overflow-y': 'hidden'});
  }

  ngOnDestroy() {
    $('html').css({'overflow-y': 'auto'});
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  sendFeedback(form: NgForm) {
    this.subscriptions.push(this.appService.sendFeedback(form.value).subscribe((resp: boolean) => {
        this.notifyService.success("Ваше сообщение успешно отправленно!");
        this.onSended.emit();
      },
      err => {
        this.notifyService.error("Ошибка при отправке формы.<br/>Пожалуйста, попробуйте позднее.");
      }
    ));
  }
}

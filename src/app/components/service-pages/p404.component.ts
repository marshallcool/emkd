import { Component } from '@angular/core';


@Component({
  selector: 'page-not-found',
  template: `
	  <div class="service-page service-page--404">
	  	<h2>Ссылка на страницу неверная. Воспользуйтесь пунктами меню.</h2>
	  </div>
  `,
  styleUrls: ['service-pages.scss'],
})
export class Page404Component  {
}

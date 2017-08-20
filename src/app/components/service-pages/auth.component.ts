import { Component } from '@angular/core';


@Component({
  selector: 'restrict-page',
  template: `
	  <div class="service-page service-page--restrict">
	  	<h2>Для доступа на эту страницу вам необходимы дополнительные права.</h2>
	  </div>
  `,
  styleUrls: ['service-pages.scss'],
})
export class RestrictPageComponent  {
}


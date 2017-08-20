

export default class Helpers {
	
	public static formatPhone(phone) {
		if (!phone || phone.toString().length !== 10) return '';

		const letters = phone.toString().split('');
		const prefix = letters[0] + letters[1] + letters[2];
		const first = letters[3] + letters[4] + letters[5];
		const second = letters[6] + letters[7];
		const third = letters[8] + letters[9];

		return ('+7 (' + prefix + ') ' + first + '\u2011' + second + '\u2011' + third);
	}


	public static unmaskPhone(phone:string):string {
		return phone.replace(/[+ \(\)-]/g, '');
	}


	// http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158
	public static dataURItoBlob(dataURI) {
	  // convert base64/URLEncoded data component to raw binary data held in a string
	  var byteString;
	  if (dataURI.split(',')[0].indexOf('base64') >= 0)
	      byteString = atob(dataURI.split(',')[1]);
	  else
	      byteString = decodeURIComponent(dataURI.split(',')[1]);

	  // separate out the mime component
	  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	  // write the bytes of the string to a typed array
	  var ia = new Uint8Array(byteString.length);
	  for (var i = 0; i < byteString.length; i++) {
	      ia[i] = byteString.charCodeAt(i);
	  }

	  return new Blob([ia], {type:mimeString});
	}


	public static getFileExt(name) {
		return name.match(/\.[0-9a-z]+$/i)[0].slice(1);
	}


	public static objIsEmpty(obj):boolean {
		return Object.keys(obj).length === 0;
	}



	public static onSwipeLeft(el, callback) {
		if (!el || typeof callback !== 'function') return false;

    el.addEventListener('touchstart', handleTouchStart, false);
    el.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
  
      let xUp = evt.touches[0].clientX;
      let yUp = evt.touches[0].clientY;

      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          callback();
        }
      }

      xDown = null;
      yDown = null;
    }
	}



}

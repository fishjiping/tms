export const HOST = location.href.indexOf('dev') !== -1 ? '//dailyka.52shangou.com' : `//${location.hostname}`;

export const H5_HOST = location.href.indexOf('daily') !== -1 
    ? 'http://daily.m.52shangou.com/' 
    : location.href.indexOf('gray') !== -1 
        ? 'http://gray.m.52shangou.com/'
        :'http://h5.m.52shangou.com/';

export const H5_HOST_HTTPS = location.href.indexOf('daily') !== -1 
    ? 'https://dailym.52shangou.com/' 
    : location.href.indexOf('gray') !== -1 
        ? 'https://graym.52shangou.com/'
        :'https://m.52shangou.com/';

export const ORGANIZE_ID = window.FEC.orgInfo ? window.FEC.orgInfo.id : '';

export const getUid = function () {
    return `${Date.now().toString(36)}_${("00000" + (Math.random()*Math.pow(36,5) << 0).toString(36)).slice(-5)}`;
};

export const urlParams = (function () {
    var search = window.location.search.replace(/^\?/, '');
    var params;
    var result = {};
    if (search) {
        params = search.split('&');
        for (var i = 0; i < params.length; i++) {
            params[i] = params[i].split('=');
            try {
                result[params[i][0]] = decodeURIComponent(params[i][1]);
            } catch (e) {
                result[params[i][0]] = params[i][1];
            }
        }
    }
    return result;
})();

export const throttle = function (func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = Date.now();
        timeout = null;
        result = func.apply(context, args);
    };
    return function () {
        var now = Date.now();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

export function debounce(func, wait, immediate){
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;
  
    function later() {
      var last = Date.now() - timestamp;
  
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };
  
    var debounced = function(){
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
  
      return result;
    };
  
    debounced.clear = function() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    
    debounced.flush = function() {
      if (timeout) {
        result = func.apply(context, args);
        context = args = null;
        
        clearTimeout(timeout);
        timeout = null;
      }
    };
  
    return debounced;
  };

export function base64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return new File([blob], 'image.jpg');
};

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
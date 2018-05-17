/**
 * 异步请求， 使用fetch API
 * IE下使用polyfill
 */
import 'whatwg-fetch';

const LOGIN_LINK = '/member/login.html?';
const param2string = (params) => {
    let ps = Object.keys(params).map(key => {
        return `${key}=${params[key] == undefined ? '' : params[key]}`;
    })

    return ps.join('&');
}

export default class Ajax {
    /**
     * 普通的get请求
     */
    static get(url, options = {}) {
        if (!url) { url = '/'};

        if (!options) {
            options = {};
        }

        if (!options.params) {
            options.params = {};
        }

        options.method = 'GET';

        if (typeof options.params === 'object') {   
            options.params = param2string(Object.assign({t: Date.now()}, options.params));
        }
        if (options.params) {
            if (url.indexOf('?') < 0) {
                url += `?${options.params}`
            } else {
                url += `&${options.params}`
            }
        }
        

        delete options.params;

        return this._request(url, options);
    }

    static post(url, options = {}) {
        if (!url) { url = '/' }

        options.method = 'POST';

        options = Object.assign({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, options);

        if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof options.body === 'object') {
            options.body = param2string(options.body);
        }

        return this._request(url, options);
    }

     /*
     注意：参数通过options.body传递，例如Ajax.post(url, {body: {id:9527}})
     */
    static postForm(url, options = {}) {
        if (!url) { url = '/'; }
        options.method = 'POST';
        let formData = new FormData();

        Object.keys(options.body).forEach(key => {
            formData.append(key, options.body[key])
        })

        options.body = formData;

        return this._request(url, options);
    }

    static postJSON(url, options = {}) {
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        options.body = JSON.stringify(options.body);

        return this.post(url, options);
    }

    static _request(url, options = {}) {
        // 携带cookie
        options = Object.assign({
            credentials: 'include'
        }, options)

        return fetch(url, options).then(res => {
            if (res.status < 200 || res.status >= 300) {
                let err = new Error(res.statusText);
                err.response = res;
                throw err;
            }
            return res.json();
        }).then(json => {
            if (json.responseCode === 10212 && json.status === false) {
                console.log('当前状态未登录', {url: url, response: json});

                if (options.directToLogin) {
                    location.href = `${LOGIN_LINK}redirectUrl=${location.href}`
                }
                return json;
            } else {
                return json;
            }
        })
    }
}
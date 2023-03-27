import Taro from "@tarojs/taro";
class httpRequest {
  baseOptions(params, method = "GET") {
      let contentType = "application/json;charset=UTF-8";
      let { url, data } = params;
      let header;
      if (url === '/auth/appLogin' || url === '/auth/code') {
          header = {
              'content-type': contentType,
          }
      } else {
          // let token = userStore.UserInfo.token;
          header = {
              'content-type': contentType,
              // 'token': token
          }
      }
      contentType = params.contentType || contentType;
      const option:any= {
          url: url,
          data: data,
          method: method,
          timeout: 50000,
          header

      };
      return Taro.request(option);
  }

  get(url, data = "", param) {
      let option = { url, data, param };
      return this.baseOptions(option);
  }

  post(url, data) {
      let params = { url, data };
      return this.baseOptions(params, "POST");
  }

  put(url, data = "") {
      let option = { url, data };
      return this.baseOptions(option, "PUT");
  }

  delete(url, data = "") {
      let option = { url, data };
      return this.baseOptions(option, "DELETE");
  }

}

export default new httpRequest()
/**
 * @description 网络请求结果
 */
export enum RequestResultEnum {
    DATA_SUCCESS = 0,
    SUCCESS = 200,
    SERVER_ERROR = 500,
    SERVER_FORBIDDEN = 403,
    SERVER_NOACCESS= 401,
    NOT_FOUND = 404,
    TIMEOUT = 60000
}

/**
 * @description 网络请求方式
 */
export enum RequestHttpEnum {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // text
    TEXT = 'text/plain;charset=UTF-8',
    // xml
    XML = 'application/xml;charset=UTF-8',
    // application/x-www-form-urlencoded 一般配合qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  上传
    FORM_DATA = 'multipart/form-data;charset=UTF-8'
  }
  
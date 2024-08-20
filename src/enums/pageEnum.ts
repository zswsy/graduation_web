import { RequestResultEnum } from '@/enums/httpEnum'

export enum ChartEnum {
  // 图表创建
  CHART_HOME = '/project/chart/home/:id(.*)*',
  CHART_HOME_NAME = 'ChartHome',
}

export enum PreviewEnum {
  //  图表预览
  CHART_PREVIEW = '/project/chart/preview/:id(.*)*',
  CHART_PREVIEW_NAME = 'ChartPreview',
}

export enum PublishEnum {
  //  图表发布
  CHART_PUBLISH = '/project/chart/publish/:id(.*)*',
  CHART_PUBLISH_NAME = 'ChartPublish',
}


export enum EditEnum {
  //  图表JSON编辑
  CHART_EDIT = '/project/chart/edit/:id(.*)*',
  CHART_EDIT_NAME = 'ChartEdit',
}

export enum PageEnum {
  NAV_PATH = '/project',
  // 登录
  BASE_LOGIN = '/login',
  BASE_LOGIN_NAME = 'Login',

  //重定向
  REDIRECT = '/redirect',
  REDIRECT_NAME = 'Redirect',
  RELOAD = '/reload',
  RELOAD_NAME = 'Reload',
  // 工作台首页
  BASE_HOME = '/project',
  BASE_HOME_NAME = 'Project',

  // 个人空间
  BASE_HOME_ITEMS = '/project/items',
  BASE_HOME_ITEMS_NAME = 'Project-Items',

  // 最近文件
  BASE_HOME_NEW_ITEMS = '/project/newitems',
  BASE_HOME_NEW_ITEMS_NAME = 'Project-New-Items',

  // 我的模板
  BASE_HOME_TEMPLATE = '/project/my-template',
  BASE_HOME_TEMPLATE_NAME = 'Project-My-Template',

  // 我的收藏
  BASE_HOME_COLLECT = '/project/my-collect',
  BASE_HOME_COLLECT_NAME = 'Project-My-Collect',

  // 行业模板
  BASE_HOME_TEMPLATE_MARKET = '/project/template-market',
  BASE_HOME_TEMPLATE_MARKET_NAME = 'Project-Template-Market',

  // 错误
  ERROR_PAGE_NAME_403 = 'ErrorPage403',
  ERROR_PAGE_NAME_404 = 'ErrorPage404',
  ERROR_PAGE_NAME_500 = 'ErrorPage500'
}

export enum DataBaseEnum {
  // 数据源首页
  DATA_BASE = '/dataBase',
  DATA_BASE_NAME = 'Database',
  NAV_PATH = '/dataBase',

  // 数据源列表
  DATA_BASE_INDEX = '/dataBase/index',
  DATA_BASE_INDEX_NAME = 'DataBaseIndex',

  // 创建数据源
  CREATE_DATA_BASE = '/dataBase/create',
  CREATE_DATA_BASE_NAME = 'CreateData',
}

export enum DataSetEnum {
  // 数据集首页
  DATA_SET = '/dataSet/index',
  DATA_SET_NAME = 'DataSET',
  NAV_PATH = '/dataSet',

  // 数据集首页
  DATA_SET_INDEX = '/dataSet/index',
  DATA_SET_INDEX_NAME = 'DataSetIndex',

  // 创建数据源
  CREATE_DATA_SET = '/dataSet/create',
  CREATE_DATA_SET_NAME = 'DatasetCreate',
}

export enum SystemEnum {
  // 系统管理页面
  SYSTEM = '/system',
  SYSTEM_NAME = 'System',
  NAV_PATH = '/system',
}

export const ErrorPageNameMap = new Map([
  [RequestResultEnum.NOT_FOUND, PageEnum.ERROR_PAGE_NAME_404],
  [RequestResultEnum.SERVER_FORBIDDEN, PageEnum.ERROR_PAGE_NAME_403],
  [RequestResultEnum.SERVER_ERROR, PageEnum.ERROR_PAGE_NAME_500]
])

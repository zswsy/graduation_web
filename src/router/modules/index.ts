import { basicDataRouter } from './baseData'
import { materialManagerRouter } from './materialManager'
import { dataReportRouter } from './dataReport'
import { systemRouter } from './system'

export const pagesRouter = [
    ...basicDataRouter,
    ...materialManagerRouter,
    ...dataReportRouter,
    ...systemRouter,
]
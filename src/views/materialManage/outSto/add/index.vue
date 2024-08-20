<template>
    <div>
        <ZMTable
            :tableColumns="columns"
            :tableData="tableData"
            :buttonList="btns"
            @optionChange="optionChange"
            @updataTableData="updateInput"
            @selectionChange="selectionChange"
        ></ZMTable>
    </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { ZMTable} from '@/views/materialManage/components/ZMTable/index'
import { defineComponent, ref, reactive,onMounted } from 'vue'
import { genOrderNum } from '@/api/materialManager/init'
import { addInSto, locationRestNum } from '@/api/materialManager/inSto'
import { addOutSto, getOutMaterialList,
         materialGetAllLocation, matLocGetStockNum } from '@/api/materialManager/outSto'
import { getAll as materialAll } from '@/api/basicData/material'
import { getAll as projectAll } from '@/api/basicData/project'
import { getAll as getSupplierAll } from '@/api/basicData/supplier'
import { getAll as storeAll } from '@/api/basicData/store'
import { getByStoreId } from '@/api/basicData/area'
import { getByAreaId } from '@/api/basicData/location'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

defineComponent({
    ZMTable
})

//基础数据
let materialData = ref<any>([])
let projectData = ref<any>([])
let supplierData = ref<any>([])
let storeData = ref<any>([])
let areaData = ref<any>([])
let locationData = ref<any>([])

// --------------------------------表格---------------------

// #region
// 表头
const columns = reactive([
    {
        type: 'selection',
        key:'selection',
        multiple: true,
    },
    {
        type: 'index',
        key: 'index',
    },
    {
        title:'物料编码',
        key:'materialCode',
        type:'text',
    },
    {
        title:'物料名称',
        key:'material_id',
        type:'select',
        optionKey:'materialList',
        placeholder:'请选择物料名称',
    },
    {
        title:'数量',
        key:'stockNum',
        path: 'stockNum',
        type:'input-num',
        max:10,
        placeholder:'请输入数量',
    },
    // {
    //     title:'工程',
    //     key:'project_id',
    //     type:'select',
    //     optionKey:'projectList',
    //     placeholder:'请选择工程',
    // },
    // {
    //     title:'供应商',
    //     key:'supplier_id',
    //     type:'select',
    //     optionKey:'supplierList',
    //     placeholder:'请选择供应商',
    // },
    {
        title:'仓库',
        key:'storeName',
        type:'text',
        optionKey:'storeList',
        placeholder:'请选择仓库',
    },
    {
        title:'库区',
        key:'areaName',
        type:'text',
        optionKey:'areaList',
        placeholder:'请选择库区',
    },
    {
        title:'库位',
        key:'location_id',
        type:'select',
        optionKey:'locationList',
        placeholder:'请选择库位',
    },
    {
        title:'备注',
        key:'remark',
        path: 'remark',
        type:'input',
        placeholder:'备注',
    },
    
])
// 表格数据
let rowIndex = ref(0)
let delArr = ref<any>([])
const tableData = reactive<any>([
    {
        index: rowIndex.value,
        materialCode:null,
        materialId:null,
        stockNum:0,
        projectName:null,
        projectId:null,
        supplierName:null,
        supplierId:null,
        storeId:null,
        areaId:null,
        locationId:null,
        remark:null,
        materialList: materialData,
        projectList: projectData,
        supplierList: supplierData,
        storeList: storeData,
        areaList: [],
        locationList: [],
        disabled:true
    }
])

let tempObj = {
        index: '',
        materialCode:null,
        materialId:null,
        stockNum:0,
        projectName:null,
        projectId:null,
        supplierName:null,
        supplierId:null,
        storeId:null,
        areaId:null,
        locationId:null,
        remark:null,
        materialList: materialData,
        projectList: projectData,
        supplierList: supplierData,
        storeList: storeData,
        areaList: [],
        locationList: [],
        disabled:true
    }
// 表格按钮
const btns = reactive<any>([
    {
        type:'primary',
        name:'提交',
        click:()=>{
            submit(1)
        }
    },
    {
        type:'error',
        name:'取消',
        click:()=>{
            cancle()
        }
    },
    {
        type:'info',
        name:'增加行',
        click:()=>{
            addRow()
        }
    },
    {
        type:'warning',
        name:'删除行',
        click:()=>{
            delRow()
        }
    },
])

// 取消
const cancle = ()=>{
    router.go(-1)
}

// 提交
const submit = async (status:number) => {
    let bool = false
    let verfyArr = tableData.map((item:any)=>{
        return {
            locationName:item.locationName,
            location: item.locationId,
            max: item.max,
            stockNum: item.stockNum,
            storeId: item.storeId,
            areaId: item.areaId,
            materialId: item.materialId,
        }
    })
    try {
        verfyArr.forEach((item:any)=>{
            let temp=verfyArr.filter((val:any)=>{
                return item.location===val.location
            })
            if(temp.length>1){
                let num = temp.reduce((pre:any,cur:any)=>{
                    pre += cur.stockNum
                    return pre
                },0)
                if(num>temp[0].max){
                    console.log(num,'num');
                    bool = true
                    throw new Error('库位'+temp[0].locationName+'出库数量超过最大在库数量')
                }
                
            }
            console.log(item);
            
            console.log(Boolean(!item.stockNum) ,Boolean(!item.location) ,Boolean(!item.storeId), Boolean(!item.areaId) , Boolean(!item.materialId) , Boolean(!item.projectId) , Boolean(!item.supplierId))
            console.log(item.stockNum ,item.location ,item.storeId ,item.areaId ,item.materialId ,item.projectId ,item.supplierId)
            if(!item.stockNum || !item.location || !item.storeId || !item.areaId || !item.materialId ) throw new Error('请将订单信息填写完整')
        })
    } catch (error:any) {
        console.log(tableData)
        bool = true
        message.error(error.message)
        return
    }
    if(bool) return
    const { orderNum, orderId } = await getOrderNo()
    let params = {
        orderNum,
        orderId,
        status:status,
        tableData: JSON.parse(JSON.stringify(tableData)),  
    }
    const result = await addOutSto(params)
    if(result.status == 1) {
        message.success('提交成功')
        tableData.length = 0
        router.go(-1)
    }else{
        message.error('提交失败')
    }
    console.log(tableData,'tabledata');
}
// 增加行
const addRow = () => {
    tempObj.index = tableData.length+1
    tableData.push({...tempObj})
    
}
// 删除行
const delRow = () => {
    delArr.value.forEach((item:any)=>{
        let index = tableData.findIndex((item1:any)=>item1.index===item)
        tableData.splice(index,1)
    })
    console.log(tableData,'tabledata');
}

// 选择框改变
const optionChange = async (value:any,option:any,index:number) => {
    console.log(value,option,index);
    let val=value
    // console.log(typeof option);
    let obj = {...option}
    delete obj.label
    delete obj.value
    for (const k in obj) {
        tableData[index][k] = option[k]
    }
    // if(obj.storeId){
    //     tableData[index].areaId = ''
    //     tableData[index].areaList = []
    //     tableData[index].areaId = null
    //     tableData[index].locationId = ''
    //     tableData[index].locationList = []
    //     tableData[index].locationId = null

    //     await storeGetArea(obj.storeId,index)
    // }
    // if(obj.areaId){
    //     tableData[index].locationId = ''
    //     tableData[index].locationList = []
    //     await areaGetLocation(tableData[index].storeId,obj.areaId,index)
    // }
    // if(obj.locationId){
    //     await locationGetNum(tableData[index].storeId,tableData[index].areaId,obj.locationId,index)
    // }
    if(obj.locationId){
        await materialLocationGetStockNum(obj.storeId,obj.areaId,obj.locationId,tableData[index].materialId,index)
    }
    if(obj.materialId){
        message.info('请先选择入库库位，再添加数量')
        tableData[index].disabled = true
        tableData[index].max = 0
        tableData[index].storeId = '',
        tableData[index].storeName = '',
        tableData[index].areaId = '',
        tableData[index].areaName = '',
        tableData[index].locationId = '',
        tableData[index].locationName = '',
        tableData[index].locationList = [],
        await materialGetLocationList(obj.materialId,index)
    }
}

// 输入框改变
const updateInput = ({value,key,index}:{value:any,key:any,index:number}) => {
    console.log(value,key,index);
    tableData[index][key] = value
}

// 勾选改变
const selectionChange = (selection:any) => {
    delArr.value = selection.map((item:any)=>item)
    // console.log(selection,rows)
}





// #endregion

// 获取所有物料
const getAllMaterial = async () => {
    const result = await getOutMaterialList()
    console.log(result);
    // return
    materialData.value = result.data.map( (item:any)=> {
        return {
            label:item.material_name,
            value:item.material_id,
            materialCode:item.material_code,
            materialId:item.material_id
        }
    })
}
// 获取所有物料
const getAllProject = async () => {
    const result = await projectAll()
    projectData.value = result.data.map( (item:any)=> {
        return {
            label:item.project_name,
            value:item.project_id,
            projectCode:item.project_code,
            projectId:item.project_id
        }
    })
}
// 获取所有供应商
const getAllSupplier = async () => {
    const result = await getSupplierAll()
    supplierData.value = result.data.map( (item:any)=> {
        return {
            label:item.supplier_name,
            value:item.supplier_id,
            supplierCode:item.supplier_code,
            supplierId:item.supplier_id
        }
    })
}
// 获取所有仓库
const getAllStore = async () => {
    const result = await storeAll()
    storeData.value = result.data.map( (item:any)=> {
        return {
            label:item.store_name,
            value:item.store_id,
            storeCode:item.store_code,
            storeId:item.store_id

        }
    })
}
// 仓库获取库区
const storeGetArea = async (id:number,index:number) => {
    const result = await getByStoreId({storeId:id})
    let tempArr = result?.data?.map( (item:any)=> {
        return {
            label:item.area_name,
            value:item.area_id,
            areaCode:item.area_code,
            areaName:item.area_name,
            areaId:item.area_id
        }
    })
    tableData[index].areaList = tempArr

}
// 库区获取库位
const areaGetLocation = async (storeId:number,areaId:number,index:number) => {
    const result = await getByAreaId({storeId:storeId,areaId:areaId})
    let tempArr:any[] = []
    for await (const item of result.data) {
        const r1 = await locationRestNum({storeId:storeId,areaId:areaId,locationId:item.location_id})
        if(r1.data.restNum > 0){
            tempArr.push(
                {
                    label:item.location_name,
                    value:item.location_id,
                    locationCode:item.location_code,
                    locationName:item.location_name,
                    locationId:item.location_id,
                    disabled:false
                }
            )
        }else{
            tempArr.push(
                {
                    label:item.location_name,
                    value:item.location_id,
                    locationCode:item.location_code,
                    locationName:item.location_name,
                    locationId:item.location_id,
                    disabled:true
                }
            )
        }
    }
    console.log(tempArr);
    
    tableData[index].locationList = tempArr

}
// 仓库库区库位获取库位剩余可入库数量
const locationGetNum = async (storeId:number,areaId:number,locationId:number,index?:number) => {
    const result = await locationRestNum({storeId:storeId,areaId:areaId,locationId:locationId})
    if(result?.status == 1) {
        if(result?.data?.restNum <= 0){
            message.error('该库位已满,请选择其他库位')
            tableData[index as number].disabled = true
        }else{
            message.success('库位剩余容量为'+result?.data?.restNum)
            tableData[index as number].max = result?.data?.restNum
            tableData[index as number].disabled = false
        }
        
    }else{
        message.error(result?.message)
        return
    }
}
// 物料获取所有库位列表
const materialGetLocationList = async (materialId:number,index?:number) => {
    let params = {
        materialId
    }
    let tempArr:any = []
    const result = await materialGetAllLocation(params)
    if(result?.status == 1) {
        result?.data.forEach((item:any) => {
            tempArr.push({
                label:item.location_name,
                value:item.location_id,
                storeId:item.store_id,
                storeName:item.store_name,
                areaId:item.area_id,
                areaName:item.area_name,
                locationId:item.location_id,
                locationName:item.location_name,
                // materialId:item.material_id,
            })
        })
        console.log(tempArr);
        tableData[index as number].locationList = tempArr
    }
}
// 物料库位获取库位库存数量
const materialLocationGetStockNum = async (storeId:number,areaId:number,locationId:number,materialId:number,index?:number) => {
    const result = await matLocGetStockNum({storeId,areaId,locationId,materialId})
    if(result?.status == 1) {
        message.info(`该库位最大出库容量为：${result?.data?.stock_num}`)
        tableData[index as number].max = result?.data?.stock_num
        tableData[index as number].disabled = false
    }else{
        message.error(result?.message)
    }
    
}
// 获取初始化订单号
interface orderResult {
    orderId?:number,
    orderNum?:string
}
const getOrderNo = async ():Promise<orderResult> => {
    const result = await genOrderNum('CGCK')
    if(result?.status == 1) {
        return {
            orderId:result?.data.orderId,
            orderNum:result?.data.orderNum
        }
    }else{
        message.error('获取订单号失败')
        return {}
    }
}

onMounted(() => {
    getAllMaterial()
    // getAllProject()
    // getAllSupplier()
    // getAllStore()
})

</script>
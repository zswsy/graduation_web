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
import { addInit, genOrderNum } from '@/api/materialManager/init'
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
    {
        title:'工程',
        key:'project_id',
        type:'select',
        optionKey:'projectList',
        placeholder:'请选择工程',
    },
    {
        title:'供应商',
        key:'supplier_id',
        type:'select',
        optionKey:'supplierList',
        placeholder:'请选择供应商',
    },
    {
        title:'仓库',
        key:'store_id',
        type:'select',
        optionKey:'storeList',
        placeholder:'请选择仓库',
    },
    {
        title:'库区',
        key:'areaId',
        type:'select',
        optionKey:'areaList',
        placeholder:'请选择库区',
    },
    {
        title:'库位',
        key:'locationId',
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
        stockNum:null,
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
    }
])

let tempObj = {
        index: '',
        materialCode:null,
        materialId:null,
        stockNum:null,
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
    }
// 表格按钮
const btns = reactive<any>([
    {
        type:'primary',
        name:'提交',
        click:()=>{
            submit()
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
const submit = async () => {
    const { orderNum, orderId } = await getOrderNo()
    let params = {
        orderNum,
        orderId,
        tableData: JSON.parse(JSON.stringify(tableData)),  
    }
    const result = await addInit(params)
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
    // console.log(value,option,index);
    let val=value
    // console.log(typeof option);
    let obj = {...option}
    delete obj.label
    delete obj.value
    for (const k in obj) {
        tableData[index][k] = option[k]
    }
    if(obj.storeId){
        tableData[index].areaId = ''
        tableData[index].areaList = []
        tableData[index].areaId = null
        tableData[index].locationId = ''
        tableData[index].locationList = []
        tableData[index].locationId = null

        await storeGetArea(obj.storeId,index)
    }
    if(obj.areaId){
        tableData[index].locationId = ''
        tableData[index].locationList = []
        await areaGetLocation(tableData[index].storeId,obj.areaId,index)
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
    const result = await materialAll()
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
    let tempArr = result?.data?.map( (item:any)=> {
        return {
            label:item.location_name,
            value:item.location_id,
            locationCode:item.location_code,
            locationName:item.location_name,
            locationId:item.location_id
        }
    })
    tableData[index].locationList = tempArr

}
// 获取初始化订单号
interface orderResult {
    orderId?:number,
    orderNum?:string
}
const getOrderNo = async ():Promise<orderResult> => {
    const result = await genOrderNum('CSH')
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
    getAllProject()
    getAllSupplier()
    getAllStore()
})

</script>
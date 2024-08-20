<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="location_id"
            :tableColumns="tableColumns"
            :tableData="tableData"
            :pagination="pagination"
            :checkedKeys="checkedKeys"
            :buttonList="buttonList"
            @checkInfo="checkInfo"
            @changeSwitch="changeMatStatus"
            @PageSizeChange="PageSizeChange"
            @PageIndexChange="PageIndexChange"
            @deleteRow="deleteRow"
            @selectionChange="selectionChange"
        ></ZTable>
        <ZDialog
            title="修改库位"
            :dialogVisible.sync="dialogVisible"
            :columns="dialogColumns"
            :modalData.sync="modalValue"
            @updateDialogVisible="updateDialogVisible"
            @updateModalData="updateModalData"
            @confirmButton="confirmButton"
        ></ZDialog>
        <ZDialog
            title="新增库位"
            :dialogVisible.sync="dialogVisibleAdd"
            :columns="dialogColumnsAdd"
            :modalData.sync="modalValueAdd"
            @updateDialogVisible="updateDialogVisibleAdd"
            @updateModalData="updateModalDataAdd"
            @confirmButton="confirmButtonAdd"
        ></ZDialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { getAll } from '@/api/basicData/store'
import { getByStoreId } from '@/api/basicData/area'
import { getByParams, updateStatus, deleteMaterial, 
         updateMaterial, addMaterial  } from '@/api/basicData/location'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// 常量数据
const allStoreData = ref<any>([
    {
        label:'全部',
        value:0,
        disabled:true
    }
])
const allAreaData = ref<any>([
    {
        label:'全部',
        value:0,
        disabled:true
    }
])


// --------------------------搜索栏------------------------------------

// #region
// 搜索栏配置
const formData = reactive([
    {
        label: '库位编码/名称',
        prop: 'keyword',
        value: '',
        type: 'input',
        placeholder:'请输入库位编码/名称',
    },
    {
        label: '所属仓库',
        prop: 'storeId',
        type: 'select',
        placeholder:'请选择',
        isLong: true,
        options:allStoreData,
        filterable:true,
    },
    {
        label: '所属库位',
        prop: 'areaId',
        type: 'select',
        placeholder:'请选择',
        isLong: true,
        options:allAreaData,
        filterable:true,
    },
    {
        label: '状态',
        prop: 'status',
        type: 'select',
        value:'',
        placeholder:'请选择',
        options: [
            {
                label: '全部',
                value:''
            },
            {
                label: '启用',
                value:1
            },
            {
                label: '禁用',
                value:0
            }
        ]
    },

])
const pagination = reactive<any>({
    pageIndex: 1,
    pageSize: 10,
    total: 25,
})

let searParam = reactive<any>({
    keyword:'',
    status: '',
    storeId: '',
    areaId: '',
})
// 搜索
const searchParams = () => {
    pagination.pageIndex = 1
    getTableData()
}
// 重置
const resetParams = () => {
    searParam.keyword = ''
    searParam.status = ''
    searParam.storeId = ''
    searParam.areaId = ''
    pagination.pageIndex = 1
    getTableData()
}

// #endregion

// --------------------------修改对话框------------------------------------

// #region
//对话框配置
const dialogVisible = ref(false)
let modalValue = ref<any>({})
const dialogColumns = reactive([
    {
        label:'库位编码',
        path:'location_code',
        type:'input',
        disabled:false,
        placeholder:'请输入库位编码',
        rule:{
            location_code:{
                required:true,message:'请输入库位编码',trigger:'blur'
            }
        }
    },
    {
        label:'库位名称',
        path:'location_name',
        type:'input',
        rule:{
            location_name:{
                required:true,message:'请输入库位名称',trigger:'blur'
            }
        },
        placeholder:'请输入库位名称'
    },
    {
        label:'所属仓库',
        path:'store_id',
        type:'select',
        rule:{
            unit:{
                required:false,message:'请选择',trigger:'blur'
            }
        },
        placeholder:'请选择',
        options:allStoreData,
        filterable:true,
    },
    {
        label:'所属库区',
        path:'area_id',
        type:'select',
        rule:{
            unit:{
                required:false,message:'请选择',trigger:'blur'
            }
        },
        placeholder:'请选择',
        options:allAreaData,
        filterable:true,
    },
    {
        label:'最大库存容量',
        path:'max_stock_num',
        type:'number',
        rule:{
            location_name:{
                required:true,message:'请输入最大库存容量',trigger:'blur'
            }
        },
        placeholder:'请输入最大库存容量'
    },
    {
        label:'状态',
        path:'status',
        type:'switch',
    },
    {
        label:'备注',
        path:'remark',
        type:'input',
        placeholder:'请输入库位单位'
    },
])
// 修改对话框
const updateDialogVisible = (val:boolean) => {
    modalValue = ref<any>({})
    dialogVisible.value = val
    
}
// 修改库位
const confirmButton = async () => {
    let params={
        id:modalValue.value.location_id,
        locationName:modalValue.value.location_name,
        locationCode:modalValue.value.location_code,
        storeId:modalValue.value.store_id,
        areaId:modalValue.value.area_id,
        maxStockNum:modalValue.value.max_stock_num,
        status:modalValue.value.status,
        remark:modalValue.value.remark,
    }
    const result = await updateMaterial(params)
    if(result.status == 1) {
        message.success(result.message)
        updateDialogVisible(false)
        getTableData()
    }else{
        message.error(result.message)
    }
    
}
// 修改对话框数据
const updateModalData = ({value, key}:{value:any,key:any}) => {
    if(key === 'status'){
        modalValue.value[key] = value == true ? 1 : 0 
    }
    else{
        modalValue.value[key] = value
        if(key === 'store_id') {
            modalValue.value.area_id = ''
            getAreaData(value)
        }
    }
}

// #endregion

// --------------------------新增对话框------------------------------------

// #region
//对话框配置
const dialogVisibleAdd = ref(false)
let modalValueAdd = ref<any>({})
const dialogColumnsAdd = reactive([
    {
        label:'库位编码',
        path:'location_code',
        type:'input',
        rule:{
            location_name:{
                required:true,message:'请输入库位名称',trigger:'blur'
            }
        },
        placeholder:'例:L01-01-01:L01-01-01'
    },
    {
        label:'库位名称',
        path:'location_name',
        type:'input',
        rule:{
            location_name:{
                required:true,message:'请输入库位名称',trigger:'blur'
            }
        },
        placeholder:'请输入库位名称例：L01-01-01'
    },
    {
        label:'所属仓库',
        path:'store_id',
        type:'select',
        rule:{
            unit:{
                required:false,message:'请选择',trigger:'blur'
            }
        },
        placeholder:'请选择',
        options:allStoreData,
        filterable:true,
    },
    {
        label:'所属库区',
        path:'area_id',
        type:'select',
        rule:{
            unit:{
                required:false,message:'请选择',trigger:'blur'
            }
        },
        placeholder:'请选择',
        options:allAreaData,
        filterable:true,
    },
    {
        label:'最大库存数量',
        path:'max_stock_num',
        type:'number',
        rule:{
            location_name:{
                required:true,message:'请输入最大库存数量',trigger:'blur'
            }
        },
        placeholder:'请输入最大库存数量'
    },
    {
        label:'状态',
        path:'status',
        type:'switch',
    },
    {
        label:'备注',
        path:'remark',
        type:'input',
        placeholder:'请输入库位单位'
    },
])
// 修改对话框行内容
const updateDialogVisibleAdd = (val:boolean) => {
    modalValueAdd = ref<any>({})
    dialogVisibleAdd.value = val
    
}
// 库位新增
const confirmButtonAdd = async () => {
    let params={
        locationCode:modalValueAdd.value.location_code,
        locationName:modalValueAdd.value.location_name,
        storeId:modalValueAdd.value.store_id,
        areaId:modalValueAdd.value.area_id,
        maxStockNum:modalValueAdd.value.max_stock_num,
        status:modalValueAdd.value.status || 0,
        remark:modalValueAdd.value.remark,
    }
    const result = await addMaterial({tableData:[params]})
    if(result.status == 1) {
        message.success(result.message)
        updateDialogVisibleAdd(false)
        getTableData()
    }else{
        message.error(result.message)
    }
    
}
// 修改对话框数据
const updateModalDataAdd = ({value, key}:{value:any,key:any}) => {
    if(key === 'status'){
        modalValueAdd.value[key] = value == true ? 1 : 0 
    }
    else{
        modalValueAdd.value[key] = value
        if(key === 'store_id') {
            modalValueAdd.value.area_id = ''
            getAreaData(value)
        }
    }
}

// #endregion


// --------------------------表格------------------------------------

// #region
// 表格配置
let checkedKeys = ref<any>([])
    const tableData = ref<any>([])
//表头
const tableColumns = reactive([
    {
        type: 'selection',
        key:'selection',
        multiple: false,
    },
    {
        type: 'index',
        key: 'index',
    },
    {
        title: '库位编码',
        key: 'location_code',
        type: 'text',
    },
    {
        title: '库位名称',
        key: 'location_name',
        type: 'text',
    },
    {
        title: '所属仓库',
        key: 'store_name',
        type: 'text',
    },
    {
        title: '所属库区',
        key: 'area_name',
        type: 'text',
    },
    {
        title: '库存容量',
        key: 'max_stock_num',
        type: 'text',
        width: 100,
    },
    {
        title: '状态',
        key: 'status',
        type: 'switch',
    },
    {
        title: '创建时间',
        key: 'create_time',
        type: 'time',
    },
    {
        title: '备注',
        key: 'remark',
        type: 'text',
    },
    {
        title: '操作',
        key: 'operate',
        type: 'operate',
    },

])

// 按钮列表
let buttonList = reactive<any>([
    {
        type: 'primary',
        name: '新增',
        click: () => {
            addBtn()
        }
    },
    {
        type: 'error',
        name: '删除',
        click: () => {
            deleteBtn()
        }
    }
])

// 加载表格数据
const getTableData = async () => {
    let params = {
        keyword: searParam.keyword,
        status: searParam.status,
        storeId: searParam.storeId,
        areaId: searParam.areaId,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    }
    const result = await getByParams(params)
    if(result.status == 1) {
        tableData.value = result?.data
        pagination.total = result?.total
        message.success(result.message)
    }else{
        message.error(result.message)
    }
    
}

// 查看详情
const checkInfo = (row:any) => {
    dialogVisible.value = true
    
    getAreaData(row.store_id)
    modalValue = ref({...row})
}

// 改变pageSize/pageIndex
const PageSizeChange = (size:number) => {
    pagination.pageSize = size
    getTableData()
}
const PageIndexChange = (index:number) => {
    pagination.pageIndex = index
    getTableData()
}

// 修改库位状态
const changeMatStatus = async (value:boolean, id:number) => {
    console.log(value,id,'value,id');
    const result = await updateStatus({id,status:value ? 1 : 0})
    if(result.status == 1) {
        message.success(result.message)
        getTableData()
    }else{
        message.error(result.message)
    }
}

//删除库位
const deleteRow = async (row:any) => {
    let id = row.location_id
    const result = await deleteMaterial({id: id})
    if(result.status == 1) {
        message.success(result.message)
        getTableData()
    }else{
        message.error(result.message)
    }
}

//选择框选中
const selectionChange = (keys:any) => {
    checkedKeys = ref<any>([])
    keys.forEach((key:any) => {
        console.log(key,'key');
        checkedKeys.value.push(key)
    })
}

//table删除按钮-库位多选删除
const deleteBtn = async () => {
    let logArr:number[] = []
    if(checkedKeys.value.length != 0) {
        checkedKeys.value.forEach( async(id:number) => {
            const result = await deleteMaterial({id: id})
            logArr.push(result.status as number)
        })
        if(logArr.includes(0)){
            message.error('存在部分或者全部数据删除失败')
        }else{
            message.success('删除成功')
            getTableData()
        }
    }else{
        message.error('请选择要删除的数据')
    } 
}

//table 新增按钮
const addBtn = () => {
    dialogVisibleAdd.value = true
}

// #endregion

// 加载仓库数据
const getStoreData = async () => {
    const result = await getAll()
    if(result.status == 1) {
        result.data.forEach((item:any) => {
            allStoreData.value.push({
                label:item.store_name,
                value:item.store_id
            })
        })
        message.success(result.message);
    }else{
        message.error(result.message);
    }
    
}
// 加载库位数据
const getAreaData = async (id:number) => {
    const result = await getByStoreId({storeId:id})
    if(result.status == 1) {
        allAreaData.value = [{
            label:'全部',
            value:0,
            disabled:true
        }]
        result.data.forEach((item:any) => {
            allAreaData.value.push({
                label:item.area_name,
                value:item.area_id
            })
        })
        message.success(result.message);
    }else{
        message.error(result.message);
    }
    
}

onMounted( ()=> {
    getTableData()
    getStoreData()
    // getAreaData()
})

</script>
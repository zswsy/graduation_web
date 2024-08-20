<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="area_id"
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
            title="修改库区"
            :dialogVisible.sync="dialogVisible"
            :columns="dialogColumns"
            :modalData.sync="modalValue"
            @updateDialogVisible="updateDialogVisible"
            @updateModalData="updateModalData"
            @confirmButton="confirmButton"
        ></ZDialog>
        <ZDialog
            title="新增库区"
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
import { getByParams, updateStatus, deleteMaterial, 
         updateMaterial, addMaterial  } from '@/api/basicData/area'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// 常量数据
const allStoreData = ref<any>([
    {
        label:'全部',
        value:''
    }
])


// --------------------------搜索栏------------------------------------

// #region
// 搜索栏配置
const formData = reactive([
    {
        label: '库区编码/名称',
        prop: 'keyword',
        value: '',
        type: 'input',
        placeholder:'请输入库区编码/名称',
    },
    {
        label: '所属仓库',
        prop: 'storeId',
        type: 'select',
        placeholder:'请选择',
        isLong: true,
        options:allStoreData,
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
        label:'库区编码',
        path:'area_code',
        type:'input',
        disabled:false,
        placeholder:'请输入库区编码',
        rule:{
            area_code:{
                required:true,message:'请输入库区编码',trigger:'blur'
            }
        }
    },
    {
        label:'库区名称',
        path:'area_name',
        type:'input',
        rule:{
            area_name:{
                required:true,message:'请输入库区名称',trigger:'blur'
            }
        },
        placeholder:'请输入库区名称'
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
        label:'状态',
        path:'status',
        type:'switch',
    },
    {
        label:'备注',
        path:'remark',
        type:'input',
        placeholder:'请输入库区单位'
    },
])
// 修改对话框
const updateDialogVisible = (val:boolean) => {
    modalValue = ref<any>({})
    dialogVisible.value = val
    
}
// 确认按钮
const confirmButton = async () => {
    let params={
        id:modalValue.value.area_id,
        areaName:modalValue.value.area_name,
        areaCode:modalValue.value.area_code,
        storeId:modalValue.value.store_id,
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
        label:'库区编码',
        path:'area_code',
        type:'input',
        rule:{
            area_name:{
                required:true,message:'请输入库区名称',trigger:'blur'
            }
        },
        placeholder:'例:变压器区-AO1-A'
    },
    {
        label:'库区名称',
        path:'area_name',
        type:'input',
        rule:{
            area_name:{
                required:true,message:'请输入库区名称',trigger:'blur'
            }
        },
        placeholder:'请输入库区名称'
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
        options:allStoreData
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
        placeholder:'请输入库区单位'
    },
])
// 修改对话框行内容
const updateDialogVisibleAdd = (val:boolean) => {
    modalValueAdd = ref<any>({})
    dialogVisibleAdd.value = val
    
}
// 确认按钮
const confirmButtonAdd = async () => {
    let params={
        areaCode:modalValueAdd.value.area_code,
        areaName:modalValueAdd.value.area_name,
        storeId:modalValueAdd.value.store_id,
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
        title: '库区编码',
        key: 'area_code',
        type: 'text',
    },
    {
        title: '库区名称',
        key: 'area_name',
        type: 'text',
    },
    {
        title: '所属仓库',
        key: 'store_name',
        type: 'text',
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
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    }
    console.log(params,'params');
    
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

// 修改库区状态
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

//删除库区
const deleteRow = async (row:any) => {
    let id = row.area_id
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

//table删除按钮
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
        message.success(result.message)
    }else{
        message.error(result.message)
    }
}

onMounted( ()=> {
    getTableData()
    getStoreData()
})

</script>
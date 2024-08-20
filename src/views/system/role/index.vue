<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="role_id"
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
            title="修改角色"
            :dialogVisible.sync="dialogVisible"
            :columns="dialogColumns"
            :modalData.sync="modalValue"
            @updateDialogVisible="updateDialogVisible"
            @updateModalData="updateModalData"
            @confirmButton="confirmButton"
        ></ZDialog>
        <ZDialog
            title="新增角色"
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
import { updateStatus, deleteMaterial, updateMaterial, addMaterial } from '@/api/basicData/material'
import { allRolePage, addRole, updateRole, updateRoleStatus } from '@/api/system/role'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// --------------------------搜索栏------------------------------------

// #region
// 搜索栏配置
const formData = reactive([
    
])
const pagination = reactive<any>({
    pageIndex: 1,
    pageSize: 10,
    total: 25,
})

let searParam = reactive<any>({
    keyword:'',
    status: '',
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
        label:'角色编码',
        path:'role_code',
        type:'input',
        disabled:true,
        placeholder:'请输入角色编码',
        rule:{
            role_code:{
                required:true,message:'请输入角色编码',trigger:'blur'
            }
        }
    },
    {
        label:'角色名称',
        path:'role_name',
        type:'input',
        rule:{
            role_name:{
                required:true,message:'请输入角色名称',trigger:'blur'
            }
        },
        placeholder:'请输入角色名称'
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
        placeholder:'请输入角色单位'
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
        roleId:modalValue.value.role_id,
        roleName:modalValue.value.role_name,
        roleCode:modalValue.value.role_code,
        status:modalValue.value.status,
        remark:modalValue.value.remark,
    }
    const result = await updateRole(params)
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
        label:'角色编码',
        path:'role_code',
        type:'input',
        rule:{
            material_name:{
                required:true,message:'请输入角色编码',trigger:'blur'
            }
        },
        placeholder:'请输入角色编码'
    },
    {
        label:'角色名称',
        path:'role_name',
        type:'input',
        rule:{
            material_name:{
                required:true,message:'请输入角色名称',trigger:'blur'
            }
        },
        placeholder:'请输入角色名称'
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
        placeholder:'请输入角色单位'
    },
])
// 修改对话框
const updateDialogVisibleAdd = (val:boolean) => {
    modalValueAdd = ref<any>({})
    dialogVisibleAdd.value = val
    
}
// 确认按钮
const confirmButtonAdd = async () => {
    let params={
        roleName:modalValueAdd.value.role_name,
        roleCode:modalValueAdd.value.role_code,
        status:modalValueAdd.value.status || 0,
        remark:modalValueAdd.value.remark,
    }
    const result = await addRole(params)
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
        type: 'index',
        key: 'index',
    },
    {
        title: '角色编码',
        key: 'role_code',
        type: 'text',
    },
    {
        title: '角色名称',
        key: 'role_name',
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
    }
])

// 加载表格数据
const getTableData = async () => {
    let params = {
        keyword: searParam.keyword,
        status: searParam.status,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    }
    const result = await allRolePage(params)
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
    if(row.role_id == 1) return message.warning('超级管理员角色无法修改')
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

// 修改角色状态
const changeMatStatus = async (value:boolean, id:number) => {
    if(id == 1) return message.warning('超级管理员角色不可修改状态')
    const result = await updateRoleStatus({roleId:id,status:value ? 1 : 0})
    if(result.status == 1) {
        message.success(result.message)
        getTableData()
    }else{
        message.error(result.message)
    }
}

//删除角色
const deleteRow = async (row:any) => {
    return message.info('角色数据不可删除-可更改')
    let id = row.material_id
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

onMounted( ()=> {
    getTableData()
})

</script>
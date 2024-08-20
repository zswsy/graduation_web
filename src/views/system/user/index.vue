<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="user_id"
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
            title="修改用户"
            :dialogVisible.sync="dialogVisible"
            :columns="dialogColumns"
            :modalData.sync="modalValue"
            @updateDialogVisible="updateDialogVisible"
            @updateModalData="updateModalData"
            @confirmButton="confirmButton"
        ></ZDialog>
        <ZDialog
            title="新增用户"
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
import { deleteMaterial } from '@/api/basicData/material'
import { allUserPage, addUser, updateUser, updateUserStatus, delUser } from '@/api/system/user'
import { getAllRole } from '@/api/system/role'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// 常量
const roleData = ref([])

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
        label:'用户名',
        path:'username',
        type:'input',
        placeholder:'请输入用户名',
        rule:{
            role_code:{
                required:true,message:'请输入用户名',trigger:'blur'
            }
        }
    },
    {
        label:'密码',
        path:'password',
        type:'input',
        rule:{
            role_name:{
                required:true,message:'请输入密码',trigger:'blur'
            }
        },
        placeholder:'请输入密码'
    },
    {
        label:'电话',
        path:'mobile',
        type:'input',
        placeholder:'请输入电话'
    },
    {
        label:'性别',
        path:'sex',
        type:'select',
        placeholder:'请选择',
        options:[
            {label:'男',value:1},
            {label:'女',value:0},
            {label:'未知',value:2},
        ]
    },
    {
        label:'角色',
        path:'role',
        type:'select',
        placeholder:'请选择',
        options:roleData
    },
    {
        label:'权限',
        path:'permission',
        type:'select',
        placeholder:'请选择',
        multiple:true,
        options:[
            {label:' 所有',value:'all'},
            {label:'增加',value:'add'},
            {label:'删除',value:'delete'},
            {label:'修改',value:'edit'},
            {label:'查看',value:'check'},
        ]
    },
    {
        label:'状态',
        path:'status',
        type:'switch',
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
        userId:modalValue.value.user_id,
        userName:modalValue.value.username,
        password:modalValue.value.password,
        role:modalValue.value.role,
        mobile:modalValue.value.mobile,
        permission:modalValue.value.permission.join('-'),
        sex:modalValue.value.sex,
        status:modalValue.value.status,
        remark:modalValue.value.remark,
    }
    const result = await updateUser(params)
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
        label:'用户名',
        path:'username',
        type:'input',
        placeholder:'请输入用户名',
        rule:{
            role_code:{
                required:true,message:'请输入用户名',trigger:'blur'
            }
        }
    },
    {
        label:'密码',
        path:'password',
        type:'input',
        rule:{
            role_name:{
                required:true,message:'请输入密码',trigger:'blur'
            }
        },
        placeholder:'请输入密码'
    },
    {
        label:'电话',
        path:'mobile',
        type:'input',
        placeholder:'请输入电话'
    },
    {
        label:'性别',
        path:'sex',
        type:'select',
        placeholder:'请选择',
        options:[
            {label:'男',value:1},
            {label:'女',value:0},
            {label:'未知',value:2},
        ]
    },
    {
        label:'角色',
        path:'role',
        type:'select',
        placeholder:'请选择',
        options:roleData
    },
    {
        label:'权限',
        path:'permission',
        type:'select',
        placeholder:'请选择',
        multiple:true,
        options:[
            {label:' 所有',value:'all'},
            {label:'增加',value:'add'},
            {label:'删除',value:'delete'},
            {label:'修改',value:'edit'},
            {label:'查看',value:'check'},
        ]
    },
    {
        label:'状态',
        path:'status',
        type:'switch',
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
        userName:modalValueAdd.value.username,
        password:modalValueAdd.value.password,
        mobile:modalValueAdd.value.mobile,
        sex:modalValueAdd.value.sex,
        role:modalValueAdd.value.role,
        status:modalValueAdd.value.status || 0,
        permission:modalValueAdd.value.permission.join('-'),

    }
    
    // console.log(modalValueAdd.value.permission,'permission');
    // return
    const result = await addUser(params)
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
        title: '用户名',
        key: 'username',
        type: 'text',
    },
    {
        title: '角色',
        key: 'role_name',
        type: 'text',
    },
    {
        title: '权限',
        key: 'permission',
        type: 'tag',
        width: 300
    },
    {
        title: '性别',
        key: 'sexLabel',
        type: 'text',
    },
    {
        title: '电话',
        key: 'mobile',
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
    const result = await allUserPage(params)
    if(result.status == 1) {
        result.data.forEach((item:any) => {
            console.log(item.permission,'error');
            
            item.permission = item.permission.split('-')
            
        })
        tableData.value = result?.data
        pagination.total = result?.total
        message.success(result.message)
    }else{
        message.error(result.message)
    }
    
    
}

// 查看详情
const checkInfo = (row:any) => {
    if(row.user_id == 1) return message.warning('超级管理员用户用户无法修改')
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

// 修改用户状态
const changeMatStatus = async (value:boolean, id:number) => {
    if(id == 1) return message.warning('超级管理员用户不可修改状态')
    const result = await updateUserStatus({userId:id,status:value ? 1 : 0})
    if(result.status == 1) {
        message.success(result.message)
        getTableData()
    }else{
        message.error(result.message)
    }
}

//删除用户
const deleteRow = async (row:any) => {
    // return message.info('用户数据不可删除-可更改')
    let id = row.user_id
    const result = await delUser({id: id})
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
// const { useStoreSetup } = useStoreSetup()

//table 新增按钮
const addBtn = () => {
    const { userInfo } = JSON.parse(localStorage.getItem('my-pinia-user') as string)
    console.log(userInfo,'userInfo');
    if(userInfo.role !== 'admin'){
        message.warning('系统管理员才可以添加用户')
    }else{
        dialogVisibleAdd.value = true
    }
    
}

// #endregion

// 加载角色数据
const getRoleData = async () => {
    const result = await getAllRole()
    roleData.value = result.data.map((item:any) => {
        return {
            label:item.role_name,
            value:item.role_code
        }
    })
}

onMounted( ()=> {
    getTableData()
    getRoleData()
})

</script>
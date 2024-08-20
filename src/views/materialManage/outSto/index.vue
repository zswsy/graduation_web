<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="order_id"
            :tableColumns="tableColumns"
            :tableData="tableData"
            :pagination="pagination"
            :checkedKeys="checkedKeys"
            :buttonList="buttonList"
            @checkInfo="checkInfo"
            @PageSizeChange="PageSizeChange"
            @PageIndexChange="PageIndexChange"
            @selectionChange="selectionChange"
        ></ZTable>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllInit, delInitByIds
        } from '@/api/materialManager/init'
import { getAllOutSto, delOutStoByIds
        } from '@/api/materialManager/outSto'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// --------------------------搜索栏------------------------------------

// #region
// 搜索栏配置
const formData = reactive([
    {
        label: '订单编号',
        prop: 'orderNum',
        value: '',
        type: 'input',
        placeholder:'请输入订单编号',
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
                label: '完成',
                value:1
            },
            {
                label: '保存',
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
    orderNum:'',
    type:2,
    status: '',
})
// 搜索
const searchParams = () => {
    pagination.pageIndex = 1
    getTableData()
}
// 重置
const resetParams = () => {
    searParam.orderNum = ''
    searParam.status = ''
    pagination.pageIndex = 1
    getTableData()
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
        multiple: true,
        disabled: true,
    },
    {
        type: 'index',
        key: 'index',
    },
    {
        title: '订单编号',
        key: 'order_num',
        type: 'text',
        width: 180,
    },
    {
        title: '物料编码',
        key: 'material_code',
        type: 'text',
    },
    {
        title: '物料名称',
        key: 'material_name',
        type: 'text',
    },
    {
        title: '仓库',
        key: 'store_name',
        type: 'text',
    },
    {
        title: '库区',
        key: 'area_name',
        type: 'text',
    },
    {
        title: '库位',
        key: 'location_name',
        type: 'text',
    },
    {
        title: '数量',
        key: 'stock_num',
        type: 'text',
        change:true
    },
    {
        title: '状态',
        key: 'status',
        type: 'text',
        width: 80,
    },
    {
        title: '创建时间',
        key: 'create_time',
        type: 'time',
        width: 180,
    },
    {
        title: '备注',
        key: 'remark',
        type: 'text',
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
        orderNum: searParam.orderNum,
        status: searParam.status,
        type: searParam.type, 
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    }
    const result = await getAllOutSto(params)
    if(result.status == 1) {
        tableData.value = result?.data
        pagination.total = result?.total
        message.success(result.message)
    }else{
        message.error(result.message)
    }
    
    
}

// 查看详情
const checkInfo = (keys:any) => {
    console.log(keys,'initkeys');
    
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

//选择框选中
const selectionChange = (keys:any) => {
    checkedKeys = ref<any>([])
    keys.forEach((key:any) => {
        checkedKeys.value.push(key)
    })
}

//table删除按钮
const deleteBtn = async () => {
    
    if(checkedKeys.value.length != 0) {
        const result = await delOutStoByIds({ids: checkedKeys.value})
        if(result.status == 1) {
            message.success('删除成功')
            checkedKeys = ref<any>([])
            getTableData()
        }else{
            message.error('删除数据失败')
        }
    }else{
        message.info('请选择要删除的数据')
    } 
}

//table 新增按钮
const addBtn = () => {
    router.push({path: '/material/outSto/add'})
}


// #endregion

onMounted( ()=> {
    getTableData()
})

</script>
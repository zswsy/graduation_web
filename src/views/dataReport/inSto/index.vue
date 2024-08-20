<template>
    <div>
        <ZForm
            :inputOptions="formData"
            :modalData="searParam"
            @search="searchParams"
            @reset="resetParams"
        ></ZForm>
        <ZTable
            rowKeyName="detail_id"
            :tableColumns="tableColumns"
            :tableData="tableData"
            :pagination="pagination"
            :checkedKeys="checkedKeys"
            @checkInfo="checkInfo"
            @changeSwitch="changeMatStatus"
            @PageSizeChange="PageSizeChange"
            @PageIndexChange="PageIndexChange"
            @selectionChange="selectionChange"
        ></ZTable>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { updateStatus } from '@/api/basicData/material'
import { inStoReport } from '@/api/dataReport'
import { useRouter } from 'vue-router'
const router = useRouter()
const message = window['$message']

// --------------------------搜索栏------------------------------------

// #region
// 搜索栏配置
const formData = reactive([
    // {
    //     label: '物料编码/名称',
    //     prop: 'keyword',
    //     value: '',
    //     type: 'input',
    //     placeholder:'请输入物料编码/名称',
    // },

])
const pagination = reactive<any>({
    pageIndex: 1,
    pageSize: 10,
    total: 25,
})

let searParam = reactive<any>({
    keyword:'',
})
// 搜索
const searchParams = () => {
    pagination.pageIndex = 1
    getTableData()
}
// 重置
const resetParams = () => {
    searParam.keyword = ''
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
        title: '项目',
        key: 'project_name',
        type: 'text',
    },
    {
        title: '供应商',
        key: 'supplier_name',
        type: 'text',
    },
    {
        title: '仓库',
        key: 'store_name',
        type: 'text',
        width:'150px',
    },
    {
        title: '库区',
        key: 'area_name',
        type: 'text',
        width:'120px',
    },
    {
        title: '库位',
        key: 'location_name',
        type: 'text',
        width:'120px',
    },
    {
        title: '库存数量',
        key: 'stock_num',
        type: 'text',
        width: 100,
        change:true
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


// 加载表格数据
const getTableData = async () => {
    let params = {
        keyword: searParam.keyword,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    }
    const result = await inStoReport(params)
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
    let row1 = row
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

// 修改物料状态
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

//选择框选中
const selectionChange = (keys:any) => {
    checkedKeys = ref<any>([])
    keys.forEach((key:any) => {
        console.log(key,'key');
        checkedKeys.value.push(key)
    })
}

//table 新增按钮
const addBtn = () => {
}

// #endregion

onMounted( ()=> {
    getTableData()
})

</script>
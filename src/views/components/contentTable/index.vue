<template>
    <div class="contentTable">
        <div class="btn">
            <template v-for="(item,index) in buttonList" :key="index">
                <n-button
                    @click="item.click"
                    :type="item.type"
                >
                    {{ item.name }}
                </n-button>
            </template>
        </div>
        <n-data-table
            ref
            :bordered="false"
            :single-line="false"
            :columns="columns"
            :data="tableData"
            striped
            :children-key="childrenKey"
            :max-height="contentContainer"
            :row-key="rowKeyName"
            :on-update:checked-row-keys="handleCheck"
        />
        <n-pagination 
            v-model:page="pagination.pageIndex" 
            :page-count="Math.ceil(pagination.total/pagination.pageSize)"
            show-size-picker
            :page-sizes="pageSizes"
            :on-update:page="handlePageIndexChange"
            :on-update:page-size="handlePageSizeChange"
        />
    </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { NButton, NSwitch, NPopconfirm, NTag, NSpace } from 'naive-ui';
import { ref, reactive, h, onMounted } from 'vue';
import dayjs from 'dayjs';

interface buttonItem {
    type:'primary' | 'error',
    name:string,
    click?:Function | any,
}

const tagType = {
    'all' : 'success',
    'add' : 'success',
    'delete' : 'error',
    'edit' : 'warning',
    'check' : 'success',
}

const tagText = {
    'all' : '全部',
    'add' : '增加',
    'delete' : '删除',
    'edit' : '修改',
    'check' : '查看',
}

type tagT = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'

const props = defineProps({
    tableColumns:{
        type:Array,
        default:[]
    },
    tableData:{
        type:Array,
        default:()=>[]
    },
    pagination:{
        type:Object,
        default:{
            pageSize:10,
            pageIndex:1,
            total:100
        }
    },
    pageSizes:{
        type:Array,
        default:()=> [
            {
                label: '10 每页',
                value: 10
            },
            {
                label: '20 每页',
                value: 20
            },
            {
                label: '30 每页',
                value: 30
            },
            {
                label: '40 每页',
                value: 40
            },
            {
                label: '50 每页',
                value: 50
            }
        ]
    },
    rowKeyName:{
        type:String,
        default:'id'
    },
    buttonList:{
        type:Array<buttonItem>,
        default:()=>[]
    },
    childrenKey:{
        type:String,
        default:'orderDetail'
    }
})
const emit = defineEmits([
                'deleteRow',
                'PageIndexChange',
                'PageSizeChange', 
                'changeSwitch', 
                'checkInfo',
                'selectionChange'
            ])

// 删除表格数据
const deleteItem = (row:any) => {
    emit('deleteRow', row)
}
// 获取表格列详情
const checkInfo = (row:any) => {
    emit('checkInfo', row)
}

// 获取表格高度
const contentContainer = ref<number>(0)
const getContainerHeight = () => {
    contentContainer.value = Number(document.querySelector('.contentTable')?.clientHeight as number) - 85
       
}

//生成columns
const genColumns = () => {
    let data = props.tableColumns.map((item:any) => {
        // 操作
        if(item?.type === 'operate'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                render(row:any){
                    return [
                        h(NButton,{
                            style:{
                                marginRight: '10px'
                            },
                            disabled: row.status === 0 ? true : false,
                            text:true,
                            onClick: ()=> checkInfo(row)
                        },
                        {
                            default:() => '修改'
                        }),
                        h(NPopconfirm,{
                            onPositiveClick: ()=> deleteItem(row),
                            positiveText:"确定",
                            negativeText:"取消"
                        },
                        {
                            trigger:() => {
                                return h(NButton,{
                                    class:'delete',
                                    text:true,
                                    disabled: row.status === 1 ? true : false
                                },{
                                    default:() => '删除'
                                })
                            },
                            default: () => '是否确认删除'                            
                        }),
                    ]
                }
            }
        }
        // 文本
        if(item?.type === 'text'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                width: item.width ? item.width : '',
                ellipsis: {
                    tooltip: true
                },
                render(row:any){
                    return [
                        h('span',{
                            class:'text',
                        },
                        {
                            default:() => {
                                if(!item.change) {
                                    return changeStatus(row[item.key])
                                }else{
                                    return row[item.key]
                                }
                            }
                        })
                    ]
                }
            }
        }
        // 时间
        if(item?.type === 'time'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                width: item.width ? item.width : '',
                render(row:any){
                    return [
                        h('span',{
                            class:'time',
                        },
                        {
                            default:() => dayjs(row[item.key]).format('YYYY-MM-DD HH:mm:ss')
                        })
                    ]
                }
            }
        }
        // 状态切换按钮
        if(item?.type === 'switch'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                render(row:any){
                    return [
                        h(NSwitch,{
                            class:'text',
                            size:'medium',
                            value: row[item.key] == 1 ? true : false, 
                            onUpdateValue: (value:any) => changeSwitch(value, row[props.rowKeyName])
                        },
                        {
                            default:() => row[item.key],
                            checked:()=> '启用',
                            unchecked:()=> '禁用'
                        })
                    ]
                }
            }
        }
        // 选择
        if(item?.type === 'selection'){
            return {
                type: 'selection',
                align:'center',
                titleAlign:'center',
                multiple: item.multiple,
                disabled: (row:any) => item.disabled ? false : row.status === 1 ? true : false
            }
        }
        // 索引
        if(item?.type === 'index'){
            return {
                title: '序号',
                key: 'index',
                width: 80,
                align:'center',
                titleAlign:'center',
                render: (_:any, index:number) => {
                    return `${index + 1}`
                }
            }
        }
        // 索引
        if(item?.type === 'tag'){
            return {
                title: item.title,
                key: item.key,
                width: item.width,
                align:'center',
                titleAlign:'center',
                render: (row:any) => {
                    return h(NSpace,{},{
                                default:() => {
                                    return genTags(row.permission)
                                }
                            })
                }
            }
        }
    })
    return data
}

//订单状态值转换
const changeStatus = (val:any) => {
    if(typeof val === 'number'){
        switch (val) {
            case 0:
                return '保存'
            case 1:
                return '完成'
            case -1:
                return '删除'
            default:
                return val
                break;
        }
    }else{
        return val
    }
}

const columns = reactive(genColumns())

// pageSize改变
const handlePageSizeChange = (pageSize:number) => {
    emit('PageSizeChange', pageSize)
}

// pageindex改变
const handlePageIndexChange = (pageIndex:number) => {
    emit('PageIndexChange', pageIndex)
}

// 切换开关
const changeSwitch = (value:boolean, id:number) => {
    emit('changeSwitch', value, id)
}

// 表格rowKeyName
const rowKeyName = (row:any) => {
    return row[props.rowKeyName]
}

// // 选中
const handleCheck = (keys:any) => {
    emit('selectionChange', keys)
} 

// 渲染tags
const genTags = (arr:any) =>{
    const tags = arr.map((item:keyof typeof tagType) => {
        return h(NTag, {
                    closable:false,
                    type: tagType[item] as tagT,
                },{
                    default: () => tagText[item]
                })
    })
    return tags
}

onMounted(() => {
    getContainerHeight()
})
</script>
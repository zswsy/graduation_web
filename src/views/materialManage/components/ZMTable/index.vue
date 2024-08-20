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
            :row-key="(row:any) => row.index"
            :bordered="false"
            :single-line="false"
            :columns="columns"
            :data="tableData"
            striped
            :max-height="contentContainer"
            :on-update:checked-row-keys="handleCheck"
        />
    </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { NInput, NInputNumber, NSelect } from 'naive-ui';
import { ref, reactive, h, onMounted } from 'vue';
import dayjs from 'dayjs';

interface buttonItem {
    type:'primary' | 'error',
    name:string,
    click?:Function,
}

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
    }
})

const emit = defineEmits([
                'deleteRow',
                'PageIndexChange',
                'PageSizeChange', 
                'changeSwitch', 
                'checkInfo',
                'selectionChange',
                'updataTableData',
                'optionChange'
            ])



//生成columns
const genColumns = () => {
    let data = props.tableColumns.map((item:any) => {
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
                            default:() => row[item.key]
                        })
                    ]
                }
            }
        }
        // 下拉框
        if(item?.type === 'select'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                width: item.width ? item.width : '',
                ellipsis: {
                    tooltip: true
                },
                loading:true,
                render(row:any,index:number){
                    return [
                        h(NSelect,{
                            filterable:true,
                            options:row[item.optionKey],
                            placeholder: item.placeholder,
                            onUpdateValue(value:any,option:any){
                                emit('optionChange',value,option,index)
                            }
                        },
                        {
                            default:() => row[item.key]
                        })
                    ]
                }
            }
        }
        // 数字输入框
        if(item?.type === 'input-num'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                width: item.width ? item.width : '',
                ellipsis: {
                    tooltip: true
                },
                render(row:any,index:number){
                    return [
                        h(NInputNumber,{
                            onUpdateValue: (e:any) => {
                                emit('updataTableData', {value: e, key: item.path,index:index})
                            },
                            value: row[item.path],
                            disabled: row.disabled ? true : false,
                            placeholder: item.placeholder,
                            min: item.min ? item.min : 0,
                            max: row.max ? row.max : 100,
                        },
                        {
                            default:() => row[item.key]
                        })
                    ]
                }
            }
        }
        // 文本输入框
        if(item?.type === 'input'){
            return {
                title: item.title, //表头名称
                key: item.key, //列数据在数据项中的 key
                align:'center',
                titleAlign:'center',
                width: item.width ? item.width : '',
                ellipsis: {
                    tooltip: true
                },
                render(row:any,index:number){
                    return [
                        h(NInput,{
                            onUpdateValue: (e:any) => {
                                emit('updataTableData', {value: e, key: item.path,index:index})
                            },
                            value: row[item.path],
                            disabled: item.disabled ? true : false,
                            placeholder: item.placeholder,
                        },
                        {
                            default:() => row[item.key]
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
                disabled: (row:any) => row.status === 1 ? true : false,
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
    })
    return data
}

const columns = reactive(genColumns())



// // 选中
const handleCheck = (keys:any,rows:any) => {
    emit('selectionChange', keys,rows)
} 

// 获取表格高度
const contentContainer = ref<number>(0)
const getContainerHeight = () => {
    contentContainer.value = Number(document.querySelector('.contentTable')?.clientHeight as number) - 85
       
}

onMounted(() => {
    getContainerHeight()
})
</script>
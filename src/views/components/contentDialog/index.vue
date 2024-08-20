<template>
    <div class="dialogContent"></div>
</template>

<script lang="ts" setup>
import './index.scss'
import { NButton, NForm, NFormItem, NInput, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { ref, h, watchEffect, onMounted } from 'vue';


const props = defineProps({
    title: { 
        type: String,
        default: '标题'
     },
     dialogVisible: {
         type: Boolean,
         default: false
     },
     columns: {
         type: Array,
         default: () => []
     },
     modalData:{
        type: Object,
        default: () => {}
     }
})
const emit = defineEmits(['updateDialogVisible','updateModalData', 'confirmButton'])
const dialog = window['$dialog']
// 创建dialog实例
const createDialog = () => {
    dialog.success({
        title: props.title,
        maskClosable:false,
        content: () => h(NForm, {modal:props.modalData}, {default: () => [...creamFormItems()]}),
        action: () => {
            return [
                h(NButton, {
                    onClick: () => {
                        emit('updateDialogVisible', false)
                    }
                }, {
                    default: () => '取消'
                }),
                h(NButton, {
                    type: 'primary',
                    onClick: () => {
                        // emit('updateDialogVisible', false)
                        emit('confirmButton')
                    }
                }, {
                    default: () => '确定'
                })
            ]
        },
        onAfterLeave: () => {
            emit('updateDialogVisible', false)
        }
    })
}

//创建formItems实例
const creamFormItems = () => {
    return props.columns.map( (item:any) => {
        return h(NFormItem, {
                label: item.label,
                path: item.path,
                rule: item.rule
            },{
                default: () => {
                    if(item.type === 'input'){
                        return h(NInput, {
                            onUpdateValue: (e:any) => {
                                emit('updateModalData', {value: e, key: item.path})
                            },
                            value: props.modalData[item.path],
                            disabled: item.disabled ? true : false,
                            placeholder: item.placeholder 
                        })
                    }
                    if(item.type === 'number'){
                        return h(NInputNumber, {
                            onUpdateValue: (e:any) => {
                                emit('updateModalData', {value: e, key: item.path})
                            },
                            value: props.modalData[item.path],
                            disabled: item.disabled ? true : false,
                            placeholder: item.placeholder,
                            min: 0 
                        })
                    }
                    if(item.type === 'select'){
                        return h(NSelect, {
                            onUpdateValue: (e:any) => {
                                emit('updateModalData', {value: e, key: item.path})
                            },
                            value: props.modalData[item.path],
                            disabled: item.disabled ? true : false,
                            placeholder: item.placeholder,
                            options: item.options,
                            multiple: item.multiple,
                            filterable: item.filterable,
                        })
                    }
                    if(item.type === 'switch'){
                        return h(NSwitch, {
                            onUpdateValue: (e:any) => {
                                console.log(e,'inside');
                                emit('updateModalData', {value: e, key: item.path})
                            },
                            value: props.modalData[item.path] == 1 ? true : false,
                            disabled: item.disabled ? true : false,
                            placeholder: item.placeholder 
                        },{
                            checked:()=> '启用',
                            unchecked:()=> '禁用'
                        })
                    }
                }
                
                
                
            })
        
    })
}

// console.log(creamFormItems(),'creamFormItems');

// 创建form实例
const creamForm = () => {
    return h(NForm, null, creamFormItems())
}

// // 确认按钮
// const confirmBtn = () => {
//     emit('updateDialogVisible', false)
// }

// onMounted(() => {
//     dialogVisible.value = props.dialogVisible
// })

watchEffect(() => {
    if (props.dialogVisible) {
        createDialog()
    }else{
        dialog.destroyAll()
    }
})
</script>
<template>
  <div class="search-box">
    <div class="input-box" v-for="(item, index) in inputOptions" :key="index">
      <span v-if="item.label">{{ item.label }}</span>
      <n-input
        v-if="item.type === 'input'"
        v-model:value="modalData[item.prop]"
        clearable
        :placeholder="item.placeholder"
      >
      </n-input>
      <n-select
        v-if="item.type === 'select'"
        :class="{ 'isLong': item.isLong}"
        v-model:value="modalData[item.prop]"
        :placeholder="item.placeholder"
        :options="item.options"
        :filterable="item.filterable"
      >
      </n-select>
    </div>
    <n-button style="margin-right: 10px;" type="primary" @click="searchHandle">查询</n-button>
    <n-button type="primary" @click="reset">重置</n-button>
    <!-- 插槽放入其余的元素 -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import './index.scss'
import { ref } from 'vue';

interface inputItem  {
    label:string,
    prop:string,
    value?:any,
    placeholder?:string,
    type?:string,
    isLong?:boolean,
    options?:any[],
    filterable?:boolean
}




const props = defineProps({
    inputOptions:{
        type:Array<inputItem>,
        default:()=>[
            {
              label: null,
              prop: 'value',
              value: null,
              placeholder: '请输入',
              options:[
                  {
                    label: '选项1',
                    value: '1',
                  }
                ]
            },
        ]
    },
    modalData:{
      type:Object,
      default:()=>({
        material_code: null,
      })
    }
})

// const modelDataType = keyof typeof props.modalData

const emit = defineEmits(['search','reset'])

//search
const searchHandle = () => {
    emit('search', null)
}

//reset
const reset = () => {
    emit('reset', null)
}

</script>

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStoreSetup = defineStore("store", () => {
    const userInfo = ref({
        name: '',
        age: 0,
        sex: 1,
        token: '',
        username:'',
        role:'',
        user_id:'',
        status: 1,
        permission: [],
        mobile: '',
    });
    const doubleAge = computed(() => userInfo.value.age * 2)
    function changeAge() {
        userInfo.value.age=userInfo.value.age*2
    }
    return { userInfo, doubleAge, changeAge };
},
{
    persist: {
        key: 'my-pinia-user',
    }
    
}
)
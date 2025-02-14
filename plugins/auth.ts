import { useUserStore } from "~/stores/user"

export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore=useUserStore()

    if(!userStore.user){
        await userStore.dataUser()
    }

    if(!userStore.pelanggan){
        await userStore.dataPelanggan()
    }
})

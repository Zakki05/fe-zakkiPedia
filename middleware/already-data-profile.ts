export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore=useUserStore()

    if(!userStore.user){
        return await navigateTo('/auth')
    }

    if(!!userStore.user && !!userStore.pelanggan){
        if (userStore.user.role.id == '3') {
            return await navigateTo('/pelanggan')
        }
    }
})

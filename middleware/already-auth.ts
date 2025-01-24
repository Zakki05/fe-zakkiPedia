export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore=useUserStore()

    if(!!userStore.user){
        if (userStore.user.role.id == '1') {
            return await navigateTo('/superAdmin')
        } 
        if (userStore.user.role.id == '2') {
            return await navigateTo('/admin')
        }
        if (userStore.user.role.id == '3') {
            return await navigateTo('/pelanggan')
        }
    }
})

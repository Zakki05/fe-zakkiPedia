export default defineNuxtRouteMiddleware(async (to, from) => {
/*     const cookie = useCookie('auth-token')
    const token = cookie.value */
    const userStore=useUserStore()

    if(!userStore.user){
        return await navigateTo('/auth')
    } else if(userStore.user.role.id==3 /* && to.path !== '/employee/createProfile' */){ // untuk mengatasi infinite navigate guard
        if(!userStore.pelanggan){
            return await navigateTo('/auth/buatProfile')
        }
    }

    /* console.log(cookie)
    console.log(cookie.value) */

    /* if (token != null) {
        let header = {
            Authorization: `Bearer ${token}`
        };

        async function getToken() {
            const res = await $fetch('https://ticketing.isoae.com/api/v1/validateToken', {
                headers: header,
                method: 'POST',
            });
            console.log(res)
        }
        return getToken()
    }
    else {
        return navigateTo("/login")
    } */
})
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user',()=>{
  const token=useCookie('auth-token',{
    maxAge:2*60*60
  })

  const user=ref()
  const pelanggan=ref()

  const setToken=(data?:string)=>(token.value=data)
  const setUser=(data?:any)=>(user.value=data)
  const setPelanggan=(data?:any)=>(pelanggan.value=data)

  const signIn=async (data?:any)=>{
    try {
      const res=await $fetch<any>('http://be-zakkipedia.test/api/v1/login',{
        body:data,
        method:'POST',
        headers:{
          'Accept':'application/json',
        }
      })

      setToken(res.data.token)
      await dataUser()
      await dataPelanggan()
    } catch (error:any) {
      setToken()
      setUser()
      setPelanggan()
      if(error.response){
        throw new Error(error.response._data.message||'Login Failed')
      }else if(error.request){
        throw new Error('No response received from server')
      }
    }
  }

  const dataUser=async ()=>{
    if(token.value){
      try {
        const res=await $fetch<any>('http://be-zakkipedia.test/api/v1/validateToken',{
          method:'POST',
          headers:{
            'Authorization':`Bearer ${token.value}`,
            'Accept':'application/json'
          }
        })
        
        console.log(res.data)
        setUser(res.data.record)
        console.log(user)
      } catch (error) {
        setToken()
        setUser()
        setPelanggan()
        console.log(error)
      }
    }
  }

  const dataPelanggan=async ()=>{
    if(token.value){
      try {
        if(user.value.role.id==3){
          const {data:data}=await useFetch<any>(`http://be-zakkipedia.test/api/v1/pelanggan?user_id=${user.value.id}`,{
            headers:{
              'Authorization':`Bearer ${token.value}`,
              'Accept':'application/json'
            }
          })
          setPelanggan(data.value.data.record)
          console.log(pelanggan)
        }
      } catch (error:any) {
        console.log(error)
        setPelanggan()
      }
    }
  }

  const logout=async ()=>{
    setToken()
    setUser()
    setPelanggan()
  }

  return {user,token,pelanggan,signIn,logout,dataUser,dataPelanggan}
})

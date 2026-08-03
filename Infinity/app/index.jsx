// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';
import {useRouter} from "expo-router"
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
export default function Index() {
    const router = useRouter();
    const { t } = useTranslation();
    useEffect(()=>{
        const getRefToken = async () => {
        const token = await SecureStore.getItemAsync('refreshToken');
            if(token){
                try{
                    
                    

                    const decoded =  jwtDecode(token);
                    const isValid = decoded.exp > Date.now() / 1000
                    if(!isValid){
                            await SecureStore.deleteItemAsync('refreshToken');
                            return router.replace("/login")         
                    }
                    let msg = t("LoginNotif.OK_200") + " " + (decoded?.username || "");
                    Toast.show({type : "success" , text1 : msg})
                    router.replace("/mainContent/createLabel")
                }catch(e){
                    await SecureStore.deleteItemAsync('refreshToken');
                    router.replace("/login")     
                }
            }else{
              router.replace("/login")     
            }
        }

         getRefToken();
    },[])

}
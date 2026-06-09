import { View, Text , Image, TextInput, Pressable  , StyleSheet , ScrollView} from 'react-native'
import React, { useEffect } from 'react'
import { useState , useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderLogin from "@/components/HeaderLogin"
import { useTranslation } from 'react-i18next';
import {useRouter} from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import getApi from "@/utils/api.js"
import {storageGetItem,storageSetItem} from "@/utils/storage.js"
import { KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';
import { refToken } from '@/utils/refToken';


const login = () => {
    
    const router = useRouter();

  const getText2 = (key) => {
    const fullKey = `httpsText2.${key}`;
    return i18n.exists(fullKey) ? t(fullKey) : undefined;
  };

    


    const { t, i18n } = useTranslation();
    const colorPressed = "#0676b9"
    const [isActive,setIsActive] = useState(false);
    const [isShowing , setIsShowing] = useState(false);
    const [isRememberMe , setIsRememberMe] = useState(false);
    

    const  [webAdressValue,setWebAdressValue]= useState("");
    const usernameRef = useRef("");
    const passwordRef = useRef("");

    useEffect(()=>{

        const getWebAdress = async () => {
          const webAdress =   await storageGetItem("webAdress")
          setWebAdressValue(webAdress)
        }
        getWebAdress();

    },[])

    const handleLogin = async () => {
        Toast.show({type : "waiting" , text1 : "Waiting"})
        const username = usernameRef.current.trim();
        const password = passwordRef.current.trim();
        let webAdress = webAdressValue.toString().trim();

        
        try{
            await storageSetItem("webAdress",webAdress);

            const api = await getApi();

            const demande = await api.post("/auth/login",{username,password})

            const data = demande.data;

            const decoded = jwtDecode(data.accessToken);

            if(isRememberMe){
                await SecureStore.setItemAsync('refreshToken', data.refreshToken);
                
            }else{
                refToken.current = data.refreshToken;
            }
            await storageSetItem("accessToken",data.accessToken);
            let msg = t("LoginNotif.OK_200") + " " + (decoded?.username || "");
            Toast.show({type : "success" , text1 : msg})
     
            router.replace("/mainContent/createLabel")
            
            
        }catch(e){
           const status = e.status || (e.response ? e.response.status : "");
            console.log(e.code , e.status)
           let msg 

            if(status) {
            switch(status){
                case 400 :
                    msg = "ERR_400";
                    break;
                case 401 : 
                    msg = "ERR_401";
                    break;
                case 404:
                    msg = "ERR_404"
                    break
                case 429: 
                    msg = "ERR_429"
                    break
                case 500 : 
                    msg = "ERR_500";
                    break;
                default :
                    msg = "ERR_UNKNOWN"      
                    break;
            }

            Toast.show({ type: "error", text1: t(`LoginNotif.${msg}`), text2: getText2(msg) })

                    
            }else{
                Toast.show({ type: "error", text1: t(`LoginNotif.${e.code ?? "ERR_UNKNOWN"}`)})
           }

            
        }


        
      
    }

    return (
        
        <SafeAreaView style = {{ flex : 1 ,backgroundColor : "#242424" , position : "relative"}}>
            <HeaderLogin/>
             <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
           
                <View style = {{flex : 1}} style = {Styles.Container}>

                    <Image source={require('@/assets/images/logo.jpeg')} style = {Styles.Image}/>
                    
                    <View  style = {Styles.LittleContainer}>
                        <View><Text style = {Styles.Label}>{t('Login.webadress')}</Text>
                            <TextInput style = {Styles.Input} value={webAdressValue}  onChangeText={(text) => setWebAdressValue(text)} />
                        </View>

                        <View><Text style = {Styles.Label}>{t('Login.username')}</Text>
                            <TextInput style = {Styles.Input} onChangeText={(text) => usernameRef.current = text}  />
                        </View>

                        <View>

                            <Text  style = {Styles.Label}  >{t('Login.password')}</Text>

                            <View style = {Styles.passwordView} >
                                <TextInput style = {Styles.InputOnly} secureTextEntry={!isShowing ?  true : false} autoCapitalize="none"  autoCorrect={false} onChangeText={(text) => passwordRef.current = text} />

                                <Pressable onPress={()=>{setIsShowing(!isShowing)}}>
                                        <Image source={ isShowing ? require("@/assets/view.png") : require("@/assets/hide.png")} style = {Styles.eyeIcon}></Image>
                                </Pressable>
                            </View>
                            
                        </View>

                        <Pressable onPress={()=>{setIsRememberMe(!isRememberMe)}} style = {{alignItems : "flex-start"}}>
                            <View style = {checkboxStyle.Container}>
                                <View style = {!isRememberMe ? checkboxStyle.checked : checkboxStyle.notChecked} ></View>
                                <Text style = {checkboxStyle.CheckBoxText}>{t("HeaderSide.remember")}</Text>
                            </View>
                        </Pressable>
                        

                        <Pressable style = { ({ pressed }) => [Styles.LoginButton , { backgroundColor: pressed ? '#0676b9' : '#0398D5' }]} onPress={handleLogin} >
                            <Text style = {Styles.LoginButtonText} >{t("Login.login")}</Text>
                        </Pressable>

                    </View>
                </View>
       
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
       
    )

}








export default login

const Styles = StyleSheet.create({
    Container : {
      flexDirection : "column",
      justifyContent : "center",
      alignItems : "center",
      flex : 1,
      backgroundColor : "#232323",
    },
    Image : {
        width : wp("87%"),
        height : hp("15%"),
        resizeMode : "contain",
    },
    Input : {
      width : wp("75%"),
      height : hp("7%"),
      backgroundColor : "whitesmoke",
      borderColor : "gray",
      borderWidth : 0.2,
      borderRadius: 5,
      color : "black",
       paddingHorizontal: 10, 
    },
    LittleContainer : {
      marginTop :hp("1%"),
      gap : hp("1.5%")
    },
    Label : {
      fontWeight : 500,
      marginBottom : hp("0.7%"),
      color : "white"
    },
    LoginButton : {
      marginTop : hp("3%"),
      width : wp("70%"),
      height : hp("6%"),
      alignSelf : "center",
      borderRadius : 5 ,
      justifyContent : "center",
      alignItems : "center"
    },
    LoginButtonText : {
      color : "white",
      fontWeight : 900,
    },
    passwordView: {
        flexDirection: "row", 
        alignItems: "center", 
        width: wp("75%"),
        height: hp("7%"),
        backgroundColor: "whitesmoke",
        borderRadius: 5,
        borderWidth: 0.2,
        borderColor: "gray",
        paddingHorizontal: 10, 
        alignSelf: "center"
    },
    InputOnly: {
        flex: 1,
        height: "100%",
        color : "black"
    },
    eyeIcon: {
        width: 25,
        height: 25,
        resizeMode: "contain"

    }
  })
  


const checkboxStyle = StyleSheet.create({
        checked : {
        width : 20,
        height : 20,
        borderRadius : 2,
        backgroundColor : "white",
        borderColor : "#0398D5",
        borderWidth : 1,
        },

        notChecked : {
        width : 20,
        height : 20,
        borderRadius : 2,
        backgroundColor : "#0398D5",
        borderColor : "white",
        borderWidth : 1,     
        },
        CheckBoxText : {
            color:"whitesmoke",
            fontWeight: 500
        },
        Container :{
            marginTop : hp("1%"),
            flexDirection : "row",
            gap : wp("3%"),
            alignItems : "flex-start",
        }
})
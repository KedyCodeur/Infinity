import { View, Text , StyleSheet, FlatList , Image, Pressable} from 'react-native'
import React, { useEffect ,useState} from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated,{useAnimatedStyle, useSharedValue, withTiming , Easing} from "react-native-reanimated"
import HeaderSideLi from "./HeaderSideLi"
import Options  from './Options';
import {useRouter,usePathname} from "expo-router"
import LanguagePicker from "./LanguagePicker"
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/themeContext';
import { refToken } from '../utils/refToken';
import * as SecureStore from 'expo-secure-store';

const outSideOfTheScreen = -wp("100%");

const Header = ({name}) => {

    const {t} = useTranslation();
  
    const pathname = usePathname()

    const { isDark} = useTheme() ?? false
   

    useEffect(() => {
        setIsActive(false)
    }, [pathname])

    const [isActive,setIsActive] = useState(false)
    const router = useRouter();

    const headerRight = useSharedValue(-200)

    const headerSideAnimation = useAnimatedStyle(() => {
    return {
        
        right: headerRight.value, 
        backgroundColor : isDark ? "#0676b9": "#0398D5"
    };
    });



  
    const burgerLine1 = useAnimatedStyle(() => ({
        transform: [
            { rotate: withTiming(isActive ? '45deg' : '0deg', { duration: 300 }) },
            { translateY: withTiming(isActive ? 8 : 0) },
        ]
    }));

    const burgerLine2 = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(isActive ? 0 : 1) }]
    }));

    const burgerLine3 = useAnimatedStyle(() => ({
         
        transform: [
            { rotate: withTiming(isActive ? '-45deg' : '0deg', { duration: 300 }) },
            { translateY: withTiming(isActive ? -8 : 0) },
            ]
    }));


    const handleLogOut =  async () => {
        
        try{

            refToken.current = null;
            await SecureStore.deleteItemAsync('refreshToken');
            router.replace("/login")

        }catch(e){
            console.log(e)
        }

    }

  useEffect(()=>{
    headerRight.value = withTiming( isActive ? 0 : outSideOfTheScreen , {duration : 700 , easing : Easing.bounce})
  },[isActive])

  const [isFlagClicked,setIsFlagClicked] = useState(false);

  return (

    

     <View style = {[Styles.Header,{backgroundColor : isDark ? "#0676b9" : "#0398D5"}]}>
        <Text style = {Styles.headerText}>{name}</Text>
        <Pressable style = {Styles.burgerPressable} onPress={()=>setIsActive(!isActive)}>
            <Animated.View style = {[Styles.burgerLine ,burgerLine1]} ></Animated.View>
            <Animated.View  style = {[Styles.burgerLine ,burgerLine2]}></Animated.View>
            <Animated.View  style = {[Styles.burgerLine ,burgerLine3]}></Animated.View>
        </Pressable>

        <Animated.View style = {[Styles.HeaderSide,headerSideAnimation]}>
               <HeaderSideLi name={t("HeaderSide.options")} content = {
                    <>
                       
                        <Options name={t("HeaderSide.theme")} storageKey={"theme"} />
                        <LanguagePicker lang = {t("HeaderSide.lang")} setter = {setIsFlagClicked}></LanguagePicker>
                    </>
                } isTheFirst={true}  lang={{isFlagClicked,setIsFlagClicked}}/>
    
                <Pressable  onPress={handleLogOut}
                style={({ pressed }) => [
                    Styles.logOut, 
                    pressed && { opacity: 0.5 } 
                ]}
                >
                 <Image source={require("@/assets/deconnection.png")} style={Styles.deconnectionIcon} />
                 <Text style = {Styles.logOutText}>{t("HeaderSide.logOut")}</Text>
                </Pressable>

                
        </Animated.View>
    </View>



  )
}


 const Styles = StyleSheet.create({
    Header : {
        backgroundColor : "#0398D5",
         alignItems : "center",
         justifyContent : "space-between",
         height : hp("7%"),
         flexDirection : "row",
         position : "absolute",
         width : wp("100%")
    },
    burgerIcon : {
        width : "100%" ,
        height : "100%",
    },
    burgerPressable : {
        width: 30,
        height: 20,
        resizeMode : "contain",
        marginRight : wp("6%"),
        zIndex : 999,
        justifyContent: 'space-evenly',
        alignItems : "center"
        
    },
    HeaderSide : {
        width : wp("100%"),
        height : hp("100%"),
        position : "absolute",
        top : 0,
        borderColor : "black",
        borderWidth : 1,
        zIndex : 998,
        padding : wp("5%")
        
    },
    burgerLine : {
        width : "100%",
        height : 4,
        borderRadius : 5,
        backgroundColor : "white",
    },
    headerText : {
        fontSize : 18,
        color: "white",
        fontWeight : "500",
        marginLeft : wp("4%")
    } , 
    logOut : {
        marginTop : hp("1%"),
        alignSelf: "flex-start",
        flexDirection : "row",
        justifyContent : "center",
        alignItems  :"center",
        gap : 5
    },
    logOutText : {
        color : "white",
        fontSize : 25
    },
    deconnectionIcon : {
        width : wp("6%"),
        height : hp("3%"),
        resizeMode : "contain"
    },

 })
export default Header
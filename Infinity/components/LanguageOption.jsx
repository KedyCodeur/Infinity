import { View, Text , Image , StyleSheet , FlatList, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageGetItem, storageSetItem} from '../utils/storage'
import { useTranslation } from 'react-i18next';
import Animated ,{ useAnimatedStyle, useSharedValue, withTiming ,Easing} from 'react-native-reanimated';



    
const flags = [
  { id: "TR", image: require('@/assets/images/flags/turkey.png') , name : "Türkçe"},
  { id: "EN", image: require('@/assets/images/flags/uk.png'), name : "English" },
  { id: "FR", image: require('@/assets/images/flags/france.png') , name : "Français"},
  { id: "DE", image: require('@/assets/images/flags/germany.png') , name : "Deutsch" },
  { id: "NL", image: require('@/assets/images/flags/netherlands.png') , name : "Nederlands"},
  { id: "RU", image: require('@/assets/images/flags/russia.png') , name : "Русский" }
];


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const total = flags.length *  hp("6%"); 

const LanguageOption = () => {

    const {i18n} = useTranslation();  
  
    const [langChanged,setLangChanged] = useState(true);
    const [activeFlag, setActiveFlag] =  useState("FR");
    
    
    const [isActive,setIsActive] = useState(false)
    

    useEffect(() => {
      const loadLang = async () => {
        const saved = await storageGetItem("activeLang");
        if (saved && saved !== activeFlag) {
          setActiveFlag(saved);
          i18n.changeLanguage(saved.toLowerCase());
        }
      };
      loadLang();
    }, []);


  const handleLanguageChange = async (id) => {
      setActiveFlag(id);
      setIsActive(false);
      i18n.changeLanguage(id.toLowerCase());
      await storageSetItem("activeLang", id);
    };
  

  const currentFlagData = flags.find(f => f.id === activeFlag) || flags[0];
  
  const containerHeight = useSharedValue(0);
  const flagContainerAnimation = useAnimatedStyle(()=>{
      return({
        height : containerHeight.value,
      });
  })




useEffect(() => {
    containerHeight.value = withTiming(
        isActive ? total : 0,
        { duration: 650 , easing : Easing.bounce}
    );

    
}, [isActive]);

  return (
    <View style = {[Styles.Container , {position : "absolute",
           top : hp("1%"),
           gap : hp("2%")}]}>
        <Pressable onPress={()=>{setIsActive(!isActive)}}><Image style = {Styles.Icon} source={flags.find(f => f.id === activeFlag).image} ></Image></Pressable>
        <Animated.View 
        renderToHardwareTextureAndroid={true}
        shouldRasterizeIOS={true}
        style={[Styles.FlagContainer,flagContainerAnimation]}>

          {flags.map((item) => (
            <Pressable 
              key={item.id} 
              style={Styles.Li} 
              onPress={() => handleLanguageChange(item.id)}
            >
              <Image source={item.image} style={Styles.LiImage} />
              <Text style = {{color : "white"}}>{item.name}</Text>
            </Pressable>
          ))}

        </Animated.View>
    </View>
  )

  
}
const Styles = StyleSheet.create(
    {
        Icon:{
        height : hp("4%") ,
        width : wp("12%") ,
        marginRight : wp("3%"),
        borderRadius :3

        },
        FlagContainer : {
        width : wp("45%"),
        backgroundColor : "#0398D5",
        borderColor : "black",
        borderWidth : 1,
        overflow : "hidden"
        
        },
        Container : {
           width : wp("100%"),
           zIndex : 999,
           justifyContent  : "center",
           alignItems : "flex-end",
        },
        Li : {
          width :"100%",
          height : hp("6%"),
          borderColor : "black",
          borderBottomWidth : 1,
          flexDirection : "row",
          alignItems : "center",
          justifyContent : "space-start",
          paddingLeft : "10%",
          gap : "10%",
         
        }, 
        LiImage : {
          width : "27%",
          height : "60%",
          resizeMode : "contain",
          borderRadius : 5,
          
        }
    }
    )

export default LanguageOption
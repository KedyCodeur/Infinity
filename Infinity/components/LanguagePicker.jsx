import { View, Text , Image , StyleSheet , FlatList, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageGetItem, storageSetItem} from '../utils/storage'
import { useTranslation } from 'react-i18next';
import Animated ,{ useAnimatedStyle, useSharedValue, withTiming ,Easing} from 'react-native-reanimated';
import { ScrollView } from "react-native";



    
const flags = [
  { id: "TR", image: require('@/assets/images/flags/turkey.png') , name : "Türkçe"},
  { id: "EN", image: require('@/assets/images/flags/uk.png'), name : "English" },
  { id: "FR", image: require('@/assets/images/flags/france.png') , name : "Français"},
  { id: "DE", image: require('@/assets/images/flags/germany.png') , name : "Deutsch" },
  { id: "NL", image: require('@/assets/images/flags/netherlands.png') , name : "Nederlands"},
  { id: "RU", image: require('@/assets/images/flags/russia.png') , name : "Русский" }
];


const containerHeight = 2 *  hp("6%"); 

const LanguagePicker = ({lang,setter}) => {

    const {i18n} = useTranslation();  
  
    const [activeFlag, setActiveFlag] =  useState("FR");
    
    
    const [isActive,setIsActive] = useState(false)
    
    useEffect(()=>{
      setter(isActive)
    },[isActive])

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
  


const containerStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(isActive ? containerHeight + 23 : 0, { duration: 400 })
}))


  return (
    <View style = {{marginLeft : "10%"}}>
        <Pressable onPress={()=>{setIsActive(!isActive)}} style = {Styles.pressable}><Text style = {Styles.textLang}>{lang}</Text><Image style = {Styles.Icon} source={flags.find(f => f.id === activeFlag).image} ></Image></Pressable>
        <Animated.ScrollView 
        nestedScrollEnabled={true}
        style = {[containerStyle]}>
        {flags.map((item) => (
                <Pressable
                key={item.id}
                onPress={() => handleLanguageChange(item.id)}
                style = {Styles.li}
                >
                <Image source={item.image} style={Styles.Icon} />
                <Text style = {Styles.liText}>{item.name}</Text>
                </Pressable>
            ))}
        </Animated.ScrollView>
    </View>
  )

  
}
const Styles = StyleSheet.create(
    {
        Icon:{
        height : hp("4%") ,
        width : wp("12%") ,
        borderRadius : 3,
        marginTop : "2%",
        marginBottom : "3%"
        },
        li : {
            borderColor : "black",
            borderWidth  : 0.5,
            flexDirection : "row",
            gap : wp("5%"),
            height : hp("6%"),
            alignItems : "center",
            justifyContent : "flex-start",
            width : "50%",
            paddingLeft : "5%",

        } , 
        liText : {
            color : "white",
            fontSize : 14
        },
        pressable : {
          flexDirection : "row",
          alignItems : "center",
          gap : "10%",
          alignSelf: 'flex-start'
        },
        textLang : {
            color : "white",
            fontSize : 23
        }
    }
    )

export default LanguagePicker
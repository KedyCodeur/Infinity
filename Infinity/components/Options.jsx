import { Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {storageSetItem, storageGetItem} from "../utils/storage"
import { widthPercentageToDP as wp , heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Animated  ,{ createAnimatedComponent, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/context/themeContext'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const bgWidth = wp("18%");
const ballWidth = bgWidth / 2;   
const ballHeight = 40;           

const leftActive = bgWidth - ballWidth - 1;


const Options = ({name,storageKey}) => {
    const { isDark,toggleTheme} = useTheme()

    const [isChecked,setIsChecked] = useState(false)

    const bgAnimation = useAnimatedStyle(()=>{
        return{
            backgroundColor : withTiming(isChecked ? "#52aeff" : "whitesmoke" , {duration : 300 }),
            borderColor : withTiming(isChecked ? "white" : "lightgray" , {duration : 300}),
        };
    })

    

    const ballAnimation  = useAnimatedStyle(()=>{
        return{
            left : withTiming(isChecked ? leftActive : 0, {duration : 300}),
        
        };
    })


    const handleStorage = () => {
            const newValue = !isChecked
            setIsChecked(!isChecked)
            if (storageKey === "theme") {
                toggleTheme()
            } else {

                storageSetItem(storageKey, newValue)
            }
        }

    useEffect(()=>{
            const storageGet = async (storageKey) => {
                const value = await storageGetItem(storageKey)
                if(value === true || value === false){
                    setIsChecked(value)
                }
                
            }
         storageGet(storageKey);
    }
    ,[])

  return (
    <View style = {styles.bigContainer}>
       <Text style = {styles.Text}>{name}</Text>
       <AnimatedPressable style ={[styles.bg,bgAnimation]} onPress={()=>{handleStorage()}} >
            <Animated.View style = {[styles.ball,ballAnimation]}/>
       </AnimatedPressable>
    </View>
  )
  
}

export default Options

const styles = StyleSheet.create({
    bigContainer : {
        flexDirection : "row" , 
        justifyContent : "space-evenly" ,
        alignItems : "center",
        overflow : "hidden",
        marginBottom : "3%"

    }, 
    Text : {
        fontSize : 23,
        marginTop : "5%",
        fontWeight : "450",
        color  : "#f0f0f0",
        height : "100%",
        width : "60%",
        flexWrap : "wrap",
        marginLeft : "5%"
    } , 
    bg : {
        width : wp("18%"),
        height : hp("4%"),
        borderRadius : 50 , 
  
        borderWidth : 1,
        position : "relative"
    } , 

    ball : {
        position : "absolute",
        top : 0,
        left : 0,
        width : "50%",
        height : "100%",
        borderRadius : 50,
        backgroundColor : "white",
        borderColor : "black",
        borderWidth : 1
        
    }
})
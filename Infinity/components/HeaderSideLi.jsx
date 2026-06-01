import { Pressable, StyleSheet, Text, View , Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated ,{useAnimatedStyle, withTiming} from "react-native-reanimated"
import { widthPercentageToDP as wp , heightPercentageToDP as hp } from 'react-native-responsive-screen'

const AnimatedImage = Animated.createAnimatedComponent(Image)

const flag2Height = hp("6%") * 2.5

const HeaderSideLi = ({name,content,isTheFirst,lang}) => {

const [isActive,setIsActive] = useState(false);

const [contentHeight,setContentHeight] = useState(0);

const {isFlagClicked,setIsFlagClicked} = lang;

const animatedContentHeight = useAnimatedStyle(() => {
   const extra = isFlagClicked ?  flag2Height : 0
   return {
    
      height: withTiming(
         isActive ? contentHeight  + extra : 0,
         { duration: 300 }
      ),
      overflow:  "hidden"
   };
});

const animatedArrow = useAnimatedStyle(()=>{

    return{
        transform : [{rotateZ : withTiming(isActive ?  "90deg" : "0deg",{duration : 200})}]
    };
})  

 return (
    <View style = {[styles.bigContainer , {marginTop : isTheFirst ? hp("13%") : 0}] }  >
    <Pressable style = {styles.pressable} onPress={()=>{setIsActive(!isActive)}}>
      <AnimatedImage source={require("@/assets/arrow.png")} style = {[animatedArrow,styles.arrowIcon]}/> 
      <Text style = {styles.name}>{name}</Text>
    </Pressable>
    
    <Animated.View style={{ position: "absolute", opacity: 0, zIndex: -1 }} onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)} >
       { content}
    </Animated.View>

    <Animated.View style = {animatedContentHeight}>
       { content}
    </Animated.View>
    
    </View>
  )
}

export default HeaderSideLi

const styles = StyleSheet.create({
    name : {
        fontSize : 25,
        fontWeight : "500",
        color : "white",
    },
    pressable : {
        alignSelf : "flex-start",
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "center",
        gap : 5,
        marginBottom : hp("2%")
    },
    arrowIcon : {
        width : wp("6%"),
        height : hp("3%"),
        resizeMode : "contain"
    } , 
    bigContainer : {
         marginBottom : hp("1%"),
         overflow :"hidden",
    }
})
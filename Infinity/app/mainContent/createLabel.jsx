import { StyleSheet, Text, View ,ScrollView, TextInput, Pressable , FlatList , NativeModules} from 'react-native'
import React, { useState , useRef , useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from "@/components/Header"
import { useTranslation } from 'react-i18next'
import { widthPercentageToDP as wp , heightPercentageToDP as hp }  from 'react-native-responsive-screen'
import Animated ,{ useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useTheme } from '../../context/themeContext';
import getApi from "@/utils/api.js"
import Toast from 'react-native-toast-message';

const {SunmiCustom} = NativeModules;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const labelUp = hp("3.2%");
const labelDown = -hp("1.1%");


const createLabel = () => {

  const { isDark} = useTheme() ?? false

  

  const [isFocusedMofiy,setIsFocusedModify] = useState(false)

  const [isModifying,setIsModifying] = useState(false)

  const apiRef = useRef(null);
  const [codeBare , setCodeBare] = useState("");
  useEffect(() => {
    const initApi = async () => {
      apiRef.current = await getApi();
    };
    initApi();
  }, []);


  const inputAnimationModify = useAnimatedStyle(()=>{
    
    return{
      borderColor : withTiming( isFocusedMofiy  ?  "#0398D5" : (isDark ?  "white" : "#333"),{duration : 300}),
  
    };
    
  })

  const modifyPanel = useAnimatedStyle(() => {
    
      return {
          opacity: withTiming(isModifying ? 1 : 0, { duration: 420 }),
          
      }
  })


  const labelAnimationModify = useAnimatedStyle(()=>{
    
    return {
      color : withTiming( isFocusedMofiy ? "#0398D5"  : (isDark ?  "white" : "#333"),{duration : 300}),
      backgroundColor : isDark ?  "rgba(0,0,0,0.85)" : "rgba(245, 245, 245, 0.85)",
    };

  })


 const theme = StyleSheet.create({
      h1 : {
        color :   isDark ? "white" : "black",
      },
      input : {
        backgroundColor : isDark ? "#242424" : "whitesmoke",
        color : isDark ? "white" : "#333"
      },
      label : {
        backgroundColor : isDark ? "#242424" : "whitesmoke",
      }, 
      buttonText : {
        color : isDark ? "white" : "#333"
      },
      modifyContainer : {
            backgroundColor : isDark ?  "rgba(0,0,0,0.85)" : "rgba(245, 245, 245, 1)",
            borderColor : isDark ?  "white" : "#333",
          },
      productName : {
            color : isDark ? "white" : "#333",
          },
      inputModify : {
        backgroundColor : isDark ?  "rgba(0,0,0,0.85)" : "rgba(245, 245, 245, 1)",
        color : isDark ? "white" : "#333"
      },
      button : {
        backgroundColor : isDark ? "#0676b9" : "#0398D5"
      }
  })
  const { t } = useTranslation(); 

  const [isFocused,setIsFocused] = useState(false)

  

  

  const labelAnimation = useAnimatedStyle(()=>{

    return {
      top: withTiming(isFocused || codeBare ?  labelDown :  labelUp, { duration: 200 }),
      fontSize: withTiming(isFocused || codeBare  ? 12 : 17, { duration: 200 }),
      color : withTiming( isFocused ? "#0398D5"  : (isDark ?  "white" : "#333"),{duration : 300}),
  
    };

  })

  

  const inputAnimation = useAnimatedStyle(()=>{
    
    return{
      borderColor : withTiming( isFocused  ?  "#0398D5" : (isDark ?  "white" : "#333"),{duration : 300}),
  
      
    };
    
  })
  const [quantity, setQuantity] = useState(1);

  const handleGetLabelData = async () => {
    const api = apiRef.current;


    if (!api) return;

    if (!codeBare.trim()) {
        return Toast.show({ type: "error", text1: t("modifyNotif.emptyBarCode")});
    }

    try {
        const demande = await api.post(`/product/createLabel`, { codeBar: codeBare });
        if (demande.status === 200 && demande.data){
            const product = demande.data;

            const contenu = parseFloat(parseFloat(product.contenu).toFixed(3)).toString();
            let price = parseFloat(parseFloat(product.uprice_wt)).toFixed(2);
            const pricePerKgL = parseFloat((price / parseFloat(product.contenu)).toFixed(2)).toString();
            price = price.toString();
          
            
            const infos = {
                "barcodeValue" : codeBare,
                "productName" : product.lib_prd,
                "refCode" : product.ref_prd,
                "uniteType" : product.unite_contenu,
                "contenu" :contenu,
                "pricePerKgL" : pricePerKgL,
                "price" : price,
                "currency" : "€"
            }

            await SunmiCustom.print(infos);
            
        } else {
            Toast.show({ type: "error", text1: t("modifyNotif.invalidBarCode") });
        }

    } catch (e) {
        Toast.show({ type: "error", text1: t("modifyNotif.invalidBarCode")});
        console.log(e)
    }
  }
  




  return (
        <SafeAreaView style = {{ flex : 1 ,backgroundColor : isDark ?  "#242424" : "whitesmoke", position : "relative",}}>
            <Header name = {t("Print.name")}></Header>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", justifyContent :  "flex-start", alignItems :  "center"}}>

               
            <Text style = {[styles.h1 , theme.h1]}>{t("Print.h1")}</Text>
            <View style = {[styles.containerInput]}>
              <AnimatedTextInput style = {[styles.input,inputAnimation,theme.input] } 
                  onChangeText={(text) => setCodeBare(text)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={codeBare}
              ></AnimatedTextInput>

              <Animated.Text style={[styles.label, labelAnimation,theme.label]}>{t("Print.label")}</Animated.Text>
            </View>

            <Pressable  onPress={()=>{
              handleGetLabelData();
               
                  
            }} style = {({pressed}) => [
              styles.button,{opacity : pressed ? 0.8 : 1},theme.button
            ]}>
              <Text style = {[styles.buttonText,theme.buttonText]}>{t("Print.button")}</Text>
            </Pressable>

            </ScrollView>
            

        </SafeAreaView>
  )
}

export default createLabel

const styles = StyleSheet.create({
    h1 : {
      fontSize : 28,

      marginTop : hp("8%"),
    },
    input : {
      width : "100%",
      height : "100%",
      paddingLeft : wp("3%"),
      borderRadius : 5,

      borderWidth : 0.5,

      fontSize : 16
    },
    containerInput : {
      marginTop : hp("2.5%"),
      width : wp("80"),
      height : hp("10%"),
     

    },
    label : {
      position : "absolute",

      fontWeight : "500",
      fontSize : 17,
      left : 10,

      paddingRight : 5,
      paddingLeft : 5,
    }, 
    button : {
      width : wp("80%"),
      height : hp("8%"),
      justifyContent : "center",
      alignItems : "center",
      borderRadius : 50,
      marginTop : hp("3%")
    }, 
    buttonText : {
      fontSize : 17,
      fontWeight : "500",
    },
 overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modifyContainer: {
      width: wp("80%"),
      height: hp("45%"),
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    inputModify : {
      width : "80%",
      height : "100%",
      borderRadius : 5,
      borderWidth : 0.5,
      fontSize : 16,
      alignSelf : "center",
      paddingLeft : wp("3%")
    },
    labelModify : {
      position : "absolute",
      fontWeight : "500",
      fontSize : 13,
      left : "16%",
      paddingRight : 5,
    
    }, 
    buttonContainer : {
      flexDirection  : "row",
        justifyContent : "center",
        alignItems : "center",
        gap : wp("3%"),
        marginTop : hp("1.5%")
    },
    buttonModify : {
      width :wp("30%"),
      height : hp("5.5%"),
      justifyContent : "center",
      alignItems : "center",
      borderRadius : 5,
      marginTop : hp("3%"),
      alignSelf : "center"
    },
    productName : {
      fontSize : 22,
      letterSpacing: 0.7,
      color : "white",
      width : "85%",
      textAlign : "center",
      alignSelf : "center",
      marginBottom : hp("3%"),
      fontWeight : "600"

    }
})


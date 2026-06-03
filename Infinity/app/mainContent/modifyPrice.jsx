import { StyleSheet, Text, View ,ScrollView, TextInput, Pressable,Image , Keyboard } from 'react-native'
import React, { useState , useRef , useEffect , useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from "@/components/Header"
import { useTranslation } from 'react-i18next'
import { widthPercentageToDP as wp , heightPercentageToDP as hp }  from 'react-native-responsive-screen'
import Animated ,{ useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useTheme } from '../../context/themeContext';
import { t } from 'i18next'
import getApi from "@/utils/api.js"
import Toast from 'react-native-toast-message';

import { useFocusEffect } from '@react-navigation/native'
import { DeviceEventEmitter } from 'react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const labelUp = hp("3.2%");
const labelDown = -hp("1.1%");




const ModifyPrice = () => {

  const { t } = useTranslation(); 

  const [isFocused,setIsFocused] = useState(false)

  const [isFocusedMofiy,setIsFocusedModify] = useState(false)

  const [isModifying,setIsModifying] = useState(false)
  
  const { isDark} = useTheme() ?? false;

  const [price,setPrice] = useState("");
  const [avoidDuplicate,setAvoidDuplicate] = useState("");
  const [productName,setProductName] = useState("TADIM PEPITE NOIRE GRILLE SALLEE 270GR");
  
  const [codeBare , setCodeBare] = useState("");

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

  const [count,setCount] = useState(1);
  const apiRef = useRef(null);

  useEffect(()=>{console.log(count)},[count])

  useEffect(() => {
    const initApi = async () => {
      apiRef.current = await getApi();
    };
    initApi();
  }, []);

  const isProcessingRef = useRef(false);
  const inputRef = useRef(null);
  const [isProcessing,setIsProcessing] = useState(false);

  const setProcessing = (bool) => {
      isProcessingRef.current = bool;
      setIsProcessing(bool);
  }

const handleModifyPrice_1 = async (codeBare) => {
    const api = apiRef.current;
     if (isProcessingRef.current) return; 
      setProcessing(true);

    if (!api){
        setProcessing(false);
        return;
    };

    if (!codeBare.trim()) {
        setProcessing(false);
        return Toast.show({ type: "error", text1: t("modifyNotif.emptyBarCode")});
    }
   
    try {
        const demande = await api.post(`/product/findProduct`, { codeBar: codeBare });

        if (demande.status === 200 || demande.data) {
            setProductName(demande.data.lib_prd);
            const raw = demande.data.uprice_wt ?? "0";
            const normalizedPrice = raw.toString().replace(",", ".");
            setPrice(parseFloat(normalizedPrice).toFixed(2));
            setAvoidDuplicate(parseFloat(normalizedPrice).toFixed(2));             
            setIsModifying(true);
        } else {
            setProcessing(false);
            Toast.show({ type: "error",   text1: demande.status  ? t(`handleModifyPriceError.${demande.status}`) : t("handleModifyPriceError.unknown")});
        }

    } catch (e) {
        setProcessing(false);
        Toast.show({ type: "error",   text1: demande.status  ? t(`handleModifyPriceError.${demande.status}`) : t("handleModifyPriceError.unknown")});
        
    }
}

const handleModifyPrice_2 = async () => {
    const api = apiRef.current;
    
    if (!api) {
      setProcessing(false);
      return Toast.show({ type: "error", text1: t("modifyNotif.unknown")});
    }

    if (!price.toString().trim() || !price) {
        setProcessing(false);
        return Toast.show({ type: "error", text1: t("modifyNotif.emptyPrice") });
    }


    const regex = /^\d+(\.\d+)?$/; 

    if (!regex.test(price)){
      setProcessing(false);
      return Toast.show({ type: "error", text1: t("modifyNotif.invalidPrice") });
    } 

    const numericPrice = parseFloat(price);

    if (numericPrice > 15000){
      setProcessing(false);
      return Toast.show({ type: "error", text1: t("modifyNotif.quantityPositive")});
    } 
    if (numericPrice < 0) {
      setProcessing(false);
      return Toast.show({ type: "error", text1: t("modifyNotif.quantityNegative") });
    } 

    if(Number(avoidDuplicate) === Number(price)) {
      Toast.show({ type: "success", text1: t("modifyNotif.success")});
      setIsModifying(false);
      setProcessing(false);
      return;
    } 
    try {
        
        const demande = await api.post(`/product/priceChange`, { codeBar: codeBare, price: numericPrice }); 
        if(demande.status == 200){
          Toast.show({ type: "success", text1: t("modifyNotif.success") });
          setIsModifying(false);
        }
        else{
          Toast.show({ type: "error",   text1: demande.status  ? t(`handleModifyPriceError.${demande.status}`) : t("handleModifyPriceError.unknown")});
        }
        

    } catch (e) {
        Toast.show({ type: "error",   text1: demande.status  ? t(`handleModifyPriceError.${demande.status}`) : t("handleModifyPriceError.unknown")});
        console.log(e)
    }finally {

      Keyboard.dismiss();
      requestAnimationFrame(() => {
              if (inputRef.current) {
                  inputRef.current.blur();
              }
          });
      setCodeBare("");
      setProcessing(false);
    }
}


  

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


  const labelAnimationModify = useAnimatedStyle(()=>{
    
    return {
      top: withTiming(isFocusedMofiy || price ?  labelDown :  labelUp, { duration: 200 }),
      fontSize: withTiming(isFocusedMofiy || price  ? 12 : 14, { duration: 200 }),
      color : withTiming( isFocusedMofiy ? "#0398D5"  : (isDark ?  "white" : "#333"),{duration : 300}),
      backgroundColor : isDark ?  "rgba(0,0,0,0.85)" : "rgba(245, 245, 245, 0.85)",
    };

  })


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





  useFocusEffect(
    useCallback(() => {
      const listener = DeviceEventEmitter.addListener('onBarcodeScanned', (barcode) => {
          handleModifyPrice_1(barcode);
      });

      return () => listener.remove();
    }, [])
  );

  return (
        <SafeAreaView style = {{ flex : 1 ,backgroundColor : (isDark ? "#242424" : "whitesmoke") , position : "relative",}}>
            <Header name = {t("Modify.name")}></Header>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", justifyContent :  "flex-start", alignItems :  "center"}}>

               
            <Text style = {[styles.h1,theme.h1]}>{t("Print.h1")}</Text>
            <View style = {styles.containerInput}>

            <View style={styles.inputWrapper}>
              <AnimatedTextInput style = {[styles.input,inputAnimation,theme.input]}
                  onChangeText={(text) => 
                    {
                      if (!isProcessing) {
                        setCodeBare(text);
                      }
                    }}
                  editable={!isProcessing}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={codeBare}
                  ref={inputRef}
              ></AnimatedTextInput>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => {setCodeBare("");}}>
                  <Image
                    source={  isDark ?  require("@/assets/crossDark.png") : require("@/assets/crossLight.png")}
                    style={styles.inputIcon}
                  />
                </Pressable>
            </View>



              <Animated.Text style={[styles.label, labelAnimation,theme.label]}>{t("Print.label")}</Animated.Text>
            </View>

            <Pressable  onPress={()=>{
              handleModifyPrice_1(codeBare);
            }} style = {({pressed}) => [
              styles.button,{opacity : pressed ? 0.8 : 1},theme.button]}>
              <Text style = {[styles.buttonText,theme.buttonText]}
             >{t("Modify.button")}</Text>
            </Pressable>
            
        
            

              

            </ScrollView>
            <Animated.View style = {[modifyPanel,styles.overlay]} 
              pointerEvents={isModifying ? "auto" : "none"}>
                            <View style = {[styles.modifyContainer,theme.modifyContainer]} 

              >
                <Text  style = {[styles.productName, theme.productName ]}>{productName}</Text>
              <View style = {styles.containerInput}>
                <AnimatedTextInput value={price} style = {[styles.inputModify,inputAnimationModify,theme.inputModify]}
                    value={price === 0 ? "" : String(price)} 
                    onChangeText={(text) => setPrice(text)}
                    onFocus={() => setIsFocusedModify(true)}
                    onBlur={() => setIsFocusedModify(false)}

                ></AnimatedTextInput>

                <Animated.Text style={[styles.labelModify, labelAnimationModify,theme.label]}>{t("ModifyPanel.price")}</Animated.Text>
              </View>

              <View style = {styles.buttonContainer}>
                <Pressable  onPress={()=>{
                  
                  handleModifyPrice_2();
                  
                }} style = {({pressed}) => [
                styles.buttonModify,{backgroundColor : pressed ? "#0676b9" : "#0398D5"}
              ]}>
                <Text style = {[styles.buttonText,theme.buttonText]}
              >{t("ModifyPanel.modify")}</Text>
              </Pressable>

                <Pressable  onPress={()=>{
                  setIsModifying(false)
                   }} style = {({pressed}) => [
                  styles.buttonModify,{backgroundColor : pressed ? "maroon" : "#D92243"}
                ]}>
                  <Text style = {[styles.buttonText,theme.buttonText]}
                >{t("ModifyPanel.cancel")}</Text>
                </Pressable>
                
              </View>

              </View>
            </Animated.View>
        </SafeAreaView>
  )
}

export default ModifyPrice

const styles = StyleSheet.create({
    h1 : {
      fontSize : 28,
      marginTop : hp("8%"),
    },
    input : {
      width : "100%",
      height : "100%",
      borderRadius : 5,
      borderWidth : 0.5,
      fontSize : 16,
      paddingLeft : wp("3%")
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

    },
    inputWrapper: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
    },

    inputIcon: {
      width: 15,
      height: 15,
      resizeMode: "contain",
    },
    iconButton: {
      position: "absolute",
      right: wp("5%"),
      width: 25,
      height: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: "100%",
      paddingLeft: wp("3%"),
      paddingRight: wp("12%"), 
      borderRadius: 5,
      borderWidth: 0.5,
      fontSize: 16
    },
})
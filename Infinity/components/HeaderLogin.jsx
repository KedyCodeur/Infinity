import { View, Text , StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LanguageOption from './LanguageOption';
const HeaderLogin = () => {



  return (
     <View style = {Styles.Header}>
       <LanguageOption></LanguageOption>

    </View>
  )
}

export default HeaderLogin


 const Styles = StyleSheet.create({
    Header : {
        backgroundColor : "#0398D5",
         alignItems : "center",
         justifyContent : "center",
         height : hp("7%"),
    },

 })
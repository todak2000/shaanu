import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent, Image } from 'react-native';
import Google from '../assets/images/svgs/google';

type Props = {
    onPress: (e: GestureResponderEvent | any ) => void;
    title: string;
    icon?: boolean;
    color?: string;
    isLoading: boolean;
  }


  const Button = ({ onPress, title, icon, color, isLoading }: Props) => {
    const dynamicStyles = styles(color);
    
    return (
      <Pressable style={dynamicStyles.button} onPress={onPress}>
        {isLoading ? 
        <Text style={dynamicStyles.text}>Connecting ...</Text>
        :
        <>
        <Text style={dynamicStyles.text}>{title}</Text>
        {icon && <Google /> }
        </>
    }
      </Pressable>
    );
  };

const styles = (color: string | any) => StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 3,
    elevation: 3,
    backgroundColor: color || 'black',
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily:"MuseoRegular",
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default Button;

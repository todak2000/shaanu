import React, {useEffect} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Button from '../../components/Button';
import { Formik, FormikHelpers } from 'formik';
import CustomTextInput from '../../components/TextInput';
import { useStore } from '../store';
import { handleSignInAuth } from '../db/apis';
import { SigninSchema } from '../utils/yup';
import { primaryRed, primaryYellow } from '../../constants/Colors';
import { Redirect } from "expo-router";
interface FormValues {
    email: string;
    password: string;
  }

const SigninForm = ({setScreen}: {setScreen: React.Dispatch<React.SetStateAction<number>>}) => {
    const {loading, setLoading, isRegistered, setUserData, theme} = useStore();

    useEffect(() => {
      
    }, [isRegistered])

    // useEffect(() => {
    //   setLoading(false);
    // }, [])
    
    const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
        setLoading(true)
        
        actions.setSubmitting(false);
        handleSignInAuth(values).then(res =>{
          setLoading(false)
          if (res?.statusCode === 200) {
              setUserData(res?.userData)
          }
          else if (res?.statusCode === 404) {
            Alert.alert("Oops! The email does not exist in our databse. Please Signup")
          }
          else if (res?.statusCode === 401) {
            Alert.alert("Oops! You entered an wrong password")
          }
          else {
              Alert.alert("Oops! an error occurred")
          }
          
      })

    }

    if (isRegistered) {
      return <Redirect href={'/(tabs)'}/>
    }    
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{password: '', email: '' }}
        validationSchema={SigninSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <CustomTextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email.toLocaleLowerCase()}
              placeholder="Email"
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
            <CustomTextInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Password"
              isPassword
            />
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
            <View style={styles.middle}/>
            <Button 
                onPress={()=>handleSubmit()} 
                title='Sign in' 
                icon={false}
                color={theme === "dark" ? primaryYellow: 'black'}
                isLoading={loading}
                theme={theme}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={()=>setScreen(2)}>
        <Text style={styles.redirect}>Yet to register? <Text style={styles.yellow}>Sign up Here</Text></Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setScreen(3)}>
        <Text style={styles.redirect}>Forgot your password? <Text style={styles.yellow}>Reset it here</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default SigninForm;

const styles = StyleSheet.create({
    container: {
        width:'70%'
    },
    middle: {
        marginTop: 40,
    },
    error: {
        color: primaryRed,
        fontFamily:'Museo',
        fontSize: 12,
        marginTop:-10
    },
    redirect:{
        marginTop: 20,
        textAlign: 'center',
        color: "#232323",
        fontFamily: "MuseoRegular",
    },
    yellow:{
        color: primaryRed
    }
  });
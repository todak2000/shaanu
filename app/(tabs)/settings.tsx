import { StyleSheet } from 'react-native';
import { useStore } from '../store';
import { Text } from '../../components/Themed';
import Button from '../../components/Button';
import { handleSignOut } from '../db/apis';
import Wrapper from '../../components/Wrapper';
import { primaryYellow } from '../../constants/Colors';
import { router } from 'expo-router';
import OnboardingScreen from '../onboarding';

function SettingsScreenView() {
  const {loading, theme, setLoading, isRegistered} = useStore();

  const SignOut = () => {

    handleSignOut().then(() =>{
      setLoading(false)
      // router.replace('/onboarding')
    })
  }
  console.log('isRegistered: ', isRegistered, 'loading: ', loading)
  // if (!isRegistered) {
  //   return <OnboardingScreen />
  // }
  // else if (!isRegistered && loading){
  //   return <Loader />
  // }

  return (
    <>
      <Text style={styles.title}>Settings Screen</Text>
      <Button 
          onPress={SignOut} 
          title='Sign out' 
          icon={false}
          color={theme === "dark" ? primaryYellow: 'black'}
          isLoading={loading}
          theme={theme}
      />
    </>
  );
}

const SettingsScreen = Wrapper(SettingsScreenView);

export default SettingsScreen;
const styles = StyleSheet.create({

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

import { StyleSheet } from 'react-native';
import { useStore } from '../store';
import { Text } from '../../components/Themed';
import Button from '../../components/Button';
import { handleSignOut } from '../db/apis';
import Wrapper from '../../components/Wrapper';

function SettingsScreenView() {
  const {loading} = useStore();
  return (
    <>
      <Text style={styles.title}>Settings Screen</Text>
      <Button 
          onPress={()=>handleSignOut()} 
          title='Sign out' 
          icon={false}
          color=""
          isLoading={loading}
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

import { StyleSheet } from "react-native";
import { useStore } from "../store";
import { Text, View, TouchableOpacity } from "../../components/Themed";
import Button from "../../components/Button";
import { handleSignOut, handleDeleteAccount, getUserData } from "../db/apis";
import Wrapper from "../../components/Wrapper";
import { primaryRed, primaryYellow } from "../../constants/Colors";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import Card from "../../components/Settings/Card";
import IndicatorLoader from "../../components/IndicatorLoader";
import { wait } from "../utils";
import { useRouter } from "expo-router";
import { saveLocalItem } from "../utils/localStorage";

const title = "Profile";

function SettingsScreenView() {
  const router = useRouter()
  const { authDispatch, setIsLogedIn,  setTheme, theme, curentLoc, userData, getLocation, updateUser, deleteToken, setAlertMessage, setAlertTitle, showAlert  } =
    useStore();
  const [err, setErr] = useState("");
  const [notification, setNotification] = useState<boolean>(userData?.expoPushToken !== "" ? true : false);
  const [deletePrompt, setDeletePrompt] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState(false)
  const [localLoading2, setLocalLoading2] = useState(false)

  useEffect(() => {
    setLocalLoading(false)
    setLocalLoading2(false)
    getUserData(userData?.id as string)(authDispatch)
  },[])

  useEffect(() => {
    wait(5000).then(() => {
      setErr("");
    });
  }, [err]);
  useEffect(() => {
    if (curentLoc === "Searching...") {
      getLocation();
    }
  }, [curentLoc]);

  const SignOut = () => {
    setLocalLoading(true)
    saveLocalItem('isLogedIn', "false").then(()=>setIsLogedIn(false)).catch(()=>{})
    handleSignOut()(authDispatch).then(() => router.push('/onboarding/signin')).catch((err) => {console.log(err)})
    setLocalLoading(false)
  };

  const handleNotification = async (value: string)=>{
    if (value === "activate") {
      setNotification(true)
      await updateUser().then((res: any)=>{}).catch((err:any)=>{console.log(err, 'errr')})
    }
    else{
      setNotification(false)
      await deleteToken().then((res: any)=>{}).catch((err:any)=>{console.log(err, 'errr')})
    }
  }
  
  const handleTheme = (theme: string) => {
    setTheme(theme)
    if (theme === 'dark') {  
      
      saveLocalItem('theme', "dark").then().catch(()=>{
        setTheme('light')
      })
    }
    else {
      saveLocalItem('theme', "light").then().catch(()=>{
        setTheme('dark')
      })
    }
  }
  const DeleteAccount = () => {
    setLocalLoading2(true)
    console.log("delete clicked")
    handleDeleteAccount(userData?.id as string)(authDispatch).then((res) => {
      console.log(res, 'delete reuslt')
      if (res === 501) {
        setAlertMessage("Please signout and login again before you can delete your account")
        setAlertTitle("One more Hurdle!")
        showAlert()
      } else if (res === 200) {
        console.log("done");
        router.push('/onboarding/signin')
      } else {
        setAlertMessage("Oops! an error occurred")
        setAlertTitle("Unknown Error!")
        showAlert()
      }
      setLocalLoading2(false);
    }).catch((err:any)=>{console.log(err, 'errr')});
  };
  const cardArr = [
    {
      id: 1,
      name: "Donated",
      icon: (
        <FontAwesome5
          name="external-link-square-alt"
          size={34}
          color="#7CDBB9"
        />
      ),
      value: userData?.donated || 0,
    },
    {
      id: 2,
      name: "Received",
      icon: (
        <Ionicons name="arrow-undo-outline" size={34} color={primaryYellow} />
      ),
      value: userData?.recieved || 0,
    },
  ];


  return (
    <>
      <View style={[styles.container, {height: '100%'}]}>
      <Text style={styles.title}>{title}</Text>
        <View style={styles.header}>
          <Text
            style={[
              styles.name,
              { color: theme === "dark" ? primaryYellow : "#000" },
            ]}
          >
            {userData?.lastname} {userData?.firstname}
          </Text>
          <Text
            style={[
              styles.email,
              { color: theme === "dark" ? "#ccc" : "#ababab" },
            ]}
          >
            {curentLoc}
          </Text>
        </View>
        <View style={styles.rowFlex}>
          {cardArr.map((card) => {
            return (
              <Card
                key={card.id}
                icon={card.icon}
                value={card.value}
                title={card.name}
              />
            );
          })}
        </View>
        <View>
          <Text style={styles.subTitle}>Account Settings</Text>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <Ionicons
                name="moon"
                size={24}
                color={theme === "dark" ? "#ccc" : "#232323"}
              />
              <Text style={styles.text}>{theme === "dark" ? "Dark Mode" : "Light Mode"}</Text>
            </View>
            { theme === "light" ? 
              <MaterialCommunityIcons
                name="toggle-switch"
                onPress={()=>handleTheme('dark')}
                size={70}
                color={theme === "dark" ? primaryYellow : primaryRed}
              />
              :
              <MaterialCommunityIcons
                name="toggle-switch-off"
                onPress={()=>handleTheme('light')}
                size={70}
                color={theme !== "dark" ? "#ccc" : "#ccc"}
              />
            }
            
            
          </View>
          <View style={styles.row}>
          <View style={styles.rowInner}>
            <Ionicons
              name="ios-notifications-circle"
              size={24}
              color={theme === "dark" ? "#ccc" : "#232323"}
            />
            <Text style={styles.text}>Notification Settings</Text>
          </View>
          { notification ? 
              <MaterialCommunityIcons
                name="toggle-switch"
                onPress={()=>handleNotification("deactivate")}
                size={70}
                color={theme === "dark" ? primaryYellow : primaryRed}
              />
              :
              <MaterialCommunityIcons
                name="toggle-switch-off"
                onPress={()=>handleNotification("activate")}
                size={70}
                color={theme !== "dark" ? "#ccc" : "#ccc"}
              />
            }
          </View>
        </View>
        {localLoading ? 
        <IndicatorLoader />
        :
        <>{!deletePrompt &&
        <Button
          onPress={SignOut}
          title="Sign out"
          icon={false}
          color={theme === "dark" ? primaryYellow : "black"}
          theme={theme}
          isLoading={localLoading}
        />
        }</>
        }
        {deletePrompt ? 
        <>
          {localLoading2 ? 
          <IndicatorLoader />
          :
          <>
          <Text style={styles.err}>{err !== "" ? err : "Are you sure you want to close your account?"}</Text>
          <View style={styles.rowFlex}>
          <TouchableOpacity onPress={DeleteAccount}>
            <Text style={[
                styles.deleteText,
                { color: primaryRed },
              ]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setDeletePrompt(false)}>
            <Text style={[
                styles.deleteText,
                { color: "#4ED884", fontFamily:"MuseoBold" },
              ]}>No</Text>
            </TouchableOpacity>
          </View>
          </>
          }
        </>
      :
        <TouchableOpacity
          onPress={()=>setDeletePrompt(true)}
          style={styles.delete}
        >
          <Text
              style={[
                styles.deleteText,
                { color: theme === "dark" ? "#ffffff50" : primaryRed },
              ]}
            >
              Delete Account
            </Text>
        </TouchableOpacity>
        }
      </View>
    </>
  );
}

const SettingsScreen = Wrapper(SettingsScreenView);

export default SettingsScreen;

const styles = StyleSheet.create({
  deleteText: {
    fontSize: 15,
    fontFamily: "MuseoRegular",
    textAlign: "center",
  },
  err: {
    fontSize: 11,
    fontFamily: "MuseoRegular",
    textAlign: "center",
    color: primaryRed,
    marginTop: 20,
    marginBottom: 20,
  },
  rowFlex: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  delete: {
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: "MuseoBold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "MuseoRegular",
  },
  subTitle: {
    fontSize: 15,
    fontFamily: "MuseoBold",
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: "5%",
  },
  header: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontFamily: "MuseoBold",
  },
  email: {
    fontSize: 14,
    fontFamily: "MuseoRegular",
  },
});


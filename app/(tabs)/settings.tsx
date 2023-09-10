import { StyleSheet, View, Alert } from "react-native";
import { useStore } from "../store";
import { Text, TouchableOpacity } from "../../components/Themed";
import Button from "../../components/Button";
import { handleSignOut, handleDeleteAccount } from "../db/apis";
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

const title = "Profile";

function SettingsScreenView() {
  const { loading, theme, expoPushToken, setLoading, curentLoc, userData, getLocation, updateUser, deleteToken, setExpoPushToken  } =
    useStore();
  const [err, setErr] = useState("");
  const [notification, setNotification] = useState<boolean>(false);
  const [deletePrompt, setDeletePrompt] = useState<boolean>(false);

  useEffect(() => {
    if (expoPushToken !== "") {
      setNotification(true)
    }
  }, [expoPushToken])
  

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
    handleSignOut().then(() => {
      setLoading(false);
    });
  };

  const handleNotification = async (value: string)=>{
    if (value === "activate") {
      setNotification(true)
      await updateUser().then((res: any)=>{
        if (!res?.token && res.statusCode !== 200){
          setNotification(false)
          setExpoPushToken("")
          
        }
      })
    }
    else{
      setNotification(false)
      await deleteToken().then((res: any)=>{
        // console.log(res, 'res')
        if (res !== 200){
          setNotification(true)
          setExpoPushToken(userData?.expoPushToken as string)
        }
      })
    }
  }
  
  const DeleteAccount = () => {
    setLoading(true);
    handleDeleteAccount(userData?.id as string).then((res) => {
      if (res === 501) {
        setErr(
          "Are you sure, you want to delete your account? Please signout and login again before you can delete your account"
        );
      } else if (res === 200) {
        console.log("done");
      } else {
        Alert.alert("Oops! Something went wrong");
      }
      setLoading(false);
    });
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
      
      <View style={styles.container}>
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
        <Button
          onPress={SignOut}
          title="Sign out"
          icon={false}
          color={theme === "dark" ? primaryYellow : "black"}
          theme={theme}
        />

        {deletePrompt ? 
        <>
          <Text style={styles.err}>Are you sure you want to close your account?</Text>
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
        {/* {err !== "" && <Text style={styles.err}>{err}</Text>} */}
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
    paddingBottom: 8,
    marginBottom:10,
    marginTop: 10,
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


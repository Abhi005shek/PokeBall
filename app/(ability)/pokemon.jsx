import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";
import { ScrollView } from "react-native";
import { Modal } from "react-native";
// import { ActivityIndicator } from "react-native-web";

function Pokemon() {
  const { data } = useGlobalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [img, setImg] = useState("");

  // Use a try-catch block to handle parsing errors
  let pokemon = {};
  try {
    pokemon = JSON.parse(data ? data : "{}");
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return (
    <>
      <ScrollView style={{ flex: 1, marginTop: 40, backgroundColor: "black" }}>
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: pokemon.image }}
              style={{ height: 220, width: "60%" }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ transform: "rotate(-30deg)" }}>
              <MaterialIcons
                name="catching-pokemon"
                size={30}
                color={"crimson"}
                style={{ marginRight: 3 }}
              />
            </View>
            <Text style={[{ fontSize: 24, fontFamily: "agbaluma", textTransform: "capitalize", textAlign: "center",color: "white" }]}>
              {pokemon.name}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              marginTop: 5,
              gap: 5,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: 'center'
            }}
          >
            {/* <Text
              style={{ fontWeight: 900, fontFamily: "poppins", color: "white" }}
            >
              About:{" "}
            </Text> */}
            <Text
              style={[styles.description, { flex: 1, textAlign: "center" }]}
            >
              {pokemon.description}
            </Text>
          </View>

          <View
            style={{
              marginTop: 5,
              gap: 5,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {pokemon?.abilities?.map((o, i) => (
              <Text
                key={o + i}
                style={{
                  textTransform: "capitalize",
                  fontFamily: "poppins",
                  color: "white",
                  borderRadius: 20,
                  paddingHorizontal: 5,
                  borderWidth: 1,
                  borderColor: "white",
                }}
              >
                {o}
              </Text>
            ))}
          </View>

          {/* <View style={{flexDirection: 'row', marginTop: 10}}>
          <Text style={{fontWeight: 600, fontFamily: 'poppins', color: 'white'}}>Moves: </Text>
        <View style={{flexDirection: 'row', textTransform: 'capitalize', flexWrap: 'wrap', gap: 2, flexShrink: 1}}>
          {pokemon?.moves?.map((m, i) => <Text key={m+i} style={{backgroundColor: 'grey', color: 'black', padding: 3, textTransform: 'capitalize', borderRadius: 20, fontFamily: 'poppins', color: 'white'}}>{m}</Text>)}
        </View>
        </View> */}
        </View>

        <View style={{ marginLeft: 10, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              fontFamily: "poppins",
              color: "white",
              marginLeft: 6
            }}
          >
            Image Gallery:{" "}
          </Text>
          <View style={{ width: '100%', flexDirection: "row", justifyContent: 'flex-start', flexWrap: "wrap", gap: 10 }}>
            {/* <Image source={{ uri: pokemon.image }} style={{height: 120, width: 120,}} /> */}
            {/* <FlatList/> */}
            {pokemon?.images?.map((p, i) => {
              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    setIsVisible(true);
                    setImg({ p, i });
                  }}
                  style={{width: '30%'}}
                >
                  <Image
                    source={{ uri: p }}
                    style={{
                      height: 120,
                      width: '100%',
                      borderRadius: 6,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      // margin: 6,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isVisible}
        animationType="fade"
        statusBarTranslucent
        transparent
        onRequestClose={() => setIsVisible(false)}
      >
        <View
          style={{
            paddingTop: StatusBar.currentHeight + 20,
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View style={{ marginRight: 6 }}>
            <Text
              onPress={() => setIsVisible(false)}
              style={{
                color: "white",
                textAlign: "right",
                paddingHorizontal: "10%",
              }}
            >
              <Text
                style={{
                  backgroundColor: "",
                  marginRight: 6,
                  padding: 5,
                  fontSize: 18,
                }}
              >
                Go back
              </Text>
            </Text>
          </View>
          <View
            style={{
              borderRadius: 10,
              // backgroundColor: img?.i % 2 === 0 ? "crimson" : "skyblue",
              margin: 0,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: img.p }}
              style={{ height: "40%", width: "70%" }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "stretch",
    backgroundColor: "white",
    // margin: 10,
    padding: 15,
    // borderRadius: 10,
    elevation: 1,
    backgroundColor: "black",
  },

  image: {
    width: "100%",
    height: 300,
    backgroundColor: "crimson",
    marginBottom: 15,
    borderRadius: 6,
  },

  description: {
    // padding: 2,
    // flexShrink: 1,
    color: "white",
    // fontStyle: 'italic',
    fontFamily: "poppins",
    // height: 200,
    // flexWrap: 'wrap',
    // textAlign: 'left', // Ensures the text is aligned evenly
  },

  // name: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   textTransform: "capitalize",
  //   textAlign: "center",
  //   color: "white",
  //   fontFamily: "poppins",
  //   // fontFamily: 'Agbalumo-Regular'
  // },
});

export default Pokemon;

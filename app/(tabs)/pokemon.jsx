import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";

function Pokemon() {
  const { data } = useGlobalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [img, setImg] = useState("");
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use a try-catch block to handle parsing errors
  let pokemon = {};
  try {
    pokemon = JSON.parse(data ? data : "{}");
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  // Fetch the evolution chain when the component mounts or when `pokemon.name` changes
  useEffect(() => {
    if (pokemon.name) {
      const fetchEvolutionChain = async () => {
        try {
          // Fetch Pokémon species data to get the evolution chain URL
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name.toLowerCase()}`
          );
          const speciesData = await speciesResponse.json();

          // Fetch the evolution chain using the URL from species data
          const evolutionChainResponse = await fetch(
            speciesData.evolution_chain.url
          );
          const evolutionChainData = await evolutionChainResponse.json();

          // Extract the evolution chain
          const chain = [];
          let currentChain = evolutionChainData.chain;

          // Traverse the chain to extract all the evolutionary stages
          while (currentChain) {
            chain.push(currentChain.species.name);
            currentChain = currentChain.evolves_to[0]; // Move to next evolution (if any)
          }

          setEvolutionChain(chain); // Store the evolution chain in state
          setLoading(false); // Set loading to false once the data is fetched
        } catch (error) {
          console.error("Error fetching evolution chain:", error);
          setLoading(false);
        }
      };

      fetchEvolutionChain();
    }
  }, [pokemon.name]);

  console.log("Pokemon states: ", data);

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
            <Text
              style={[
                {
                  fontSize: 24,
                  fontFamily: "agbaluma",
                  textTransform: "capitalize",
                  textAlign: "center",
                  color: "white",
                },
              ]}
            >
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
              alignItems: "center",
            }}
          >
            <Text style={[styles.description, { flex: 1, textAlign: "center" }]}>
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

          {/* Evolution chain display */}
          <View style={{ marginTop: 15, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "poppins",
                color: "white",
              }}
            >
              Evolution:
            </Text>
            {loading ? (
              <Text style={{ color: "white" }}>Loading evolution chain...</Text>
            ) : (
              <View style={{flexDirection: 'row', marginBottom: 6, flexWrap: 'wrap'}}>
             { evolutionChain?.map( (p,i) => {
                return <View key={i+p} style={{alignItems: 'center', flexDirection: 'row'}}>
                <Text
                style={{
                  color: "white",
                  fontFamily: 'poppins',
                  textTransform: "capitalize",
                  marginVertical: 2,
                  padding: 4, 
                  borderWidth: 1,
                  // backgroundColor: 'lightgray', 
                  borderColor: 'white',
                  borderRadius: 10,
                }}
                >
                {p}
              </Text>
             { !(evolutionChain.length-1 === i) && <Text style={{color: 'white'}}> → </Text>}
              </View>
              })}
              </View>
              
            )}
          </View>


          {/* Stats */}

          {/* <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Stat</Text>
          <Text style={styles.tableHeader}>Value</Text>
        </View>

        {pokemon.stats?.map((stat, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{stat.stat.name.toUpperCase()}</Text>
            <Text style={styles.tableCell}>{stat.base_stat}</Text>
          </View>
        ))}
      </View> */}



          {/* Image Gallery */}
          <View style={{ marginLeft: 10, marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "poppins",
                color: "white",
                marginLeft: 6,
              }}
            >
              Image Gallery:{" "}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {pokemon?.images?.map((p, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setIsVisible(true);
                    setImg({ p, i });
                  }}
                  style={{ width: "30%" }}
                >
                  <Image
                    source={{ uri: p }}
                    style={{
                      height: 120,
                      width: "100%",
                      borderRadius: 6,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  />
                </Pressable>
              ))}
            </View>
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
    padding: 15,
    backgroundColor: "black",
  },

  description: {
    color: "white",
    fontFamily: "poppins",
  },


  table: {
    // backgroundColor: 'white',
    // borderRadius: 10,
    padding: 15,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
    flex: 1,
  },
  tableCell: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
    flex: 1,
    textAlign: 'center',
  },
});

export default Pokemon;

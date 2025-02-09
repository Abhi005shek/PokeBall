import { Link } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { storeData, getData } from "../../storage/helper";

export default function Index() {
  const [pokemonList, setPokemonList] = useState([]);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [data, setdata] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);

  const fetchPokemonDetails = async (pokemonUrl) => {
    try {
      const response = await fetch(pokemonUrl);
      const data = await response.json();

      // Fetch Pokémon species data to get the description
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      // Extract the English description (flavor text entry)
      const description =
        speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        )?.flavor_text || "No description available";

      const images = [
        data.sprites.front_default,
        data.sprites.back_default,
        data.sprites.front_shiny,
        data.sprites.back_shiny,
        data.sprites.front_female,
        data.sprites.back_female,
        data.sprites.front_shiny_female,
        data.sprites.back_shiny_female,
        data.sprites.other.dream_world.front_default,
        data.sprites.other.dream_world.front_female,
        data.sprites.other.home.front_default,
        data.sprites.other.home.front_female,
        data.sprites.other.home.front_shiny,
        data.sprites.other.home.front_shiny_female,
        data.sprites.other["official-artwork"].front_default,
      ].filter(Boolean);

      // Extract moves
      const moves = data.moves?.map((move) => move.move.name);

      return {
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        images,
        abilities: data.abilities.map((ability) => ability.ability.name),
        description,
        moves,
      };
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const fetchPokemons = async (limit = 20, offset = 0) => {
    try {
      setIsLoadingPokemon(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      // Fetch detailed data for each Pokémon asynchronously
      const pokemonDataPromises = data.results.map((pokemon) =>
        fetchPokemonDetails(pokemon.url)
      );

      const pokemonData = await Promise.all(pokemonDataPromises);
        // storeData("pokemonList", JSON.stringify([...localdata, ...pokemonData]));
      setPokemonList((p) => {
        return [...p, ...pokemonData];
      }); // Set the fetched Pokémon data
      // } else {
      //   setPokemonList(localdata);
      // }
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
    } finally {
      setIsLoadingPokemon(false);
    }
  };

  function onRefresh() {
    setLimit((p) => p + 20);
    setOffset((p) => p + 20);
    fetchPokemons(20, offset + 20);
  }

  useEffect(() => {
    (async () => {
      const data = JSON.parse(await getData("pokemonList"));
      if (!data || data.length == 0) {
        fetchPokemons();
      }
    })();
  }, []);

  //  Header
  const renderHeader = () => {
    return (
      <View style={{ alignItems: "flex-start", paddingVertical: 0 }}>
        <Image
          style={{ height: 60, width: 120 }}
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/027/127/591/original/pokemon-logo-pokemon-icon-transparent-free-png.png",
          }}
        />
      </View>
    );
  };

  // Empty COmponent
  const renderEmptyList = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>No Pokemon found</Text>
      </View>
    );
  };

  // Footer
  const renderFooter = () => {
    return isLoadingPokemon ? (
      <View style={{ marginVertical: 6, height: 40 }}>
        <ActivityIndicator size={"large"} />
      </View>
    ) : (
      <View style={{ marginVertical: 6, height: 40, alignItems: "center" }}>
        <Text style={{ color: "grey" }}>End of the List</Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item, index }) => {
    return (
      <Link
        style={{ flex: 1, margin: 15, marginTop: 4 }}
        href={`/pokemon?data=${encodeURIComponent(
          JSON.stringify({ ...item, index })
        )}`}
      >
        <View style={styles.listItem}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              // marginRight: 12,
              // backgroundColor: index % 2 === 0 ? "orange" : "skyblue",
              backgroundColor: index % 2 === 0 ? "crimson" : "skyblue",
              borderRadius: 5,
              // paddingHorizontal: 5,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ height: 130, width: 150 }}
            />
          </View>
        </View>
      </Link>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index}
        ItemSeparatorComponent={() => <View style={{ height: 2 }}></View>}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        // ListFooterComponent={() => <View><Text style={{marginVertical: 20, color: 'grey', textAlign: 'center'}}>End of the list</Text></View>}
        // refreshing={refresh}
        // onRefresh={onRefresh}
        onEndReached={onRefresh}
        onEndReachedThreshold={0.3}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        numColumns={3}
      />

      <Modal
        visible={isVisible}
        statusBarTranslucent
        transparent
        onRequestClose={() => setIsVisible(false)}
      >
        <View
          style={{
            paddingTop: StatusBar.currentHeight + 20,
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <View>
            <Text
              onPress={() => setIsVisible(false)}
              style={{
                textAlign: "right",
                paddingHorizontal: "10%",
                fontWeight: "bold",
              }}
            >
              <Text
                style={{ backgroundColor: "white", padding: 2, fontSize: 20 }}
              >
                X
              </Text>
            </Text>
          </View>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: data?.index % 2 === 0 ? "orange" : "skyblue",
              margin: 50,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: data?.image }}
              style={{ height: "70%", width: "100%" }}
            />
            <Text
              style={{
                fontSize: 35,
                fontWeight: "bold",
                color: "white",
                textTransform: "capitalize",
              }}
            >
              {data?.name}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    // backgroundColor: 'black',
    // padding: 15,
    fontFamily: "",
    fontSize: 25,
    // borderWidth: 2,
    // borderColor: 'grey',
    backgroundColor: "white",
    // flexDirection: 'row',
  },
});

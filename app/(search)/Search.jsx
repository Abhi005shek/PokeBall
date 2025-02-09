import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { TextInput } from "react-native";

const demoData = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Jigglypuff",
  "Gengar",
  "Eevee",
  "Snorlax",
  "Mewtwo",
  "Dragonite",
  "Lucario",
  "Greninja",
];

function Search() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Pokémon Data
  const fetchPokemonData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
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
        // data.sprites.other.dream_world.front_default,
        // data.sprites.other.dream_world.front_female,
        data.sprites.other.home.front_default,
        data.sprites.other.home.front_female,
        data.sprites.other.home.front_shiny,
        data.sprites.other.home.front_shiny_female,
        data.sprites.other["official-artwork"].front_default,
      ].filter(Boolean);

      // Extract moves
      const moves = data.moves?.map((move) => move.move.name);

      const d = {
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        images,
        abilities: data.abilities.map((ability) => ability.ability.name),
        description,
        moves,
      };
      // console.log("Pokemon: ", d);

      setPokemonData(d);
    } catch (err) {
      // setError(err.message);
      setError("No Pokemon Found");
      setPokemonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pokemonName) {
      setTimeout(() => fetchPokemonData(), 200);
    }
  }, [pokemonName]);

  // console.log(isLoading, error, pokemonData, pokemonName);

  return (
    <View style={{ marginTop: 20, marginHorizontal: 10 }}>
      <View
        style={{
          borderRadius: 30,
          padding: 6,
          paddingHorizontal: 20,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Search..."
          style={{ flex: 1 }}
          value={pokemonName}
          onChangeText={setPokemonName}
        />
        <View>
          <FontAwesome name="search" size={24} color="black" />
        </View>
      </View>

      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 24 }}>Popular Searches</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            marginTop: 5,
            flexWrap: "wrap",
          }}
        >
          {demoData.map((p, i) => (
            <Text
              onPress={() => setPokemonName(p)}
              key={p + i}
              style={{
                backgroundColor: "grey",
                color: "white",
                borderRadius: 20,
                padding: 6,
              }}
            >
              {p}
            </Text>
          ))}
        </View>
      </View>

      {isLoading && (
        <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) }

      {!isLoading && pokemonData && pokemonName?.length > 0 && error?.length > 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            width: 700,
            backgroundColor: "grey",
            marginTop: 250,
          }}
        >
          <Text>No Pokémon Found</Text>
        </View>
       ) : null}

      {!isLoading && pokemonData && (
        <Link
          style={{ marginTop: 4 }}
          href={`/pokemon?data=${encodeURIComponent(
            JSON.stringify({ ...pokemonData, index: 1 })
          )}`}
        >
          <View style={{ marginTop: 50, width: 130, borderRadius: 10 }}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',  backgroundColor: "skyblue",}}>
              <Image
                source={{ uri: pokemonData?.image }}
                style={{
                  height: 150,
                  width: 150,
                 
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: "white",
                borderRadius: 0,
                padding: 5,
                alignItems: "center",
                // width: 130
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  textTransform: "capitalize",
                }}
              >
                {pokemonData?.name}
              </Text>
              <Text style={{ flexWrap: "wrap", textTransform: 'capitalize' }}>
                {pokemonData?.abilities?.length > 4
                  ? pokemonData?.abilities.slice(0, 3).join(", ") + "..."
                  : pokemonData?.abilities.join(", ")}
              </Text>
            </View>
          </View>
        </Link>
      )}
    </View>
  );
}

export default Search;

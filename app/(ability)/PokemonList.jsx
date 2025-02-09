import { Link, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import {storeData, getData} from '../../storage/helper'

function PokemonList() {
        const [pokemonList, setPokemonList] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const windowDimension = useWindowDimensions();
        const {name} = useGlobalSearchParams();
  // console.log("ability : ", name)
  // Function to fetch Pokémon details
const fetchPokemonDetails = async (pokemonName) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data = await response.json();

        // Fetch Pokémon species data to get the description
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Extract the English description (flavor text entry)
        const description = speciesData.flavor_text_entries.find(
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
            data.sprites.other['official-artwork'].front_default,
        ].filter(Boolean);

        // Extract moves
        const moves = data.moves?.map((move) => move.move.name);

        return {
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
            images,
            abilities: data.abilities.map((ability) => ability.ability.name),
            description,
            moves,
        };
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
};

// Function to fetch Pokémon names by ability
const fetchPokemonByAbility = async (abilityName) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName?.toLowerCase()}`);
        const data = await response.json();
        return data.pokemon.map(p => p.pokemon.name);
    } catch (error) {
        console.error("Error fetching Pokémon by ability:", error);
        return [];
    }
};

// Function to fetch Pokémon details by ability
const fetchPokemonDetailsByAbility = async (abilityName) => {
    try {
        setIsLoading(true);
        const pokemonNames = await fetchPokemonByAbility(abilityName);
        // Fetch detailed data for each Pokémon asynchronously
        const pokemonDetailsPromises = pokemonNames.map((pokemonName) => fetchPokemonDetails(pokemonName));

        // Wait for all Pokémon data to be fetched
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        
        // console.log("Pokémon Details: ", pokemonDetails);
        storeData('abilityData', JSON.stringify(pokemonDetails));
        setPokemonList(pokemonDetails)
        
        // Return the Pokémon details
        return pokemonDetails;
    } catch (error) {
        console.error("Error fetching Pokémon details by ability:", error);
        return [];
    } finally{
        setIsLoading(false);
    }
};
   
  useEffect(() => {
    (async () => {
      const data = JSON.parse(await getData('abilityData') || '[]');
      if(name && !data || !data.length){
        fetchPokemonDetailsByAbility(name);
        }
    })();    
  },[name])



  const renderItem = ({ item, index }) => {
    return (
      <Link 
      style={{flex:1, margin: 15, marginTop: 5}}
      href={`/pokemon?data=${encodeURIComponent(JSON.stringify({...item, index}))}`}
      >
      <View style={[{width: '100%'}, styles.listItem]}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            // marginRight: 12,
            // backgroundColor: index % 2 === 0 ? "orange" : "skyblue",
            backgroundColor: index % 2 === 0 ? "#d6336c" : "#ffa94d",
            borderRadius: 5,
            width: '100%',
            // paddingHorizontal: 5,
          }}
          >
          <Image source={{ uri: item.image }}  style={{ height: 150, width: '120%', 
            overflow: 'visible'
             }} />
        </View>

        {/* <View style={{ alignItems: "stretch", }}>
          <Text style={{fontSize: 18 }}>
            <Text style={{ fontWeight: "bold" }}>Name: </Text>{item.name}
          </Text>
          <Text style={{ fontSize: 17,flexWrap: 'wrap' }}>
            <Text style={{ fontWeight: "bold" }}>Abilities: </Text>{item.abilities.join(", ")}
          </Text>
          
          <Text style={{flexWrap: 'wrap' }}>
            <Text style={{ fontWeight: "bold" }}>Description: </Text>{item.description}
          </Text>
        </View> */}
      </View>
          </Link>
    );
  };

  if(isLoading){ 
    return <View style={{flex:1, margin: 15, marginTop: 55}}><ActivityIndicator size={'large'}/></View>
  }


  // Empty COmponent 
const renderEmptyList = () => {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30}}><Text style={{textAlign: 'center'}}>No Pokemon found</Text></View>
  }
  
  // Footer
//   const renderFooter = () => {
//     return isLoading ? <View style={{marginVertical: 6, height: 40}}><ActivityIndicator size={'large'} /></View> : null;
//   }
    

  return (
    <View style={{flex: 1}}>
    <Text style={{ fontFamily: 'agbaluma', marginLeft: 18, marginTop: 35, marginBottom: 15, textTransform: 'capitalize', fontSize: 20, fontWeight: 700, textAlign: 'center',}}>{name} </Text>
      <FlatList
        data={pokemonList} 
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index}
        ItemSeparatorComponent={() => <View style={{height: 2}}></View>}
        // ListHeaderComponent={renderHeader}  
        ListEmptyComponent={renderEmptyList}
        // ListFooterComponent={renderFooter}
        ListFooterComponent={() => <View><Text style={{marginVertical: 20, color: 'grey', textAlign: 'center'}}>End of the list</Text></View>}
        // refreshing={refresh}
        // onRefresh={onRefresh}
        // onEndReached={onRefresh}
        initialNumToRender={30}
        numColumns={windowDimension.width >= 600 ? 4 : windowDimension.width <= 350 ? 2 : 3}

        />
    </View>
  )
}


const styles = StyleSheet.create({
    listItem: {
      // backgroundColor: 'black',
      // padding: 15,
      fontFamily: '',
      fontSize: 25,
      // borderWidth: 2,
      // borderColor: 'grey',
      backgroundColor: 'white',
      // flexDirection: 'row',
    }
  })

export default PokemonList
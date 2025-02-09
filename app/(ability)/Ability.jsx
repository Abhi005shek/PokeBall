import { Link, router, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import { SectionList, StyleSheet, Text, View, ActivityIndicator, Pressable } from "react-native";
import {storeData, getData, removeData} from "../../storage/helper";


const fetchAllAbilities = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/ability?limit=1000");
    const data = await response.json();
    return data.results; // List of all abilities with URLs
  } catch (error) {
    console.error("Error fetching abilities:", error);
  }
};

const groupAbilitiesByFirstLetter = (abilities) => {
  const grouped = abilities.reduce((acc, ability) => {
    const firstLetter = ability.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(ability);
    return acc;
  }, {});

  const sections = Object.keys(grouped).map(letter => ({
    title: letter,
    data: grouped[letter]
  }));

  return sections.sort((a, b) => a.title.localeCompare(b.title));
};

const Abilities = () => {
  const [abilities, setAbilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchAbilities = async () => {
        const ability = JSON.parse(await getData('abilities'));
        try{
            if(!ability?.length){
            const abilitiesList = await fetchAllAbilities();
            storeData('abilities', JSON.stringify(abilitiesList));
            setAbilities(abilitiesList);
            // setIsLoading(false);
          } else {
            setAbilities(ability);
          }
          } catch(error){
        console.log("Error while fetching abilities: ", error)
      } finally{
        setIsLoading(false);
      }
      };
      fetchAbilities();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sections = groupAbilitiesByFirstLetter(abilities);

  return (
    <View style={styles.container}>
    <Text style={[styles.title]}>All Pokémon Abilities</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          // <Link style={{flex: 1, width: '100%'}} href={`/PokemonList?name=${item?.name}`}> 
          <Pressable style={{flex: 1, width: '100%'}} onPress={() => {
            removeData('abilityData');
            router.push(`/PokemonList?name=${item?.name}`)
          }}> 
          <View style={{  backgroundColor: '' }}>
            <Text style={styles.ability}>{item.name}</Text>
          </View>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}

        ListFooterComponent={<View style={{height: 50}}></View>}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
  },
  container: {
    flex: 1,
    // padding: 20,
    // backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 6,
    textAlign: "center",
    backgroundColor: "white",
    fontFamily: 'agbaluma'
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    padding: 5,
    fontFamily: 'poppins'
  },
  ability: {
    fontSize: 18,
    padding: 10,
    textTransform: 'capitalize',
    backgroundColor: 'white',
    // borderRadius: 20,
    
    // margin: 3,
    // color: 'white',
    // backgroundColor: 'orange'
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontFamily: 'poppins'
  },
});

export default Abilities;

import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CharacterStackParamList } from "../../App";

const GET_CHARACTER_DETAIL = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
      }
      location {
        name
      }
      image
      episode {
        id
        name
        episode
      }
    }
  }
`;

interface CharacterDetail {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
  episode: { id: string; name: string; episode: string }[];
}

interface GetCharacterData {
  character: CharacterDetail;
}

interface GetCharacterVars {
  id: string;
}

type CharacterDetailScreenProps = NativeStackScreenProps<
  CharacterStackParamList,
  "CharacterDetail"
>;

export default function CharacterDetailScreen({
  route,
}: CharacterDetailScreenProps) {
  const { id } = route.params;
  const { loading, error, data } = useQuery<GetCharacterData, GetCharacterVars>(
    GET_CHARACTER_DETAIL,
    {
      variables: { id },
    }
  );

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  if (!data?.character)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Character not found.</Text>
      </View>
    );

  const character = data.character;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.characterImage} />
      <View style={styles.content}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{character.status}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Species:</Text>
          <Text style={styles.detailValue}>{character.species}</Text>
        </View>
        {character.type && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{character.type}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{character.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Origin:</Text>
          <Text style={styles.detailValue}>{character.origin?.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Location:</Text>
          <Text style={styles.detailValue}>{character.location?.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Episodes:</Text>
        {character.episode.map((ep) => (
          <Text key={ep.id} style={styles.episodeItem}>
            {ep.episode} - {ep.name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  characterImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  characterName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    color: "#777",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  episodeItem: {
    fontSize: 15,
    color: "#666",
    marginBottom: 5,
    marginLeft: 10,
  },
});

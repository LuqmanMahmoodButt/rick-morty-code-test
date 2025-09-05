import React, { useState } from 'react';

import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { NativeStackNavigationProp, } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CharacterStackParamList } from '../../App';

const GET_CHARACTERS = gql`
query GetCharacters($name: String) {

    characters(filter: { name: $name }) {
    
        results {
            id
            name
            status
            species
            image
        }
    }
}
`;

//

interface Character {
    id: string;
    name: string;
    status: string;
    species: string;
    image: string;
}


interface GetCharactersData {
    characters: {
        results: Character[];
    };
}

//

type CharacterListScreenNavigationProp = NativeStackNavigationProp<
    CharacterStackParamList,
    'CharacterList'
>;

//

export default function CharacterListScreen() {
    const navigation = useNavigation<CharacterListScreenNavigationProp>();
    const [searchText, setSearchText] = useState('');
    const [searchName, setSearchName] = useState<string | undefined>(undefined);

    const { loading, error, data, refetch } = useQuery<GetCharactersData>(GET_CHARACTERS, {
        variables: { name: searchName },
        fetchPolicy: 'cache-and-network',
    });

    const onConfirmSearch = () => {
        const trimmed = searchText.trim();
        const next = trimmed.length > 0 ? trimmed : undefined;
        setSearchName(next);
        refetch({ name: next });
    };

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

//

    const characters = data?.characters?.results || [];

    const renderItem = ({ item }: { item: Character }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('CharacterDetail', { id: item.id })
            }>
            <Image source={{ uri: item.image }} style={styles.characterImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.characterName}>{item.name}</Text>
                <Text style={styles.characterDetail}>
                    {item.status} - {item.species}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search characters..."
                    placeholderTextColor="#999"
                    style={styles.search}
                    autoCorrect={false}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                    returnKeyType="search"
                    onSubmitEditing={onConfirmSearch}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={onConfirmSearch}>
                    <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={characters}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
}

//

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d3d3d3ff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    search: {
        flex: 1,
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        color: '#333',
    },
    searchBtn: {
        backgroundColor: '#005210ff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    searchBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffffff',
        borderRadius: 8,
        marginVertical: 6,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    characterImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    characterName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    characterDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

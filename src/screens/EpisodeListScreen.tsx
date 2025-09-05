



import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';



const GET_EPISODES = gql`
  query GetEpisodes {
    episodes {
      results {
        id
        name
        episode # e.g., "S01E01"
        air_date
      }
    }
  }
`;


interface Episode {
    id: string;
    name: string;
    episode: string;
    air_date: string;
}


interface GetEpisodesData {
    episodes: {
        results: Episode[];
    };
}

export default function EpisodeListScreen() {
    const { loading, error, data } = useQuery<GetEpisodesData>(GET_EPISODES);

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

    const episodes = data?.episodes?.results || [];

    const renderItem = ({ item }: { item: Episode }) => (
        <View style={styles.card}>
            <Text style={styles.episodeName}>{item.name}</Text>
            <Text style={styles.episodeDetails}>
                {item.episode} - {item.air_date}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={episodes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 6,
        marginHorizontal: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    episodeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    episodeDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

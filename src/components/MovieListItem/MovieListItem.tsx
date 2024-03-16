import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Movie } from '@/src/types';

export const deafultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type MoiveListItemProps = {
    movie: Movie;
};

const Card = ({ movie }: MoiveListItemProps) => {
    const { Title, Poster, Plot } = movie;
    return (
        <View style={styles.card}>
            <ImageBackground
                source={{
                    uri: Poster,
                }}
                style={styles.image}>
                <View style={styles.cardInner}>
                    <Text style={styles.title}>{Title}</Text>
                    <Text style={styles.plot}>{Plot}</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '95%',
        height: '95%',
        borderRadius: 10,
        backgroundColor: '#fefefe',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',

        justifyContent: 'flex-end',
    },
    cardInner: {
        padding: 10,
    },
    title: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    plot: {
        fontSize: 18,
        color: 'white',
        lineHeight: 25,
    },
});

export default Card;

// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import MovieCardSwipe from '../../../components/MovieCardSwipe/MovieCardSwipe';
// import { fetchPopularMovies } from '../../../api/TmdbApi';

// export default function Home() {
//     const [movies, setMovies] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchMovies() {
//             try {
//                 const fetchedMovies = await fetchPopularMovies();
//                 setMovies(fetchedMovies);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching movies: ', error);
//                 setLoading(false);
//             }
//         }

//         fetchMovies();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size='large' color='white' />
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* <MovieCardSwipe movies={movies} /> */}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'black',
//     },
// });

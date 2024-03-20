import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MovieCardSwipe from '../../../components/MovieCardSwipe/MovieCardSwipe';
import { fetchPopularMovies } from '../../../api/TmdbApi';

export default function LikedMovieList() {
    return (
        <View>
            <Text>Liked Movies</Text>
        </View>
    );
}

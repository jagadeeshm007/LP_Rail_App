import  {View, StyleSheet} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const LoadingPage = () => {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222',
    },
});

export default LoadingPage;
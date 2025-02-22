import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  const [estaLogado,setEstaLogado] = useState(false);
  
  async function getData() {
    const data = await AsyncStorage.getItem('estaLogado');
    console.log(data, 'data');
    setEstaLogado(data === 'true'); // Converte o valor para booleano
  }
  
  useEffect(() => {
    getData();
  }, []);
  
  useEffect(() => {
    const navigateToLogin = () => {
      console.log('1');
      navigation.reset({
        index: 3,
        routes: [{ name: 'Login' }],
      });
    };
    const navigateToCardapio = () => {
      console.log('2');
      navigation.reset({
        index: 5,
        routes: [{ name: 'Cardapio' }],
      });
    };
  
    console.log(estaLogado, 'estaLogado');
  
    if (estaLogado) {
      const timeoutCardapio = setTimeout(navigateToCardapio, 5000);
      return () => clearTimeout(timeoutCardapio);
    } else {
      const timeoutLogin = setTimeout(navigateToLogin, 5000);
      return () => clearTimeout(timeoutLogin);
    }
  }, [estaLogado]);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://drive.google.com/uc?export=download&id=165TniTnhknyoI4J_tjzfRm0CSuUAtjVv' }}
        style={styles.videoBackground}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBackground: {
    flex: 1,
  },
});

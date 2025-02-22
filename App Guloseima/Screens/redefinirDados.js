import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';

const SugestaoScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [texto, setTexto] = useState('');

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

  const navigateToNome = () => {
    navigation.navigate('MudarNome');
  };

  const navigateToEmail = () => {
    navigation.navigate('MudarEmail');
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsTyping(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsTyping(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) 
        {
          console.log("usuario autenticado");
          console.log("id do usuario " + userId);
        } 
        else 
        {
          console.log("usuario nao autenticado");
          navigateToLogin();
        }
      } 
      catch (error) 
      {
        console.error('Erro ao buscar ID do usuario:', error);
      } 
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!isTyping && (
        <View style={styles.mnsuperios}>
          <TouchableOpacity style={styles.menuButton} onPress={navigation.goBack}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png' }}
              style={styles.iconBack}
            />
          </TouchableOpacity>
          <Image source={require('../assets/Titulo.png')} style={styles.title} />
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
        </View>
      )}

      <View style={styles.tela}>
        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP}>MODIFICAR</Text>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToNome}>
            <Text style={styles.textoBotaoLog}>Nome</Text>
            <Icon name="arrow-forward" size={20} color="#E26A05" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToEmail}>
            <Text style={styles.textoBotaoLog}>Email</Text>
            <Icon name="arrow-forward" size={20} color="#E26A05" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Obrigado pela sugestão!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SugestaoScreen;

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: '6%',
    justifyContent: 'center',
  },
  cardPrincipal: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  titleCP: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    paddingBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    backgroundColor: '#c7c7c7',
    borderRadius: 5,
    padding: 10,
    marginVertical: '4%',
    minHeight: 40,
  },
  botaoLog: {
    width: '100%',
    marginHorizontal: '1%',
    marginVertical: 10,
    borderRadius: 7,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cfcfcf',
    backgroundColor: 'white',
    opacity: '90%',
  },
  textoBotaoLog: {
    fontWeight: '700',
    fontSize: 20,
    
  },
  mnsuperios: {
    backgroundColor: '#E26A05',
    width: '100%',
    height: '11%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  menuButton: {
    position: 'absolute',
    top: '100%',
    left: '7%',
  },
  iconBack: {
    width: 26,
    height: 26,
    left: '10%',
    top: '10%',
    position: 'absolute',
    tintColor: 'white',
    transform: [{ rotate: '180deg' }],
  },
  title: {
    position: 'absolute',
    width: '36%',
    height: '40%',
    bottom: '35%',
    left: '33%',
    marginRight: '10%',
  },
  logo: {
    position: 'absolute',
    width: '10%',
    right: '5%',
    height: '80%',
    bottom: '10%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

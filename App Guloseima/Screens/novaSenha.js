import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { isAuthenticated } from '../autent';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NovaSenhaScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); 
  const [modalVisible, setModalVisible] = useState(false); 

  const navigateToConta = () => {
    navigation.navigate('Conta');
  };

  const navigateToCodigo = () => {
    navigation.navigate('CodigoSenha');
  };

  const scrollToInput = () => {
    scrollViewRef.current.scrollTo({ y: 100, animated: true }); 
  };

  const [valorSenha, setSenha] = useState('');

  const handleNovaSenha = async () => {
    try {
        const response = await axiosInstance.post('/redefinirSenha.php', {
          senha: valorSenha,
          id: await AsyncStorage.getItem('userId')
        });
  
        console.log(response);
  
        if (response.status === 200) {
          alert("Senha alterada com sucesso!");
        }
      }
  
      catch (error) {
        console.error('Erro ao alterar senha:', error);
        alert("Algum erro ocorreu, tente novamente.");
      }
    setModalVisible(true);
  };

  useEffect(() => {
    const obterEstudanteId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setEstudanteId(id);
      console.log("id do usuario " + id);
    };

    const carregarDados = async () => {
      try 
      {
        const usuarioResponse = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
        if (usuarioResponse.status === 200) 
          {
            setUsuarios(usuarioResponse.data);
            console.log(usuarioResponse.data)
          }
          setCarregando(false);
        } 

      catch (error) 
      {
        console.error('Erro ao carregar usuario: ', error);
        setUsuarios([]); 
        setCarregando(false);
      }
    };

    obterEstudanteId();
    carregarDados();
  },
   []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/splash.jpg')}
        style={styles.back}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.textTitle}>Redefinir senha</Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>
              <Text style={{ paddingTop: '2%', fontSize: 17, left: 2 }}>
                O código foi confirmado corretamente! Agora redefina sua senha.
              </Text>

              <Text style={styles.txtName}>NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput} 
                secureTextEntry={true}
              />
              <Text style={styles.txtName}>CONFIRME SUA NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput} 
                secureTextEntry={true}
                value={setSenha}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToCodigo}>
            <Image
              style={{
                transform: [{ rotate: '180deg' }],
                width: 30,
                height: 30,
                marginHorizontal: 10,
                tintColor: '#E26A05',
                position: 'absolute',
                left: 0,
              }}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
            <Text style={styles.textoBotaoLog}>   Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={handleNovaSenha}>
            <Image
              style={styles.iconOpt2}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
            <Text style={styles.textoBotaoLog}>Redefinir</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Senha redefinida com sucesso!</Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setModalVisible(false);
              navigateToConta();
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default NovaSenhaScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: 'white',
    padding: '10%',
    width: '100%',
    borderTopRightRadius: 100,
    position: 'absolute',
    bottom: 0,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: '4%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '10%',
  },
  txtName: {
    marginTop: '3%',
    fontSize: 18,
    fontWeight: '700',
    left: 2,
  },
  input: {
    marginVertical: '3%',
    backgroundColor: '#e8e8e8',
    padding: '3%',
    paddingHorizontal: '3%',
    borderRadius: 10,
    fontWeight: '700',
    color: 'black',
  },
  iconOpt2: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
    tintColor: '#E26A05',
  },
  botaoLog: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: 10,
    borderRadius: 7,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  textoBotaoLog: {
    fontSize: 17,
    marginLeft: 20,
  },
  textTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 28,
    marginTop: '5%',
    marginBottom: '10%',
  },
  back: {
    flex: 1,
    height: '55%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    left: '25%',
    top: '40%',
    height: '20%',
    width: '50%',
    padding: '5%',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 20,
  },
  modalBtn: {
    width: '100%',
    alignItems: 'center',
    fontSize: 22,
    color: 'white',
    padding: '10%',
    borderRadius: 10,
    backgroundColor: '#E26A05',
  },
});

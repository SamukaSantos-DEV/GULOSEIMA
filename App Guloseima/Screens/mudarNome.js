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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../autent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const MudarNomeScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [valorNome, setNome] = useState('');
  const [estudanteId, setEstudanteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const navigateToConta = () => {
    navigation.navigate('Conta');
  };

  const scrollToInput = () => {
    scrollViewRef.current.scrollTo({ y: 100, animated: true });
  };

  useEffect(() => {
    const obterEstudanteId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setEstudanteId(id);
      console.log("id do usuario " + id);
    };

    const carregarDados = async () => {
      try {
        const usuarioResponse = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
        if (usuarioResponse.status === 200) {
          setUsuarios(usuarioResponse.data);
          console.log(usuarioResponse.data);
        }
      }

      catch (error) {
        console.error('Erro ao carregar usuario: ', error);
        setUsuarios([]);
      }
    };

    obterEstudanteId();
    carregarDados();
  }, [])

  const handleNovoNome = async () => {
    if(valorNome){
    try {
      const id = await AsyncStorage.getItem('userId');
      const changeResponse = await axiosInstance.post('/mudarNome.php', {
        id: id,
        nome: valorNome,
      });

      if (changeResponse.status === 200) {
        setNome('');
        setModalVisible(true);
      } else {
        alert("Ocorreu um erro ao tentar redefinir o Nome.");
      }
    } catch (error) {
      console.error('Erro ao verificar ou redefinir nome:', error);
      alert("Ocorreu um erro ao tentar redefinir o nome.");
    }
  } else{alert("Por favor, preencha os campos.")}
  };



  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/splash.jpg')}
        style={styles.back}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.textTitle}>Redefinir Nome</Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>

              <Text style={styles.txtName}>Novo Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput}
                onChangeText={setNome}
                value={valorNome}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToConta}>
            <Icon name="arrow-back" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}> Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={handleNovoNome}>
            <Icon name="check" size={24} color="#E26A05" />
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
          <Text style={styles.modalText}>Nome redefinido com sucesso!</Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setModalVisible(false);
              navigateToConta();
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>OK!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MudarNomeScreen;

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
    borderColor: '#fff',
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
    fontSize: 17,
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
    height: '70%',
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

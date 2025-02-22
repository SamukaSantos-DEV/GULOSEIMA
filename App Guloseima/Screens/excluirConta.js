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
import axiosInstance from '../autent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const NovaSenhaScreen = (setCorreto) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [valorCodigo, setCodigo] = useState('');
  const [valorRandom, setRandom] = useState('');
  const [estudanteId, setEstudanteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [saldo, setSaldo] = useState(0); // Saldo inicial como 0
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [valorEmail, setEmail] = useState('');

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

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
        const id = await AsyncStorage.getItem('userId');
        const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${id}`);
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          const usuario = response.data[0];
          setSaldo(parseFloat(usuario.saldo)); // Atualiza o saldo do usuário
          console.log("saldo: " + saldo);
        }
      } catch (error) {
        console.error('Erro ao carregar saldo:', error);
        setSaldo(0);
      }
    };

    obterEstudanteId();
    carregarDados();
  }, []);

  useEffect(() => {
    EnviarEmail();
  }, [])

  const VerificaCodigo = async () => {
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    let valorEmail = response.data;
    const email = valorEmail[0];
    console.log("email: ", email.email);

    try {
      const response = await axiosInstance.post('/verificarCodigo.php', {
        valorCodigo: valorCodigo,
        email: email.email
      });
      if (response.status === 200) {
        setCorreto = true;
        handleNovaSenha();
      }
      else {
        alert("Insira o código corretamente.");
        setCorreto = false;
      }
    }
    catch (error) {
      console.log("Erro ao verificar codigo: ", error);
      alert("Insira o código corretamente.");
    }
  };

  const EnviarEmail = async () => {
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    let valorEmail = response.data;
    const email = valorEmail[0];
    console.log("email: ", email.email);
    console.log("Email:", valorEmail);
    // Verifica se os campos estão preenchidos
    if (email.email) {
      try {
        // Faz a requisição ao servidor Node.js para enviar o e-mail e gerar o código
        const response = await axios.post('http://192.168.1.104:3000/enviar-email', {
          to: email.email,
          subject: 'Assunto do e-mail',
        });

        console.log("Resposta do servidor:", response.data); // Log da resposta

        // Verifica se o e-mail foi enviado com sucesso
        if (response.status === 200) {
          console.log('E-mail enviado com sucesso');
        } else {
          console.error('Erro ao enviar o e-mail:', response.data);
          alert('Erro ao enviar o e-mail. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao enviar o e-mail. Por favor, tente novamente.");
      }
    } else {
      alert("Por favor, insira todas as informações.");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('estaLogado');
      setUsuarios([]);
      navigation.navigate('Splash');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNovaSenha = async () => {
    setModalVisible(true);   // Só exibe o modal após carregar o saldo
  };

  const handleConfirmarExclusao = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      const changeResponse = await axiosInstance.post('/excluirConta.php', {
        id: id
      });

      if (changeResponse.status === 200) {
        setModalVisible(false);
        logout();


      } else {
        alert("Ocorreu um erro ao tentar excluir a conta.");
      }
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
      alert("Ocorreu um erro ao tentar excluir a conta.");
    }
  };

  const handleCancelarExclusao = () => {
    setModalVisible(false); 
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
            <Text style={styles.textTitle}>Excluir a conta</Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>
              <Text style={{ paddingTop: '2%', textAlign: 'justify', fontSize: 17, left: 2 }}>
                Enviamos um codigo para seu e-mail, digite ele na caixa abaixo e aperte em confirmar:
              </Text>
              <Text style={{ paddingTop: '2%', fontSize: 17, textAlign: 'justify', left: 2 }}>
                Ao momento em que sua conta for deletada, você não poderá mais recuperar seu saldo, tenha certeza do que você está fazendo.
              </Text>

              <Text style={styles.txtName}>CÓDIGO DE CONFIRMAÇÃO</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput}
                secureTextEntry={true}
                onChangeText={(text) => setCodigo(text)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToConta}>
            <Icon name="arrow-back" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}> Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={VerificaCodigo}>
            <Icon name="delete" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}>Excluir </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 18,}}>Você tem certeza que deseja excluir sua conta?</Text>

            {saldo > 0 ? (
              <Text style={styles.saldoMensagem}>
                Você ainda tem {saldo.toFixed(2)} para gastar.
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleConfirmarExclusao}>
                <Text style={{ color: 'green', fontSize: 20, }}>✅</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleCancelarExclusao} >
                <Text style={{ color: 'white', fontSize: 15 }}>❌</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal >
    </View >
  );
};

export default NovaSenhaScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  saldoMensagem: {
    marginVertical: 15,
    fontSize: 15,
    color: 'red', 
    fontWeight: '800',
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
    marginVertical: '4%',
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
    height: '60%',
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
    width: '48%',
    marginHorizontal: '1%',
    alignItems: 'center',
    fontSize: 22,
    color: 'white',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: '5%'
  },
});

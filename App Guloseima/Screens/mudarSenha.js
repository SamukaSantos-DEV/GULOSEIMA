import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ToastAndroid,
  ScrollView,
  Modal,
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
  const [valorSenha, setSenha] = useState('');
  const [valorCodigo, setCodigo] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [estudanteId, setEstudanteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigateToLogin = () => {
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

  useEffect(() => {
    EnviaEmail();
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
      console.log("Erro ao verificar codigo: ", error)
    }
  };

  const sufixo = "@etec.sp.gov.br";

  function terminaCom(string, sufixo) {
    return string.endsWith(sufixo);
  }

  const EnviaEmail = async () => {
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    let valorEmail = response.data;
    const email = valorEmail[0];
    console.log("email: ", email.email);

    // Verifica se os campos estão preenchidos
    if (email.email) {
      // Verifica se o e-mail é institucional (verificação de sufixo)
      if (terminaCom(email.email, sufixo)) {
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
        alert("Insira um e-mail institucional válido.");
        console.log("A string não termina com '" + sufixo + "'");
      }
    } else {
      alert("Por favor, insira todas as informações.");
    }
  }

  const handleNovaSenha = async () => {
    if (valorSenha !== confirmSenha) {
      alert("As senhas não correspondem.");
      return;
    }

    try {
      if (valorSenha.length >= 8) {
        const id = await AsyncStorage.getItem('userId');
        const changeResponse = await axiosInstance.post('/redefinirSenha.php', {
          id: id,
          senha: valorSenha,
        });

        if (changeResponse.status === 200) {
          setSenha('');
          setConfirmSenha('');
          setModalVisible(true);
        } else {
          alert("Ocorreu um erro ao tentar redefinir a senha.");
        }
      }
      else {
        alert("A senha deve ter no mínimo 8 caracteres.");
      }
    } catch (error) {
      console.error('Erro ao verificar ou redefinir senha:', error);
      alert("Ocorreu um erro ao tentar redefinir a senha.");
    }
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
            <Text style={styles.textTitle}>Redefinir Senha</Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>
              <Text style={{ paddingTop: '2%', fontSize: 17, left: 2 }}>
                Enviamos um codigo para seu e-mail, digite ele na caixa abaixo:
              </Text>

              <Text style={styles.txtName}>CÓDIGO DE CONFIRMAÇÃO</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                keyboardType="numeric"
                maxLength={6}                
                secureTextEntry={true}
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput}
                onChangeText={(text) => setCodigo(text)}
              />
              <Text style={styles.txtName}>NOVA SENHA</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: valorSenha.length < 8 && valorSenha.length > 0 ? 'red' : '#ccc', // Muda a cor da borda em caso de erro
                  },
                ]}
                placeholder="********"
                value={valorSenha}
                onChangeText={(text) => {
                  if (text.length <= 20) {
                    setSenha(text.trim());
                  } else {
                    ToastAndroid.show('A senha pode ter no máximo 20 caracteres.', ToastAndroid.SHORT);
                  }
                }}
                placeholderTextColor="#a3a2a2"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                secureTextEntry={true}
              />
              {valorSenha.length < 8 && valorSenha.length > 0 && (
                <Text style={{ color: 'red', marginTop: 5 }}>
                  A senha deve ter no mínimo 8 caracteres.
                </Text>
              )}
              <Text style={styles.txtName}>CONFIRME SUA NOVA SENHA</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: valorSenha.length < 8 && valorSenha.length > 0 ? 'red' : '#ccc', // Muda a cor da borda em caso de erro
                  },
                ]}
                placeholder="********"
                value={confirmSenha}
                onChangeText={(text) => {
                  if (text.length <= 20) { // Limita o número máximo de caracteres
                    setConfirmSenha(text.trim());
                  } else {
                    ToastAndroid.show('A senha pode ter no máximo 20 caracteres.', ToastAndroid.SHORT);
                  }
                }}
                placeholderTextColor="#a3a2a2"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                secureTextEntry={true}
              />
              {valorSenha.length < 8 && valorSenha.length > 0 && (
                <Text style={{ color: 'red', marginTop: 5 }}>
                  A senha deve ter no mínimo 8 caracteres.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.botaoLog} onPress={navigateToLogin}>
            <Icon name="arrow-back" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}> Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={VerificaCodigo}>
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
          <Text style={styles.modalText}>Senha redefinida com sucesso!</Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setModalVisible(false);
              navigateToLogin();
            }}>
            <Text style={{ color: 'white', fontSize: 15 }}>OK!</Text>
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
    borderTopRightRadius: 58,
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
    height: '42%',
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

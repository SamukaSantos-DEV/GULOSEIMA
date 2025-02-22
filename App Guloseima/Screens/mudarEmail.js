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

const MudarEmailScreen = ( setCorreto ) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [valorEmail, setEmail] = useState('');
  const [estudanteId, setEstudanteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);

  const sufixo = "@etec.sp.gov.br";

  const scrollToInput = () => {
    scrollViewRef.current.scrollTo({ y: 100, animated: true });
  };

  const navigateToConta = () => {
    navigation.navigate('Conta');
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
      } catch (error) {
        console.error('Erro ao carregar usuario: ', error);
        setUsuarios([]);
      }
    };

    obterEstudanteId();
    carregarDados();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let timerInterval;
    if (modalVisible && buttonDisabled) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerInterval);
            setButtonDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [modalVisible, buttonDisabled]);

  const [valorRandom, setRandom] = useState('');
  const [valorCodigo, setCodigo] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(valorCodigo.length !== 6);
  }, [valorCodigo]);

  const openModal = () => {
    setModalVisible(true);
    setTimer(30);
    setButtonDisabled(true);
  };

  function terminaCom(string, sufixo) {
    return string.endsWith(sufixo);
  }

  const verificarEmail = async () => {
    
    try{
      const id = await AsyncStorage.getItem('userId');
      const response = await axiosInstance.post('/verificarEmail.php', {
        id : id,
        email : valorEmail
      });
    if (response.status === 200) {
      setCorreto = true;
      EnviarEmail();
    }
    else {
      alert("Insira o email corretamente.");
      setCorreto = false;
    }
  }
  catch(error){
    console.log("Erro ao verificar email: ", error);
    alert("O e-mail inserido já esta sendo utilizado.");
  }
  }

  const EnviarEmail = async () => {

    // Verifica se os campos estão preenchidos
    if (valorEmail) {
      // Verifica se o e-mail é institucional (verificação de sufixo)
      if (terminaCom(valorEmail, sufixo)) {
        console.log("Email:", valorEmail);
  
        try {
          // Faz a requisição ao servidor Node.js para enviar o e-mail e gerar o código
          const response = await axios.post('http://192.168.1.104:3000/enviar-email', {
            to: valorEmail,
            subject: 'Assunto do e-mail',
          });
  
          console.log("Resposta do servidor:", response.data); // Log da resposta
  
          // Verifica se o e-mail foi enviado com sucesso
          if (response.status === 200) {
            console.log('E-mail enviado com sucesso');
            openModal(); // Abre o modal para o usuário inserir o código
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
  };

  const VerificaCodigo = async () => {
    try{
      const response = await axiosInstance.post('/verificarCodigo.php', {
        valorCodigo : valorCodigo,
        email : valorEmail
      });
    if (response.status === 200) {
      setCorreto = true;
      handleNovoEmail();
    }
    else {
      alert("Insira o código corretamente.");
      setCorreto = false;
    }
  }
  catch(error){
    console.log("Erro ao verificar codigo: ", error)
  }
  };

  const handleNovoEmail = async () => {
      console.log(valorEmail);
      try {
        const id = await AsyncStorage.getItem('userId');
        const changeResponse = await axiosInstance.post('/mudarEmail.php', {
          id: id,
          email: valorEmail,
        });

        if (changeResponse.status === 200) {
          setEmail('');
          setModalVisible(false);
          navigateToConta();
        } else if (changeResponse.status === 409){
          alert("Ocorreu um erro ao tentar redefinir o e-mail, este e-mail pode já estar em uso.");
        }
      } catch (error) {
        console.error('Erro ao verificar ou redefinir e-mail:', error);
        
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
            <Text style={styles.textTitle}>Redefinir Email</Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>
              <Text style={styles.txtName}>Novo Email</Text>
              <TextInput
                style={styles.input}
                placeholder="*****@etec.sp.gov.br"
                placeholderTextColor="#a3a2a2"
                onFocus={scrollToInput}
                onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}  // Remove todos os espaços
                value={valorEmail}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.botaoLog} onPress={navigation.goBack}>
            <Icon name="arrow-back" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoLog} onPress={verificarEmail}>
            <Icon name="lock-reset" size={24} color="#E26A05" />
            <Text style={styles.textoBotaoLog}>Redefinir</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={estilo.centeredView}>
            <View style={estilo.modalView}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 20,
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                Insira o código de 6 dígitos enviado ao seu e-mail institucional para confirmar seu novo e-mail.
              </Text>

              <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: '5%' }}>
                Insira o código de 6 dígitos
              </Text>
              <View style={estilo.inputContainer2}>
                <TextInput
                  value={valorCodigo}
                  onChangeText={(text) => setCodigo(text.replace(/[^0-9]/g, ''))} // Aceita apenas números
                  style={estilo.input2}
                  keyboardType="numeric"
                  maxLength={6} // Limita a 6 dígitos
                />
                <TouchableOpacity
                  style={[
                    estilo.button,
                    isButtonDisabled ? { backgroundColor: 'gray' } : { backgroundColor: 'green' }, // Cor do botão condicional
                  ]}
                  onPress={VerificaCodigo}
                  disabled={isButtonDisabled}>
                  <Image
                    style={[
                      estilo.iconOpt3,
                      isButtonDisabled ? { tintColor: 'darkgray' } : { tintColor: 'white' }, // Ícone condicional
                    ]}
                    source={{ uri: 'https://cdn-icons-png.freepik.com/256/591/591855.png?ga=GA1.1.1092767557.1714571303&semt=ais_hybrid' }}
                  />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: '5%' }}>
                Aguarde {timer} segundos para enviar novamente o código.
              </Text>
              <TouchableOpacity
                style={[estilo.botaoReenviar, buttonDisabled ? estilo.buttonDisabled : estilo.buttonEnabled]}
                onPress={EnviarEmail}
                disabled={buttonDisabled}>
                <Text style={estilo.textoBotaoReenviar}>Re-enviar Código</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default MudarEmailScreen;

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

const estilo = StyleSheet.create({

  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '20%'
  },
  input2: {
    width: '70%',
    height: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  button: {
    backgroundColor: 'green',
    height: '80%',
    width: '28%',
    marginLeft: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,

  },

  iconOpt3: {
    width: 30,
    height: 30,
    position: 'absolute',
    tintColor: 'white',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    margin: 30,
    marginVertical: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },


  backgroundImage: {
    height: '100%',
    resizeMode: 'cover',
  },
  iconHelp: {
    width: 30,
    height: 30,
    tintColor: 'white',
    right: 0,
    position: 'absolute',
  },
  card: {
    margin: '10%',
    marginTop: '83%',
  },
  textTitle: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: 28,
    marginTop: '8%',
    marginBottom: '4%',
  },

  btnLgn: {
    padding: '2%',
    color: '#E26A05',
    backgroundColor: '#382c21',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: '3%',
    padding: '3%',
    borderRadius: 10,
  },
  txtName: {
    marginTop: '3%',
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  input: {
    marginVertical: '3%',
    backgroundColor: '#545353',
    padding: '3%',
    paddingHorizontal: '3%',
    borderRadius: 14,
    fontWeight: '700',
    color: 'white',
    placeholderTextColor: 'white',
  },
  botaoCadst: {
    backgroundColor: '#E26A05',
    marginVertical: '7%',
    borderRadius: 12,
    paddingVertical: '5%',
  },
  textoBotaoCadst: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 20,
  },
  botaoReenviar: {
    backgroundColor: 'green',
    marginVertical: '1%',
    borderRadius: 12,
    paddingVertical: '5%',
    paddingHorizontal: '8%',
  },
  textoBotaoReenviar: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 17,
  },
  buttonDisabled: {
    backgroundColor: '#D9D9D9'
  },
  buttonEnabled: {
    backgroundColor: '#004bb5'
  },
});

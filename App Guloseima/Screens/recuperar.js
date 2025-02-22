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

const NovaSenhaScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [valorEmail, setEmail] = useState('');
  const [valorCodigo, setCodigo] = useState('');
  const [valorRandom, setRandom] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);

  const sufixo = "@etec.sp.gov.br";

  const scrollToInput = () => {
    scrollViewRef.current.scrollTo({ y: 100, animated: true });
  };

  const navigateToRedefinir = () => {
    navigation.navigate('RedefinirSenha');
  };

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

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(valorCodigo.length !== 6);
  }, [valorCodigo]);

  const openModal = () => {
    setModalVisible(true);
    setTimer(30);
    setButtonDisabled(true);
  };

  const EnviarEmail = async () => {
    if(valorEmail){
      const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join('');
      console.log(random);
      console.log(valorEmail);
    
      // Verifica se o e-mail termina com "@etec.sp.gov.br"
      if (!valorEmail.endsWith(sufixo)) {
        alert("Insira um e-mail institucional válido com o domínio @etec.sp.gov.br.");
        return;  // Impede que o código continue se o e-mail for inválido
      }
    
      setRandom(random);
      try {
        openModal();

        await axios.post('http://192.168.1.104:3000/enviar-email', {
          to: valorEmail,
          subject: 'Assunto do e-mail',
          html: `<h3>Código de verificação GULOSEIMA</h3> <h4>Seu código de verificação é:</h4> <h1>${random}</h1>`,
        });

      } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert("O e-mail inserido está incorreto, por favor, insira um e-mail válido.");
      }
    }else{
      alert("Por favor, preencha todos os campos.")
    }
  };

  const VerificaCodigo = async () => {
    if (valorCodigo === valorRandom) {
      console.log("Código correto");
      await AsyncStorage.setItem('emailUsuario', valorEmail);
      navigateToRedefinir();
    } else {
      alert("Insira o código corretamente.");
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
            <Text style={styles.textTitle}>Recuperar Senha</Text>
            <Text style={styles.textSub}>
            Após inserir o e-mail de sua conta e clicar em 'Redefinir', um código sera enviado para seu e-mail, após confirmar esse código, você sera redirecionado a outra tela para redefinir sua senha.
          </Text>
            <View style={{ height: '50%', marginBottom: '25%' }}>
              <Text style={styles.txtName}>E-mail da sua Conta</Text>
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
          <TouchableOpacity style={styles.botaoLog} onPress={EnviarEmail}>
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
    borderColor: '#fff',
  },
  textSub: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
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


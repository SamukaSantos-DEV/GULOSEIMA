import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axiosInstance from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ( setCorreto ) => {

  const [ficarLogado, setFicarLogado] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const sufixo = "@etec.sp.gov.br";

  useEffect(() => {
    let timerInterval;
    if (modalVisible && buttonDisabled) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => {
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

  const openModal = () => {
    setModalVisible(true);
    setTimer(30);
    setButtonDisabled(true);
  };

  const toggleSwitch = () => setFicarLogado(previousState => !previousState);

  const [valorCodigo, setCodigo] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(valorCodigo.length !== 6);
  }, [valorCodigo]);

  const VerificaCodigo = async () => {
    try{
      const response = await axiosInstance.post('/verificarCodigo.php', {
        valorCodigo : valorCodigo,
        email : valorEmail
      });
    if (response.status === 200) {
      setCorreto = true;
      Logar();
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

  const verificarAutenticacao = async () => {
    if (valorEmail != null && valorEmail != '' && valorSenha != null && valorSenha != '') {
    console.log(valorEmail);
    try {
        const response = await axiosInstance.post('/verificarAutenticacao.php', {
            email: valorEmail
        });

        if (response.status === 200 && response.data.success) {
            console.log('Usuario é verificado');
            openModal();
            EnviaEmail(); // Envia o e-mail e abre o modal
        } else {
            console.error('Usuario não é verificado');
            Logar(); // Se não está verificado, tenta logar diretamente
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
    }
  }
  else {
    alert("Por favor insira as informações.");
  }
}

  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('estaLogado');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    logout();
  }, []);

  const navigation = useNavigation();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigateToCadastro = () => {
    navigation.navigate('Cadastro');
  };

  const navigateToCardapio = () => {
    console.log('2');
    navigation.reset({
      index: 5,
      routes: [{ name: 'Cardapio' }],
    });
  };

  const navigateToRedefinirSenha = () => {
    navigation.navigate('Recuperar');
  };
  const navigateToHelp = () => {
    navigation.navigate('ComoUsar');
  };

  const [valorEmail, setEmail] = useState('');
  const [valorSenha, setSenha] = useState('');

  function terminaCom(string, sufixo) {
    return string.endsWith(sufixo);
  }

  const EnviaEmail = async () => {
    console.log("Email:", valorEmail);
    console.log("Senha:", valorSenha);
  
    // Verifica se os campos estão preenchidos
    if (valorEmail && valorSenha) {
      // Verifica se o e-mail é institucional (verificação de sufixo)
      if (terminaCom(valorEmail, sufixo)) {
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

  async function Logar() {
      try {
        const response = await axiosInstance.post('/login.php', {
          email: valorEmail,
          senha: valorSenha
        });

        console.log(response);

        if (response.status === 200 && response.data.success) {
          await AsyncStorage.setItem('userId', response.data.id.toString());
          console.log(ficarLogado);
          if (ficarLogado === true) {
            await AsyncStorage.setItem('estaLogado', JSON.stringify(true));
          } else {
            await AsyncStorage.setItem('estaLogado', JSON.stringify(false));
          }
          setEmail('');
          setSenha('');
          navigateToCardapio();
        }
        else {
          alert("Credenciais inválidas. Por favor, tente novamente.");
        }
      }

      catch (error) {
        alert("Insira as informações corretamente.");
        console.error('Erro ao logar estudante:', error);
      }
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={estilo.container}>
      <ImageBackground
        source={require('../assets/FundoLogin.png')}
        style={estilo.backgroundImage}>
        <ScrollView contentContainerStyle={estilo.scrollViewContent}>
          <View style={estilo.card}>
            <TouchableOpacity onPress={navigateToHelp}>
              <Image
                style={estilo.iconHelp}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/18/18436.png',
                }}
              />
            </TouchableOpacity>
            <Text style={estilo.textTitle}>Login</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={estilo.txtName}>E-MAIL INSTITUCIONAL</Text>
              <Text style={{
                marginTop: '2%',
                fontSize: 20,
                fontWeight: '700',
                color: 'red',
              }}> *</Text>
            </View>
            <TextInput
              style={estilo.input}
              placeholder="RenatoHenro123@etec.sp.gov.br"
              value={valorEmail}
              onChangeText={(text) => setEmail(text.trim())}
              placeholderTextColor="#a3a2a2"
              onFocus={() => setIsPasswordFocused(false)}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={estilo.txtName}>SENHA</Text>
              <Text style={{
                marginTop: '2%',
                fontSize: 20,
                fontWeight: '700',
                color: 'red',
              }}> *</Text>
            </View>
            <TextInput
              style={estilo.input}
              placeholder="********"
              value={valorSenha}
              onChangeText={(text) => setSenha(text.trim())}
              placeholderTextColor="#a3a2a2"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              secureTextEntry={true}
            />
            <Text style={{
              marginTop: '2%',
              fontSize: 12,
              fontWeight: '700',
              color: 'red',
            }}>CAMPOS OBRIGATÓRIOS *</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '2%' }}>

              <Text style={{
                marginLeft: '0%',
                marginTop: '2%',
                fontSize: 12,
                fontWeight: '700',
                color: 'white',
              }}>Manter Conectado?</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#382c21' }}
                thumbColor={ficarLogado ? '#E26A05' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={ficarLogado}

                style={{
                  marginLeft: '0%',
                  marginTop: '-3%',
                  marginBottom: '-5%',
                }}
              />
            </View>

            <TouchableOpacity
              style={estilo.botaoLog}
              onPress={verificarAutenticacao}>
              <Text style={estilo.textoBotaoLog}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToRedefinirSenha}>
              <Text style={estilo.btnEsq}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToCadastro}>
              <Text style={estilo.btnCdt}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>

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
                        textAlign: 'center', color: "#000",
                        flexShrink: 1,
                      }}>
                      Insira o código de 6 digitos enviado ao seu e-mail institucional para efetuar o login.
                    </Text>

                    <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: '5%' }}>
                    * O codigo será valido pelos próximos 15 minutos
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
                          isButtonDisabled ? { backgroundColor: 'gray' } : { backgroundColor: 'green' } // Cor de fundo condicional
                        ]}
                        onPress={VerificaCodigo}
                        disabled={isButtonDisabled}
                      >
                        <Image
                          style={[estilo.iconOpt3, isButtonDisabled ? { tintColor: 'darkgray' } : { tintColor: 'white' }]} // Ícone condicional
                          source={{ uri: 'https://cdn-icons-png.freepik.com/256/591/591855.png?ga=GA1.1.1092767557.1714571303&semt=ais_hybrid' }}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: '5%' }}>
                      Aguarde {timer} segundos para enviar novamente o código.
                    </Text>
                    <TouchableOpacity
                      style={[estilo.botaoReenviar, buttonDisabled ? estilo.buttonDisabled : estilo.buttonEnabled]}
                      onPress={EnviaEmail}
                      disabled={buttonDisabled}
                    >
                      <Text style={estilo.textoBotaoReenviar}>Re-enviar Código</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: '5%' }}>* Caso não esteja recebendo o código de verificação, verifique se seu e-mail está correto.</Text>
                  </View>
                </View>
              </Modal>

          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
const estilo = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconHelp: {
    width: 30,
    height: 30,
    tintColor: 'white',
    right: 0,
    position: 'absolute',
  },
  card: {
    margin: '8%',
    marginTop: '82%',
  },
  textTitle: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: 38,
    marginTop: '5%',
    marginBottom: '5%',
  },
  btnCdt: {
    color: '#E26A05',
    textAlign: 'center',
    backgroundColor: '#382c21',
    fontSize: 17,
    marginHorizontal: '11%',
    marginVertical: '3%',
    padding: '3%',
    borderRadius: 10,
  },
  btnEsq: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#363636',
    fontSize: 17,
    marginHorizontal: '23%',
    marginVertical: '1%',
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
  botaoLog: {
    backgroundColor: '#E26A05',
    marginVertical: '6%',
    borderRadius: 7,
    paddingVertical: '4%',
  },
  textoBotaoLog: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 20,
  },
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
    height: '60%',
    width: '28%',
    marginLeft: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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

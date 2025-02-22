import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Platform,
  Image,
  ToastAndroid,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import axiosInstance from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as ChildProcess from 'child_process';

const CadastroScreen = ({ setCorreto }) => {

  const navigation = useNavigation();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

  const navigateToHelp = () => {
    navigation.navigate('ComoUsar');
  };

  const [modalVisible, setModalVisible] = useState(false);

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

  const [valorNome, setNome] = useState('');
  const [valorEmail, setEmail] = useState('');
  const [valorSenha, setSenha] = useState('');

  function terminaCom(string, sufixo) {
    return string.endsWith(sufixo);
  }

  const sufixo = "@etec.sp.gov.br";


  const openModal = () => {
    setModalVisible(true);
    setTimer(30);
    setButtonDisabled(true);
  };

  const verificarEmail = async () => {
    
    try{
      const response = await axiosInstance.post('/verificarEmail.php', {
        id : 0,
        email : valorEmail
      });
    if (response.status === 200) {
      setCorreto = true;
      EnviaEmail();
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

  async function EnviaEmail() {
    console.log("Nome:", valorNome);
    console.log("Email:", valorEmail);
    console.log("Senha:", valorSenha);
  
    // Verifica se os campos estão preenchidos
    if (valorNome && valorEmail && valorSenha && valorSenha.length >= 8) {
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
      alert("Por favor, insira todas as informações corretamente.");
    }
  }
  
 
  async function Cadastrar() {
    try {
      const response = await axiosInstance.post('/cadastro.php', {
        nome: valorNome,
        email: valorEmail,
        senha: valorSenha
      });

      console.log(response);

      setNome('');
      setEmail('');
      setSenha('');

      if (response.status === 200) {
        alert("Cadastro realizado com sucesso!");
        navigateToLogin();
      }
    }

    catch (error) {
      console.error('Erro ao cadastrar estudante:', error);
      alert("O e-mail inserido já está cadastrado em nosso sistema");
    }
  }

  const [valorCodigo, setCodigo] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Habilita o botão quando o valor do código tiver exatamente 6 dígitos
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
      Cadastrar();
    }
    else {
      alert("Insira o código corretamente.");
      setCorreto = false;
    }
  }
  catch(error){
    console.log("Erro ao verificar codigo: ", error)
    alert("Insira o código corretamente.");
  }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={require('../assets/FundoCadastro.png')}
        style={estilo.backgroundImage}>
        <ScrollView contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}>
          <View style={estilo.card}>
            <TouchableOpacity onPress={navigateToHelp}>
              <Image
                style={estilo.iconHelp}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/18/18436.png',
                }}
              />
            </TouchableOpacity>
            <Text style={estilo.textTitle}>Criar nova conta</Text>

            <View style={{ flexDirection: 'row' }}>
              <Text style={estilo.txtName}>NOME</Text>

              <Text style={{
                marginTop: '2%',
                fontSize: 20,
                fontWeight: '700',
                color: 'red',
              }}> *</Text>
            </View>

            <TextInput
              style={estilo.input}
              placeholder="Renato"
              value={valorNome}
              onChangeText={(text) => setNome(text)}
              placeholderTextColor="#a3a2a2"
              onFocus={() => setIsPasswordFocused(false)}
            />

            <View style={{ flexDirection: 'row' }}>
              <Text style={estilo.txtName}>EMAIL INSTITUCIONAL</Text>
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
  style={[
    estilo.input,
    {
      borderColor: valorSenha.length < 8 && valorSenha.length > 0 ? 'red' : '#ccc', // Muda a cor da borda em caso de erro
    },
  ]}
  placeholder="********"
  value={valorSenha}
  onChangeText={(text) => {
    if (text.length <= 20) { // Limita o número máximo de caracteres
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

            <Text style={{
              marginTop: '2%',
              fontSize: 12,
              fontWeight: '700',
              color: 'red',
            }}>CAMPOS OBRIGATÓRIOS *</Text>

            <TouchableOpacity
              style={estilo.botaoCadst}
              onPress={verificarEmail}>
              <Text style={estilo.textoBotaoCadst}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={estilo.btnLgn}>
                Já tem uma conta? Faça Log In aqui
              </Text>
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
                      }}>
                      Insira o código de 6 digitos enviado ao seu e-mail institucional para efetuar o cadastro.
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
    </KeyboardAwareScrollView >
  );
};

const estilo = StyleSheet.create({

  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '20%'
  },
  input2: {
    width: '70%',
    height: '60%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
    marginVertical: '20%',
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

export default CadastroScreen;

import React, { useState , useEffect, useRef } from 'react';
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
import axiosInstance, { isAuthenticated } from '../autent';
import axios from 'axios';

const AutenticarScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [valorCodigo, setCodigo] = useState('');
  const [valorRandom, setRandom] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [autenticacaoHabilitada, setAutenticacao] = useState(false);

  const openModal = () => {
    setModalVisible(true);
    setTimer(30);
    setButtonDisabled(true);
  };

  const verificarAutenticacao = async () => {
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    let valorEmail = response.data;
    const email = valorEmail[0];
    console.log("email: ", email.email);

    try {
      const response = await axiosInstance.post('/verificarAutenticacao.php', {
        email: email.email
      });

      if (response.status === 200 && response.data.success) {
        console.log('Usuario é verificado');
        setAutenticacao(true);
      } else {
        console.error('Usuario não é verificado');
        setAutenticacao(false);
      }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        setAutenticacao(false);
      }
  }

  useEffect(() => {
    verificarAutenticacao();
  }, []) 

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

  useEffect(() => {
    setIsButtonDisabled(valorCodigo.length !== 6);
  }, [valorCodigo]);

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

    setCarregando(false);
  } catch (error) {
    console.error('Erro ao carregar usuario: ', error);
    setUsuarios([]);
    setCarregando(false);
  }
};

useEffect(() => {
  obterEstudanteId();
  carregarDados();
}, []);

  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(true);

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToConta = () => {
    navigation.navigate('Conta');
  };


  const handleVerificacao = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    let valorEmail = response.data;
    const email = valorEmail[0];

    const responseCodigo = await axiosInstance.post('/verificarCodigo.php', {
      valorCodigo : valorCodigo,
      email : email.email
    });
    if (responseCodigo.status = 200) {
      try {
        const response = await axiosInstance.post('/verificacaoDuasEtapas.php', {
          id: userId
        });

        if (response.status === 200 && response.data.success) {
          console.log('Verificação atualizada com sucesso');
          alert('Verificação completada com sucesso!');
          navigateToConta();
        } else {
          console.error('Erro ao atualizar a verificação');
          alert('Erro ao atualizar a verificação.');
        }
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        alert('Erro ao processar a verificação.');
      }
    } else {
      alert('Código de verificação incorreto.');
    }
  };

  const EnviaEmail = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
    if(autenticacaoHabilitada === true){
      try{
      const responseVerificacao = await axiosInstance.post('/removerVerificacao.php', {
        id: userId
      })
      setAutenticacao(false);
      console.log(responseVerificacao);
      navigateToConta();
      } catch(error){
        console.error('Erro:', error);
      }
      return;
    }
    let valorEmail = response.data;
    console.log(response.data, ": Bruto");
        if (Array.isArray(valorEmail) && valorEmail.length > 0) {
          const email = valorEmail[0];
          console.log("email: ", email.email);
          try {
            // Faz a requisição ao servidor Node.js para enviar o e-mail e gerar o código
            const responseEmail = await axios.post('http://192.168.1.104:3000/enviar-email', {
              to: email.email,
              subject: 'Assunto do e-mail',
            });
    
            console.log("Resposta do servidor:", responseEmail.data); // Log da resposta
    
            // Verifica se o e-mail foi enviado com sucesso
            if (responseEmail.status === 200) {
              console.log('E-mail enviado com sucesso');
              openModal(); // Abre o modal para o usuário inserir o código
            } else {
              console.error('Erro ao enviar o e-mail:', responseEmail.data);
              alert('Erro ao enviar o e-mail. Tente novamente.');
            }
          } catch (error) {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao enviar o e-mail. Por favor, tente novamente.");
          }
        }
    else {
      alert("Insira um e-mail institucional válido.");
      console.log("A string não termina com '" + sufixo + "'");
    }
}  

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          console.log("usuario autenticado");
          console.log("id do usuario " + userId);
        }
        else {
          console.log("usuario nao autenticado");
          navigateToLogin();
        }
      }
      catch (error) {
        console.error('Erro ao buscar ID do usuario:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/splash.jpg')}
        style={styles.back}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>Autenticação de dois fatores</Text>
          <Text style={styles.textSub}>
            Ao fazer log-in no sistema, um e-mail sera enviado a você com um código de confirmação, para garantir a segurança de sua conta.
          </Text>
          <Text style={styles.textSub}>
            {autenticacaoHabilitada ? 'Sua autenticação de dois fatores está ativa. Deseja desativar?' : 'Habilite a autenticação de dois fatores para maior segurança!'}
          </Text>
          <View style={{ height: '25%', justifyContent: 'center' }}>
            <TouchableOpacity style={styles.botaoLog} onPress={EnviaEmail}>
              <Image
                style={styles.iconOpt}
                source={{
                  uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
                }}
              />
              <Text style={styles.textoBotaoLog}>{autenticacaoHabilitada ? 'Desativar Autenticação' : 'Habilitar Autenticação'}</Text>
             
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.botaoLog} onPress={navigation.goBack}>
            <Image
              style={{
                transform: [{ rotate: '180deg' }],
                width: 30,
                height: 30,
                marginHorizontal: 10,
                tintColor: '#E26A05',
              }}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
            <Text style={styles.textoBotaoLog}>Voltar</Text>
           
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
                        textAlign: 'center', color: "#000",
                      }}>
                      Insira o código de 6 digitos enviado ao seu e-mail institucional para confirmar seu e-mail.
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
                        onPress={handleVerificacao}
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
    </View>
  );
};

export default AutenticarScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '55%',
    padding: '10%',
    width: '100%',
    borderTopRightRadius: 100,
    position: 'absolute',
    bottom: 0,
  },
  iconOpt: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
    tintColor: '#E26A05',
  },
  iconOpt2: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
    tintColor: '#E26A05',
  },
  botaoLog: {
    borderRadius: 7,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cfcfcf',
  },
  textoBotaoLog: {
    fontSize: 17,
    marginLeft: 10,
  },
  textTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 28,
    marginTop: '5%',
    marginBottom: '5%',
  },
  textSub: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'justify',
  },
  back: {
    flex: 1,
    height: '55%',
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
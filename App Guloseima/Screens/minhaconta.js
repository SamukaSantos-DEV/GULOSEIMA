import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { isAuthenticated } from '../autent';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';


const ContaScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [estudanteId, setEstudanteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const abrirModal = () => {
    setModalVisible(true);
  };

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

  const navigateToExcluir = () => {
    navigation.navigate('ExcluirConta');
  };

  const navigateToCarrinho = () => {
    navigation.navigate('Carrinho');
  };

  const navigateToPedidos = () => {
    navigation.navigate('Pedidos');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToAutenticar = () => {
    navigation.navigate('Autenticar');
  };

  const navigateToRedefinirSenha = () => {
    navigation.navigate('MudarSenha');
  };

  const navigateToRedefinirDados = () => {
    navigation.navigate('MudarDados');
  };

  const [showBalance, setShowBalance] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

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
    <View style={styles.tela}>
      <View style={styles.mnsuperios}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={navigateToCardapio}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png',
            }}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/TituloConta.png')}
          style={styles.title}
        />
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.banner}>

        {usuarios.map((usuario, index) => (
          <View style={styles.informacaoUser}>
            <Text style={styles.name}>{usuario.nome}</Text>
            <Text style={styles.email}>{usuario.email}</Text>
            <View style={styles.row}>
              <Text style={styles.email}>
                Saldo: R$ {showBalance ? usuario.saldo :  '••••'}
              </Text>
              <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.iconButton}>
                <Icon name={showBalance ? 'visibility-off' : 'visibility'} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <Text style={styles.email}>Token: <Text style={styles.token}> {showToken ? usuario.token : '* * * * * *'}</Text>
              </Text>
              <TouchableOpacity onPress={toggleTokenVisibility} style={styles.iconButton}>
                <Icon name={showToken ? 'visibility-off' : 'visibility'} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.button}>
            <Icon name="wallet" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Adicionar crédito</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToCarrinho}>
            <Icon name="shopping-cart" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Carrinho</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToPedidos}>
            <Icon name="shopping-bag" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Pedidos</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={abrirModal}>
            <Icon name="lock-reset" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Redefinir Senha</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToRedefinirDados}>
            <Icon name="edit" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Editar Informações</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToAutenticar}>
            <Icon name="verified" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Verificação em 2 Etapas</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Icon name="logout" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Sair da Conta</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToExcluir}>
            <Icon name="delete" size={20} style={styles.icon} />
            <Text style={styles.buttonText}>Excluir Conta</Text>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tem certeza que quer redefinir sua senha?</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setModalVisible(false);
                navigateToRedefinirSenha();
              }}>
              <Text style={{ color: 'green', fontSize: 20, }}>✅</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={{ color: 'white', fontSize: 15 }}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ContaScreen;
const styles = StyleSheet.create({

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
    width: '39%',
    bottom: '35%',
    height: '35%',
    left: '30%',
    marginRight: '10%',
  },
  logo: {
    position: 'absolute',
    width: '10%',
    right: '5%',
    height: '80%',
    bottom: '10%',
  },
  tela: {
    flex: 1,
    height: '100%',
  },
  banner: {
    width: '100%',
    height: '25%',
    backgroundColor: '#d4d4d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  informacaoUser: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    width: '80%',
    textAlign: 'center',
    paddingHorizontal: 18,
    marginTop: 7,
    paddingVertical: 8,
    textTransform: 'uppercase',
    fontSize: 25,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    fontWeight: '800',
  },
  token: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'red',
  },

  row: {
    flexDirection: 'row',
  },

  iconButton: {
    position: 'absolute',
    left: '72%',
    marginTop: 11,
    backgroundColor: '#9e9e9e',
    padding: 5,
    borderRadius: 7,
  },

  email: {
    textAlign: 'center',
    width: '80%',
    marginTop: 7,
    paddingVertical: 8,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  button: {
    width: '80%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: '2%',
    marginHorizontal: '4%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: '13%',
  },
  icon: {
    color: "#000",
    position: 'absolute',
    left: '5%',
  },
  iconOpt: {
    width: 20,
    height: 20,
    right: '5%',
    position: 'absolute',
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
    left: '15%',
    top: '40%',
    height: '25%',
    width: '70%',
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
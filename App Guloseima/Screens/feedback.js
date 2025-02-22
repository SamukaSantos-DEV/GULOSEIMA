import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import axiosInstance from '../autent';

const SugestaoScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [texto, setTexto] = useState('');
  const [canSend, setCanSend] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState('00:00'); // Adiciona o estado para o tempo restante

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

  const enviarSugestao = async () => {
    setTexto('');
    Keyboard.dismiss();
    if (!canSend) {
      alert(`Por favor, espere o tempo acabar antes de enviar outro e-mail. Faltam ${timeLeft} minutos.`);
      return;
    }

    if (texto !== "") {

      const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
      let valorEmail = response.data;
      const email = valorEmail[0];
      console.log("id: " + await AsyncStorage.getItem('userId'));

      try {
        axios.post('http://192.168.1.104:3001/enviar-sugestao', {
          to: 'guloseimatcc@gmail.com',
          subject: 'Feedback de ' + email.email, 
          html: texto,
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Erro:', error);
          });

          setModalVisible(true);
          setTexto('');
          setCanSend(false); // Desativa o botão
          setTimer(300000);
          AsyncStorage.setItem('lastSentTime2', Date.now().toString());
          setTimeout(() => {
            setModalVisible(false);
          }, 2000); 
      } 
      catch (error) {
        console.log(error);
        console.log("Erro ao enviar e-mail");
      }
    } else {
      console.log("nao pode enviar vazia.");
      alert("Não é possível enviar a mensagem sem nenhum texto.");
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          console.log("usuario autenticado");
          console.log("id do usuario " + userId);
        } else {
          console.log("usuario nao autenticado");
          navigateToLogin();
        }
      } catch (error) {
        console.error('Erro ao buscar ID do usuario:', error);
      }
    };

    const loadTimer = async () => {
      try {
        const lastSentTime = await AsyncStorage.getItem('lastSentTime2');
        if (lastSentTime) {
          const elapsedTime = Date.now() - parseInt(lastSentTime, 10);
          const remainingTime = Math.max(0, 300000 - elapsedTime);
          setTimer(remainingTime);
          if (remainingTime === 0) {
            setCanSend(true);
          } else {
            setCanSend(false);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o tempo do temporizador:', error);
      }
    };

    loadTimer();
    checkLoginStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (!canSend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            clearInterval(interval);
            setCanSend(true);
            return 0;
          }
          setTimeLeft(formatTime(newTime)); // Atualiza o tempo restante
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canSend]);

    const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsTyping(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsTyping(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  


  return (
    <View style={{ flex: 1 }}>
      {!isTyping && (
        <View style={styles.mnsuperios}>
          <TouchableOpacity style={styles.menuButton} onPress={navigateToCardapio}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png' }}
              style={styles.iconBack}
            />
          </TouchableOpacity>
          <Image source={require('../assets/TituloFeedback.png')} style={styles.title} />
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
        </View>
      )}

      <View style={styles.tela}>
        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP}>Dê-nos um feedback do que achou do nosso aplicativo</Text>
          <TextInput
            placeholder="Escreva aqui"
            style={styles.input}
            multiline={true}
            onChangeText={(text) => setTexto(text)}
            value={texto}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          <TouchableOpacity
            style={[styles.botaoLog, !canSend && styles.botaoDesabilitado]} // Aplica o estilo desativado
            onPress={enviarSugestao}
            disabled={!canSend} // Desabilita o botão quando não deve estar disponível
          >
            <Text style={styles.textoBotaoLog}>Enviar</Text>
          </TouchableOpacity>
          {!canSend && (
            <Text style={styles.timerText}>Você poderá enviar outro e-mail em {timeLeft}.</Text> // Mensagem com tempo restante
          )}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Obrigado pelo feedback!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SugestaoScreen;

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: '6%',
    justifyContent: 'center',
  },
  cardPrincipal: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  titleCP: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    paddingBottom: 20,
    color: '#E26A05',
  },
  input: {
    width: '100%',
    backgroundColor: '#c7c7c7',
    borderRadius: 5,
    padding: 10,
    marginVertical: '4%',
    minHeight: '5%',
  },
  botaoLog: {
    backgroundColor: '#E26A05',
    borderRadius: 7,
    paddingVertical: '3%',
    width: '100%',
  },
  botaoDesabilitado: {
    backgroundColor: 'gray', // Cor do botão desabilitado
  },
  textoBotaoLog: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 5,
  },
  timerText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
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
    width: '36%',
    height: '40%',
    bottom: '35%',
    left: '33%',
    marginRight: '10%',
  },
  logo: {
    position: 'absolute',
    width: '10%',
    right: '5%',
    height: '80%',
    bottom: '10%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

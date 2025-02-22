import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../autent'; // Presumo que você tem axiosInstance configurado
import QRCode from 'react-native-qrcode-svg';

const PedidosScreen = () => {
  const navigation = useNavigation();

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [informacoes, setInformacoes] = useState([]);
  const [ano, setAno] = useState('');
  const [mes, setMes] = useState('');
  const [dia, setDia] = useState('');
  const isButtonEnabled = selectedOrder?.statusPedido === 'Aguardando Retirada' || selectedOrder?.statusPedido === 'Aguardando Pagamento';

  const pedidos = async () => {
    try {
      const response = await axiosInstance.get(`/meusPedidos.php?estudante_id=${await AsyncStorage.getItem('userId')}`)

      if (response.status === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        setInformacoes(data);
        console.log(data);

        let resposta = response.data;
        setStatus(resposta[0]);
        const datas = resposta[0];

        console.log('odaes')
        console.log(status.statusPedido);

        let partes = datas.dataPedido.split("-");
        setAno(partes[0]);
        setMes(partes[1]);
        setDia(partes[2]);
      }
    }
    catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setInformacoes([]);
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



    pedidos();
    checkLoginStatus();
  }, []);

  const handleCancelOrder = async () => {
    Alert.alert(
      "Cancelar Pedido",
      "Tem certeza de que deseja cancelar este pedido?",
      [
        {
          text: "MANTER",
          style: "cancel"
        },
        {
          text: "SIM",
          onPress: async () => {
            console.log(selectedOrder.pedido_id);
            const userId = await AsyncStorage.getItem('userId');
            console.log(userId);
            try {
              const response = await axiosInstance.post('/meusPedidos.php', {
                pedido_id: selectedOrder.pedido_id,
                estudante_id: userId
              });

              if (response.status === 200) {
                alert(response.data.success);
                setModalVisible(false);
                pedidos();
              }
            } catch (error) {
              console.error('Erro ao cancelar pedido:', error);
              alert('Erro ao cancelar o pedido.');
            }
          }
        }
      ]
    );
  };

  const MyComponent = ({ modalVisible, setModalVisible, selectedOrder }) => {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            {selectedOrder && (
              <View style={styles.modalView}>
                <QRCode value={selectedOrder.codigoConfirmacao.toString()}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
                <View style={{ height: 12 }}></View>
                <Text style={styles.modalText}>Código de retirada: {selectedOrder.codigoConfirmacao}</Text>
                <View style={{ height: 12 }}></View>
                <Text style={styles.modalText}>Mostrar na cantina para retirar os produtos:</Text>
                {selectedOrder.itens.map((item, idx) => (
                  <Text key={idx} style={{
                    marginBottom: 15, fontSize: 16
                  }}>
                    {item.nome_produto} - R$: {item.valor_item} x {item.quantidade}
                  </Text>
                ))}
                <Text style={styles.modalText}>Valor Total: R$ {selectedOrder.totalPedido}</Text>
                <Text style={styles.modalText}>Retirada: {selectedOrder.horario_nome}</Text>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={[styles.btnClose, !isButtonEnabled && styles.btnDisabled]}
                    onPress={isButtonEnabled ? handleCancelOrder : null}
                    disabled={!isButtonEnabled}
                  >
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', }}>
                      {isButtonEnabled ? 'Cancelar Pedido' : 'Retirado ou Cancelado'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnClose2}
                    onPress={() => setModalVisible(false)}>
                    <Text style={{ color: 'white', fontSize: 20 }}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Aguardando Retirada':
        return styles.aguardandoRetirada;
        case 'Aguardando Pagamento':
        return styles.aguardandoPagamento;
      case 'Pedido Retirado':
        return styles.pedidoRetirado;
      case 'Pedido Cancelado':
        return styles.pedidoCancelado;
      default:
        return styles.status; // Estilo padrão
    }
  };

  const renderizarPedidos = () => {
    if (informacoes.length === 0) {
      return (
        <View style={styles.semItensContainer}>
          <Text style={styles.semItensTexto}>Nenhum pedido foi realizado ainda.</Text>
        </View>
      );
    }

    return informacoes.map((informacao, index) => (
      <View key={index}>
        <TouchableOpacity
          style={styles.cards}
          onPress={() => {
            setSelectedOrder(informacao);
            setModalVisible(true);
          }}>
          <View style={styles.superiorCard}>
            <Text style={styles.titlecard}>Pedido {informacao.pedido_id}</Text>
            <View style={{ flexDirection: 'row', left: '27%' }}>
              <Text style={styles.horario}>{dia}</Text>
              <Text style={styles.horario}>/{mes}</Text>
              <Text style={styles.horario}>/{ano}</Text>
            </View>
            <Text style={styles.horario}> {informacao.horarioPedido}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.valor}>R$: {informacao.totalPedido}</Text>
            <Text style={[styles.status, getStatusStyle(informacao.statusPedido)]}>
              {informacao.statusPedido}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mnsuperios}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={navigation.goBack}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png',
            }}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/TituloPedido.png')}
          style={styles.title}
        />
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>

      <View style={styles.tela}>
        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP}>Pedidos</Text>
        </View>

        <ScrollView style={{ height: '100%' }}>
          {renderizarPedidos()}
        </ScrollView>

        <MyComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedOrder={selectedOrder}
        />
      </View>
    </View>
  );
};

export default PedidosScreen;

const styles = StyleSheet.create({
  semItensContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semItensTexto: {
    color: 'white',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  btnClose: {
    backgroundColor: '#E26A05',
    justifyContent: 'center',
    borderRadius: 10,
    width: '70%',
  },
  btnClose2: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5c5c5c',
    margin: 2,
  },

  btnDisabled: {
    backgroundColor: '#5c5c5c',
  },

  tela: {
    flex: 1,
    backgroundColor: '#1C2120',
    padding: '6%',
  },

  cards: {
    width: '100%',
    marginVertical: '3%',
    backgroundColor: 'white',
    height: 80,
    borderRadius: 15,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },

  superiorCard: {
    flexDirection: 'row',
    paddingBottom: 5,
    width: '95%',
    justifyContent: 'space-between',
  },
  titlecard: {
    left: '10%',
    fontSize: 20,
    fontWeight: '800',
  },

  valor: {
    left: '10%',
    fontSize: 14,
  },
  status: {
    right: 0,
    position: 'absolute',
    fontWeight: '700',
  },
  aguardandoRetirada: {
    color: 'green',
  },
  aguardandoPagamento: {
    color: 'orange',
  },
  pedidoRetirado: {
    color: '#b81d12',
  },
  pedidoCancelado: {
    color: 'red',
  },

  cardPrincipal: {
    width: '100%',
    marginVertical: '7%',
    backgroundColor: '#5c5c5c',
    height: '6%',
    borderRadius: 15,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  titleCP: {
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: '900',
    paddingBottom: 2,
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
    width: '40%',
    bottom: '35%',
    height: '35%',
    left: '28%',
    marginRight: '10%',
  },
  logo: {
    position: 'absolute',
    width: '10%',
    right: '5%',
    height: '80%',
    bottom: '10%',
  },
});

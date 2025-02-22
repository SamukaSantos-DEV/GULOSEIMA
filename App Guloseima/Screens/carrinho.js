import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Clipboard, ToastAndroid, Animated, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { isAuthenticated } from '../autent';
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

const CarrinhoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [estudanteId, setEstudanteId] = useState(null); // Utilize useState para armazenar o estudanteId

  const navigateToCardapio = () => {
    navigation.navigate('Cardapio', { adicionarAoCarrinho });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [estudante, setEstudante] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [meioPagamento, setMeioPagamento] = useState(true);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const obterEstudanteId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setEstudanteId(id);
    console.log("id do usuario " + id);
  };

  const carregarDados = async () => {
    try {
      const produtosResponse = await axiosInstance.get(`/puxarDoCarrinho.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
      if (produtosResponse.status === 200) {
        setProdutos(produtosResponse.data);
      }

      const horariosResponse = await axiosInstance.get(`/puxarHorario.php`);
      if (horariosResponse.status === 200) {
        setHorarios(horariosResponse.data);
      }
      setCarregando(false);
    }

    catch (error) {
      console.error('Erro ao carregar produtos: ', error);
      setProdutos([]); // Configura produtos como vazio para exceções
      setCarregando(false);
    }
  };

  useEffect(() => {
    obterEstudanteId();
    carregarDados();
  }, []);

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


  const [animacoes, setAnimacoes] = useState({}); // Estado para controlar animações

  const atualizarCarrinho = async (produtoId, acao) => {
    try {
      console.log(`Ação: ${acao} para produto: ${produtoId}`);
      console.log(`Estudante: ` + estudanteId);
      const response = await axiosInstance.post('/puxarDoCarrinho.php', {
        produto_id: produtoId,
        estudante_id: estudanteId,
        acao: acao
      });

      if (response.status === 200) {
        if (response.data.success) {
          const produtosResponse = await axiosInstance.get(`/puxarDoCarrinho.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
          if (produtosResponse.status === 200) {
            setProdutos(produtosResponse.data);
            // Verifica se a quantidade do produto é zero
            const produtoAtualizado = produtosResponse.data.find(p => p.id === produtoId);
            if (produtoAtualizado && produtoAtualizado.quantidade === 0) {
              iniciarAnimacao(produtoId); // Inicia a animação se a quantidade for zero
            }
          }
        } else if (response.data.error) {
          ToastAndroid.show('Produto indisponível no momento.', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar carrinho: ', error);
      setProdutos([]);
    }
  };


  const finalizar = async () => {
    try {
      const response = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`)
      console.log('Resposta bruta:', response.data);

      let saldo = response.data;

      if (Array.isArray(saldo) && saldo.length >= 0) {
        const usuario = saldo[0];
        console.log("Saldo: ", usuario.saldo);

        if (meioPagamento == 'retirada') {
          try {
            const responsePedido = await axiosInstance.post('/criarPedidoRetirada.php', {
              estudante_id: await AsyncStorage.getItem('userId'),
              valor: totalCarrinho.toFixed(2),
              horario: selectedHorario
            });

            console.log(responsePedido.status);

            if (responsePedido.status === 200) {
              alert("Seu pedido foi realizado com sucesso, pague na retirada!");
              setModalVisible(false);
              setModalVisible2(false);
              carregarDados();
            }
          }
        catch (error) {
            console.error('Erro ao criar pedido:', error.response ? error.response.data : error.message);
            alert("A quantidade de um produto solicitado não está disponível.");
            setModalVisible(false);
            setModalVisible2(false);
            carregarDados();
          }
        }
        else if (parseFloat(usuario.saldo) >= totalCarrinho.toFixed(2) && meioPagamento == 'carteira') {
          try {
            const responsePedido = await axiosInstance.post('/criarPedido.php', {
              estudante_id: await AsyncStorage.getItem('userId'),
              valor: totalCarrinho.toFixed(2),
              horario: selectedHorario
            });

            if (responsePedido.status === 200) {
              alert("Sua compra foi realizada com sucesso!");
              setModalVisible(false);
              setModalVisible2(false);
              carregarDados();
            }
          }

          catch (error) {
            console.error('Erro ao criar pedido:', error.response ? error.response.data : error.message);
            alert("A quantidade de um produto solicitado não esta disponível.");
          }
        }

        else {
          alert("Selecione um método de pagamento");
        }
      }

      else {
        console.error("Formato de resposta inesperado:", saldo);
      }

    }

    catch (error) {
      console.error('Erro ao realizar a compra: ', error);
      alert("Algum erro ocorreu.");
    }
  };

  const verificaHorario = async () => {
    try {
      // Verifica se um horário foi selecionado
      if (selectedHorario) {
        setModalVisible(true);
        console.log(selectedHorario);
      }
      else {
        alert("Por favor, selecione um horário para retirar seu pedido.");
      }
    }
    catch (error) {
      console.log("Algo deu errado: ", error);
    }
  }

  const cancelar = () => {
    setModalVisible(false);
    setModalVisible2(false);
  }

  const [selectedHorario, setSelectedHorario] = useState(null);
  const totalCarrinho = produtos.reduce((acc, item) => acc + item.valor * item.quantidade, 0);

  const renderizarProdutos = () => {
    if (carregando) {
      return <ActivityIndicator size="large" color="#4285F4" />;
    }

    if (produtos.length === 0) {
      return (
        <View style={styles.semItensContainer}>
          <Text style={styles.semItensTexto}>Carrinho vazio</Text>
        </View>
      );
    }

    return (
      <ScrollView style={{ marginBottom: '25%', }}>
        {produtos.map((produto, index) => (
          <Animated.View style={styles.cards} key={index}>
            <View style={styles.superiorCard}>
              <Image source={{ uri: produto.imagem }} />
              <Text style={styles.titlecard}>{produto.nomeProd}</Text>
              <TouchableOpacity onPress={() => atualizarCarrinho(produto.id, 'aumentar')} style={styles.aumentar}>
                <Text style={styles.textAumentarDiminuir}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inferiorCard}>
              <View style={styles.txtinferiorCard}>
                <Text style={styles.textoInferior}>{produto.tipoProduto}</Text>
                <Text style={{ fontSize: 15, color: 'black', minWidth: '20%', }}>       x{produto.quantidade}</Text>
                <Text style={styles.preco}>R$ {produto.valor ? parseFloat(produto.valor).toFixed(2) : "0.00"}</Text>
              </View>
              <TouchableOpacity onPress={() => atualizarCarrinho(produto.id, 'diminuir')} style={styles.diminuir}>
                <Text style={styles.textAumentarDiminuir}>-</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mnsuperios}>
        <TouchableOpacity style={styles.menuButton} onPress={navigation.goBack}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png' }}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Image source={require('../assets/TituloCarrinho.png')} style={styles.title} />
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.tela}>
        {renderizarProdutos()}
        {produtos.length > 0 && (
          <View style={styles.finalizarContainer}>
            <TouchableOpacity style={styles.btnComprar} onPress={() => setModalVisible2(true)}>
              <Text style={styles.textoBotaoComprar}>FINALIZAR</Text>
            </TouchableOpacity>
            <View style={styles.valor}>
              <Text style={styles.textoValorTotal}>Total: R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textoTituloModal}>Selecione um horário para retirar seu pedido</Text>
            {horarios.map((horario) => (
              <TouchableOpacity
                key={horario.id}
                onPress={() => setSelectedHorario(horario.id.toString())}
                style={[
                  styles.textoHorario,
                  selectedHorario === horario.id.toString() && styles.selectedHorario
                ]}
              >
                <RadioButton
                  color="black"
                  uncheckedColor="#bdbdbd"
                  value={horario.id.toString()}
                  status={selectedHorario === horario.id.toString() ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedHorario(horario.id.toString())}
                />
                <Text style={{ fontSize: 16, fontWeight: '700' }}>{horario.horario}</Text>
              </TouchableOpacity>
            ))}
            <View
              style={{
                height: 1,
                width: 300,
                marginVertical: 16,
                backgroundColor: 'black',
              }}
            />
            <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10, justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.btnCancel} onPress={cancelar}>
                <Text style={styles.textoBotaoCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnFinal}
                onPress={verificaHorario}
              >
                <Text style={styles.textoBotaoFinal}>Selecionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textoTituloModal}>Finalização de compra</Text>
            <Text style={styles.textoTituloModal}>Itens</Text>
            {produtos.map((produto, index) => (
              <View style={styles.itemCarrinho} key={index}>
                <Text style={styles.textoItem}>{produto.nomeProd}: </Text>
                <Text style={styles.textoItem}>R$ {produto.valor ? parseFloat(produto.valor).toFixed(2) : "0.00"}</Text>
                <Text style={styles.textoItem}>X{produto.quantidade} = </Text>
                <Text style={styles.textoItem}>{(produto.valor * produto.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.textoTotal}>Total: </Text>
              <Text style={styles.textoTotal}>R$ {totalCarrinho.toFixed(2)}</Text>
            </View>
            <View
              style={{
                height: 1,
                width: 300,
                marginVertical: 10,
                backgroundColor: 'black',
              }}
            />

            <Text style={styles.textoTituloModal}>Método de Pagamento</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => setMeioPagamento(itemValue)}
              items={[
                { label: 'Saldo da carteira', value: 'carteira' },
                { label: 'Pagamento na retirada', value: 'retirada' },
              ]}
              style={{
                inputIOS: {
                  height: 50,
                  width: '100%',
                  paddingHorizontal: 10,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginBottom: 10,
                },
                inputAndroid: {
                  height: 50,
                  width: '100%',
                  paddingHorizontal: 10,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginBottom: 10,
                },
              }}
              placeholder={{ label: 'Selecione um método...', value: null }} // Placeholder
            />

            <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10, justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.btnCancel} onPress={cancelar}>
                <Text style={styles.textoBotaoCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnFinal} onPress={finalizar}>
                <Text style={styles.textoBotaoFinal}>Finalizar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textoAviso}>Ao clicar em finalizar, o valor do pedido será descontado de seu saldo caso o método de pagamento esteja selecionado como "carteira". Caso não possua saldo suficiente a compra não será realizada,
              caso possua saldo suficiente a compra será feita e esta tela será fechada automaticamente. É possível ver detalhes de seu pedido na tela "Meus Pedidos".</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textoHorario: {
    minWidth: '100%',
    flexDirection: 'row',
    backgroundColor: '#ebebeb',
    borderRadius: 7,
    alignItems: 'center',
    padding: 6,
    marginVertical: 3,
  },
  selectedHorario: {
    backgroundColor: '#fac35a',
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
    width: 40,
    height: 40,
    resizeMode: 'contain',
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  tela: {
    flex: 1,
    backgroundColor: '#1C2120',
  },
  cards: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    marginBottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 30,

  },

  superiorCard: {
    flexDirection: 'row',
  },
  titlecard: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },

  aumentar: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#d9d9d9',
    width: 40,
    borderRadius: 5,
  },
  diminuir: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#d9d9d9',
    width: 40,
    borderRadius: 5,
  },
  textAumentarDiminuir: {

    textAlign: 'center',
    fontSize: 26,
  },
  inferiorCard: {
    flexDirection: 'row',
    marginVertical: '2%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtinferiorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
  },
  textoInferior: {
    fontSize: 14,
    color: '#a6a4a4',
    minWidth: '20%',
  },
  preco: {
    color: 'green',
    fontSize: 18,
  },
  finalizarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '12%',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: '4%',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  btnComprar: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    borderRadius: 10,
  },
  textoBotaoComprar: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  valor: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoValorTotal: {
    fontSize: 17,
    textAlign: 'center',
  },
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.2)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoTituloModal: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 17,
  },
  itemCarrinho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '7%',
  },
  textoItem: {
    fontSize: 15,
    color: 'black',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  textoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnCancel: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '49%',
  },
  textoBotaoCancel: {
    color: '#E26A05',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  btnFinal: {
    backgroundColor: '#E26A05',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '49%',
  },
  textoBotaoFinal: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textoAviso: {
    fontSize: 13,
    textAlign: 'justify',
  },
  semItensContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semItensTexto: {
    fontSize: 18,
    color: 'white',
  },
});

export default CarrinhoScreen;

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Animated,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  ToastAndroid,
  Dimensions
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import axiosInstance, { isAuthenticated } from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const Menu = ({ isOpen, toggleMenu }) => {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [saldoVisivel, setSaldoVisivel] = useState(false);

  const toggleSaldoVisivel = () => {
    setSaldoVisivel(!saldoVisivel);
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
        console.log(usuarioResponse.data)
      }

      const pedidosResponse = await axiosInstance.get(`/puxarUsuario.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
      if (pedidosResponse.status === 200) {
        setUsuarios(pedidosResponse.data);
        console.log(pedidosResponse.data)
      }
      setCarregando(false);
    }

    catch (error) {
      console.error('Erro ao carregar usuario: ', error);
      setUsuarios([]);
      setCarregando(false);
    }
  };



  useEffect(() => {
    obterEstudanteId();
    carregarDados();
  },
    []);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados(); // Recarrega os dados sempre que a tela ganhar foco
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToPedidos = () => {
    navigation.navigate('Pedidos');
  };

  const navigateToConta = () => {
    navigation.navigate('Conta');
  };

  const navigateToSobre = () => {
    navigation.navigate('Sobre');
  };

  const navigateToCarrinho = () => {
    navigation.navigate('Carrinho');
  };

  const navigateToUsar = () => {
    navigation.navigate('ComoUsar');
  };
  const navigateToSugestao = () => {
    navigation.navigate('Sugestao');
  };
  const navigateToFeedback = () => {
    navigation.navigate('Feedback');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('estaLogado');
      setUsuarios([]);
      toggleMenu();
      navigation.navigate('Splash');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };





  return (
    <View style={styles.menu}>
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={navigateToConta} style={{ width: '80%' }}>
          {usuarios.map((usuario, index) => (
            <View style={styles.leftContent}>
              <Text style={styles.nomeUser}>
                {usuario.nome}
              </Text>
            </View>
          ))}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSaldoVisivel} style={{
          marginLeft: '75%',
          position: 'absolute',
          backgroundColor: 'grey',
          padding: 10,
          borderRadius: 7,
        }}>
          <Icon name={saldoVisivel ? 'visibility-off' : 'visibility'} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor: 'grey',
          padding: 11,
          borderRadius: 7,
        }} onPress={toggleMenu}>
          <Image
            style={styles.closeText}
            source={{
              uri: 'https://flaticons.net/icon.php?slug_category=mobile-application&slug_icon=close',
            }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{ width: '70%' }} onPress={toggleSaldoVisivel}>
        {usuarios.map((usuario, index) => (
          <View style={styles.leftContent} key={index}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: 'white',
            }}>
              {saldoVisivel ? `R$ ${usuario.saldo}` : 'R$ •••• '}
            </Text>

          </View>
        ))}
      </TouchableOpacity>


      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: 'white',
          marginVertical: 7,
          marginBottom: '5%',
        }}
      />

      <TouchableOpacity onPress={navigateToConta}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/552/552848.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
          <Text style={styles.textoBotaoLog}>Minha conta</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToCarrinho}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/2838/2838895.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
          <Text style={styles.textoBotaoLog}>Carrinho</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToPedidos}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/1008/1008010.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
          <Text style={styles.textoBotaoLog}>Meus Pedidos</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToUsar}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/471/471664.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
          <Text style={styles.textoBotaoLog}>Como usar</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSobre}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/471/471662.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
          <Text style={styles.textoBotaoLog}>Sobre</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSugestao}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4714/4714846.png',
            }}
          />
          <Text style={styles.textoBotaoLog}>Sugestão</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToFeedback}>
        <View style={styles.btnMenu}>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/5410/5410552.png',
            }}
          />
          <Text style={styles.textoBotaoLog}>Feedback</Text>
          <Image
            style={styles.iconOpt}
            source={{
              uri: 'https://cdn-icons-png.freepik.com/256/3682/3682892.png?ga=GA1.1.1995589185.1710801446&',
            }}
          />
        </View>
      </TouchableOpacity>

      <View
        style={{
          height: '13%',
          width: '100%',
          left: 30,
          bottom: 0,
          position: 'absolute',
        }}>
        <TouchableOpacity onPress={logout}>
          <View style={styles.btnLgt}>
            <Image
              style={styles.iconOpt}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/3596/3596141.png?ga=GA1.1.1995589185.1710801446&',
              }}
            />
            <Text style={{
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
              width: '90%',
              fontSize: 20,
            }}>Sair da conta</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Content = () => {

  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalPedidosAP, setTotalPedidosAP] = useState(0);

  const contarPedidos = async () => {
    try {
      const estudanteId = await AsyncStorage.getItem('userId');
      const response = await axiosInstance.get(`/contarPedidos.php?estudante_id=${estudanteId}`);

      if (response.status === 200) {
        setTotalPedidos(response.data.totalPedidos); // Atualiza o estado com o total de pedidos aguardando retirada
        setTotalPedidosAP(response.data.totalPedidosAP); // Atualiza o estado com o total de pedidos aguardando pagamento
      } else {
        console.error('Erro ao contar pedidos:', response.status);
        setTotalPedidos(0);
        setTotalPedidosAP(0); // Reseta também o totalPedidosAP em caso de erro
      }
    } catch (error) {
      console.error('Erro ao contar pedidos:', error);
      setTotalPedidos(0);
      setTotalPedidosAP(0); // Reseta também o totalPedidosAP em caso de erro
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados(); // Recarrega outros dados
      contarPedidos(); // Atualiza a quantidade de pedidos
    });

    return unsubscribe;
  }, [navigation]);

  const navigation = useNavigation();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigateToPedidos = () => {
    navigation.navigate('Pedidos');
  };

  const navigateToCarrinho = () => {
    navigation.navigate('Carrinho');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [telainferiorVisible, setTelainferiorVisible] = useState(true);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);

  const [mnsuperior, setmnsuperior] = useState(true);
  const [slideAnimation] = useState(new Animated.Value(1));

  const toggleTelainferior = () => {
    Animated.timing(slideAnimation, {
      toValue: telainferiorVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTelainferiorVisible(!telainferiorVisible);
    });
  };

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: telainferiorVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [telainferiorVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTelainferiorVisible(false);
        setFiltrosVisiveis(false);
        setmnsuperior(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTelainferiorVisible(true);
        setFiltrosVisiveis(true);
        setmnsuperior(true);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);

  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    try {
      const produtosResponse = await axiosInstance.get('/cardapioProduto.php');

      if (produtosResponse.status === 200) {
        setProdutos(produtosResponse.data);
        setProdutosFiltrados(produtosResponse.data);
        console.log(produtosResponse.data);
        setCarregando(false);
      }
    }

    catch (error) {
      console.error('Algo deu errado: ', error);
      setCarregando(false);
    }

    try {
      const tiposResponse = await axiosInstance.get('/cardapioTipo.php');
      if (tiposResponse.status === 200) {
        setTipos(tiposResponse.data);
        console.log(tiposResponse.data);
        setCarregando(false);
      }
    }

    catch (error) {
      console.error('Algo deu errado: ', error);
      setCarregando(false);
    }

    try {
      const carrinhoResponse = await axiosInstance.get(`/puxarDoCarrinho.php?estudante_id=${await AsyncStorage.getItem('userId')}`);
      if (carrinhoResponse.status === 200) {
        setCarrinho(carrinhoResponse.data);
      }
    }

    catch (error) {
      console.error('Algo deu errado no carrinho: ', error);
      setCarrinho([]);
      setCarregando(false);
    }

    await buscarFavoritos();

    setCarregando(false);
  };

  useEffect(() => {


    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados(); // Recarrega os dados sempre que a tela ganhar foco
    });

    return unsubscribe;
  }, []);

  useEffect(() => {

  }, [navigation]);

  const filtrarProdutos = (tipoProduto) => {
    if (tipoSelecionado === tipoProduto) {
      setTipoSelecionado(null);
      setProdutosFiltrados(produtos);
      setFavoritosAtivos(false);
    } else {
      const produtosFiltrados = produtos.filter(
        (produto) => produto.tipoProduto === tipoProduto
      );
      setTipoSelecionado(tipoProduto);
      setProdutosFiltrados(produtosFiltrados);
      setFavoritosAtivos(false);
    }
  };

  const [searchText, setSearchText] = useState('');

  const filtrarPorNome = (text) => {
    const textoFiltrado = text.toLowerCase();
    const produtosFiltrados = produtos.filter(
      (produto) => produto.nomeProd.toLowerCase().includes(textoFiltrado)
    );
    setProdutosFiltrados(produtosFiltrados);
    setSearchText(text);
  };

  useEffect(() => {
    if (tipoSelecionado) {
      const produtosFiltrados = produtos.filter(
        (produto) => produto.tipoProduto === tipoSelecionado && produto.nomeProd.toLowerCase().includes(searchText.toLowerCase())
      );
      setProdutosFiltrados(produtosFiltrados);
    }
    else if (favoritosAtivos === true) {
      const produtosFavoritosFiltrados = favoritos.filter((produto) =>
        produto.nomeProd.toLowerCase().includes(searchText.toLowerCase())
      );
      setProdutosFiltrados(produtosFavoritosFiltrados);
    }
    else {
      const produtosFiltrados = produtos.filter((produto) => produto.nomeProd.toLowerCase().includes(searchText.toLowerCase())
      );
      setProdutosFiltrados(produtosFiltrados);
    }
  }, [tipoSelecionado, produtos, searchText]);


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

  const [favoritos, setFavoritos] = useState([]); // Lista de produtos favoritos
  const [favoritosAtivos, setFavoritosAtivos] = useState(false); // Estado para controle de favoritos

  const toggleFavoritos = async () => {
    // Desativa o filtro de favoritos se estiver ativado
    if (favoritosAtivos) {
      setFavoritosAtivos(false);
      setProdutosFiltrados(produtos);
    } else {
      setTipoSelecionado(null);
      const produtosFavoritos = await buscarFavoritos();
      setFavoritosAtivos(true);
      const produtosFavoritosFiltrados = produtosFavoritos.filter((produto) =>
        produto.nomeProd.toLowerCase().includes(searchText.toLowerCase())
      );
      setProdutosFiltrados(produtosFavoritosFiltrados);
    }
  };

  const buscarFavoritos = async () => {
    try {
      const estudanteId = await AsyncStorage.getItem('userId');
      const response = await axiosInstance.get(`/cardapioFavorito.php?estudante_id=${estudanteId}`);
      if (response.status === 200) {
        console.log("Favoritos response data:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          console.log("Favoritos response data:", response.data);
          setFavoritos(response.data);
          return response.data;
        } else {
          console.error("Erro ao buscar favoritos:", response.status);
        }
      }
    }
    catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const adicionaFavorito = async (produto) => {
    try {
      const estudanteId = await AsyncStorage.getItem('userId');

      const response = await axiosInstance.post('/adicionaFavorito.php', {


        estudante_id: estudanteId,
        produto_id: produto.id,
      });

      if (response.status === 200) {
        // Alterna o estado do produto em favoritos
        const isFavoritoAtual = isFavorito(produto);
        if (isFavoritoAtual) {
          const novosFavoritos = favoritos.filter(f => f.FK_produto_id !== produto.id);
          setFavoritos(novosFavoritos);

          if (favoritosAtivos) {
            const novosProdutosFiltrados = produtosFiltrados.filter(p => p.id !== produto.id);
            console.log("Novos produtos filtrados:", novosProdutosFiltrados);
            setProdutosFiltrados(novosProdutosFiltrados);

            // Se a lista de favoritos ficar vazia, desativa o filtro
            if (novosFavoritos.length === 0) {
              setFavoritosAtivos(false); // Desativa o filtro
              setProdutosFiltrados(produtos); // Volta à lista completa de produtos
            }
          }
        } else {
          setFavoritos([...favoritos, { FK_produto_id: produto.id }]);
        }
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Erro ao adicionar/remover produto dos favoritos:', error);


    }
  };

  const isFavorito = (produto) => {
    if (!Array.isArray(favoritos)) {
      console.error('Favoritos is not an array:', favoritos);
      return false; // Handle as needed
    }
    return favoritos.some((fav) => fav.FK_produto_id === produto.id);
  };

  const adicionarAoCarrinho = async (produto) => {
    try {
      const response = await axiosInstance.post('/adicionarAoCarrinho.php', {
        produto_id: produto.id,
        estudante_id: await AsyncStorage.getItem('userId'), // Supondo que você tenha uma função isAuthenticated() para obter o usuário autenticado
        valor: produto.valor,
      });

      if (response.status === 200) {
        // Lógica para atualizar o estado do carrinho no frontend, se necessário
        console.log('Produto adicionado ao carrinho com sucesso!');
        ToastAndroid.show('Produto adicionado ao carrinho com sucesso!', ToastAndroid.SHORT);
        carregarDados();
      }
    }
    catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      ToastAndroid.show('Produto indisponível no momento.', ToastAndroid.SHORT);
    }
  };

  const calcularTotal = () => {
    const valorTotal = carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);

    if (valorTotal === 0) {
      return 0;
    } else {
      return carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    }
  };

  return (
    <SideMenu
      menu={<Menu isOpen={isOpen} toggleMenu={toggleMenu} />}
      isOpen={isOpen}
      onChange={(isOpen) => setIsOpen(isOpen)}
      openMenuOffset={490}>
      <TouchableWithoutFeedback onPress={() => isOpen && setIsOpen(false)}>
        <View style={styles.tela}>

          {mnsuperior && (
            <View style={styles.mnsuperios}>
              <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Image
                  source={{
                    uri: 'https://static-00.iconduck.com/assets.00/burger-menu-5-icon-2048x1536-qq497e5y.png',
                  }}
                  style={styles.menuIcon}
                />
              </TouchableOpacity>
              <Image
                source={require('../assets/Titulo.png')}
                style={styles.title}
              />
              <Image source={require('../assets/Logo.png')} style={styles.logo} />
            </View>
          )}

          <View style={styles.telaprincial}>
            <TextInput
              style={styles.input}
              placeholder="Pesquisar..."
              placeholderTextColor="#A9A9A9"
              onChangeText={filtrarPorNome}
              value={searchText}
            />

            {carregando ? (
              <ActivityIndicator size="large" color="#4285F4" />
            ) : tipos.length === 0 ? (
              <Text style={styles.mensagem}>
                Não há tipos de produtos cadastrados
              </Text>
            ) : (
              filtrosVisiveis && (
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.scrollViewFiltro}
                  showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[styles.btnfiltro, favoritosAtivos ? styles.btnfiltroSelecionado : {}]}
                    onPress={toggleFavoritos}>
                    <Text style={[styles.textobtnfitro, favoritosAtivos ? styles.textobtnfitroSelecionado : {}]}>
                      Favoritos
                    </Text>
                  </TouchableOpacity>
                  {tipos.map((tipo, index) => (
                    <View style={styles.filtro} key={index}>
                      <TouchableOpacity
                        style={[
                          styles.btnfiltro,
                          tipoSelecionado === tipo.tipoProduto ? styles.btnfiltroSelecionado : {},
                        ]}
                        onPress={() => filtrarProdutos(tipo.tipoProduto)}>
                        <Text
                          style={[
                            styles.textobtnfitro,
                            tipoSelecionado === tipo.tipoProduto ? styles.textobtnfitroSelecionado : {},
                          ]}>
                          {tipo.tipoProduto}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )
            )}
          </View>


          {carregando ? (
            <ActivityIndicator size="large" color="#4285F4" />
          ) : produtos.length === 0 ? (
            <Text style={styles.mensagem}>Não há produtos cadastrados</Text>
          ) : produtosFiltrados.length === 0 ? (
            <Text style={styles.mensagem}>Nenhum produto encontrado</Text>
          ) : (

            <ScrollView style={{ marginBottom: '20%', top: '-8%', overflow: 'scroll' }}>
              {produtosFiltrados.map((produto, index) => (

                <View style={styles.card} key={index}>
                  <Image source={{ uri: 'http://192.168.1.104/GuloseimaSite/' + produto.imagem }} style={styles.img} />
                  <View style={styles.superiorCard}>
                    <Text style={styles.titlecard}>{produto.nomeProd.length > 11 ? produto.nomeProd.substring(0, 11) + '..' : produto.nomeProd}</Text>
                    <TouchableOpacity
                      onPress={() => adicionarAoCarrinho(produto)}
                      style={styles.adcart}>
                      <Image
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/128/4379/4379542.png',
                        }}
                        style={{ width: '38%', height: '61%', tintColor: '#E26A05' }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adicionaFavorito(produto)}
                      style={styles.adfav}>
                      <Image
                        source={{
                          uri: isFavorito(produto)
                            ? 'https://cdn-icons-png.flaticon.com/128/149/149763.png'
                            : 'https://cdn-icons-png.flaticon.com/128/1828/1828970.png',
                        }}
                        style={{ width: '36%', height: '61%' }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inferiorCard}>
                    <Text style={styles.option}>{produto.tipoProduto}</Text>
                    <Text style={styles.quantidade}>x{produto.quantidade}</Text>
                    <Text
                      style={styles.valor}>
                      R$ {produto.valor ? parseFloat(produto.valor).toFixed(2) : "0.00"}
                    </Text>
                  </View>


                </View>
              ))}
              {favoritosAtivos && favoritos.length === 0 && (
                <Text style={styles.mensagem}>Não há produtos favoritos</Text>
              )}
            </ScrollView>
          )}


          <Animated.View
            style={[
              styles.telainferior,
              {
                transform: [
                  {
                    translateY: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [110, 0],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity onPress={toggleTelainferior}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png',
                }}
                style={styles.octInf}
              />
            </TouchableOpacity>
            <View style={styles.telainferiorbtn}>
              <TouchableOpacity
                style={styles.btnInf}
                onPress={navigateToCarrinho}>
                <Text style={styles.titleBtn}>Carrinho</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{
                      uri: 'https://cdn.icon-icons.com/icons2/37/PNG/512/bagofmoney_dollar_4399.png',
                    }}
                    style={{
                      tintColor: '#E26A05',
                      width: 25,
                      height: 25,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ fontWeight: '600' }}>R$: </Text>
                  <Text>{calcularTotal().toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnInf}
                onPress={navigateToPedidos}>
                <Text style={styles.titleBtn}>Meus Pedidos</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/726/726568.png',
                    }}
                    style={{
                      tintColor: '#E26A05',
                      width: 23,
                      height: 23,
                    }}
                  />
                  <View style={{ backgroundColor: '#d68904', width: 25, height: 25, marginLeft: 10, justifyContent: 'center', borderRadius: 12, }}>
                    <Text style={{ color: 'white', fontWeight: '800', textAlign: 'center', }}>{totalPedidosAP}</Text>
                  </View>
                  <View style={{ backgroundColor: 'green', width: 25, height: 25, marginLeft: 10, justifyContent: 'center', borderRadius: 12, }}>
                    <Text style={{ color: 'white', fontWeight: '800', textAlign: 'center', }}>{totalPedidos}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {!telainferiorVisible && (
            <TouchableOpacity
              style={{
                bottom: 0,
                position: 'absolute',
                width: '100%',
                height: 50,
                backgroundColor: '#E26A05',
              }}
              onPress={toggleTelainferior}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png',
                }}
                style={{
                  width: 25,
                  height: 25,
                  transform: [{ rotate: '270deg' }],
                  right: '5%',
                  bottom: 10,
                  marginTop: 30,
                  position: 'absolute',
                  tintColor: 'white',
                }}
              />

              <View style={styles.carrinho}>
                <TouchableOpacity onPress={toggleTelainferior}></TouchableOpacity>

                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/3081/3081822.png',
                  }}
                  style={{ width: 50, height: 50, tintColor: 'white' }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SideMenu>
  );
};

const styles = StyleSheet.create({
  mensagem: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '84%',
    backgroundColor: 'white',
    height: 120,
    borderRadius: 18,
    paddingRight: 30,
    paddingLeft: '22%',
    paddingVertical: '3%',
    marginHorizontal: '8%',
    marginBottom: '4%',
    justifyContent: 'flex-start',
  },
  img: {
    position: 'absolute',
    width: '30%',
    height: '88%',
    left: '7%',
    top: '20%',
    borderRadius: 15,
  },
  superiorCard: {
    flexDirection: 'row',
    Height: '12%',
    alignItems: 'center',
  },
  titlecard: {
    marginTop: '6%',
    fontSize: 15,
    maxWidth: '44%',
    fontWeight: '800',
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  adcart: {
    position: 'absolute',
    borderRadius: 8,
    right: 0,
    top: '20%',
    width: '25%',
    height: 40,
    backgroundColor: '#f7f7f7',
    borderWidth: 1.5,
    borderColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  adfav: {
    position: 'absolute',
    borderRadius: 8,
    right: '29%',
    top: '20%',
    width: '25%',
    height: 40,
    backgroundColor: '#f7f7f7',
    borderWidth: 1.5,
    borderColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  inferiorCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: '10%',
  },
  option: {
    fontWeight: '500',
    fontSize: 16,
  },
  quantidade: {
    fontSize: 14,
    fontWeight: '500',
  },
  valor: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },

  telainferiorbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '74%',
    padding: '2.5%',
  },
  btnInf: {
    padding: '2%',
    paddingBottom: '3%',
    paddingHorizontal: '4%',
    backgroundColor: '#F6E6CD',
    width: '50%',
    height: '100%',
    borderRadius: 10,
    marginHorizontal: '1%',
  },
  titleBtn: {
    fontWeight: '800',
    fontSize: 16,
    paddingBottom: '2.1%',
  },
  tela: {
    flex: 1,
    backgroundColor: '#1C2120',
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
    top: '85%',
    left: '7%',    
    borderRadius: 8,
    backgroundColor: '#ff7500',
    padding: 10,
  },
  menuIcon: {
    width: 22,
    height: 22,
  },
  title: {
    width: '40%',
    bottom: '35%',
    height: '40%',
    left: '30%',
    position: 'absolute',
  },
  logo: {
    position: 'absolute',
    width: '10%',
    right: '4%',
    height: '80%',
    bottom: '15%',
  },
  telaprincial: {
    padding: '8%',
    height: '30%',
  },
  input: {
    backgroundColor: '#FDF3E3',
    borderColor: '#E26A05',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    marginHorizontal: 0,
    marginVertical: '5%',
  },
  scrollViewFiltro: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 10,
    height: '50%',
    paddingTop: '4%',
  },

  btnfiltro: {
    backgroundColor: '#E26A05',
    padding: '1%',
    paddingHorizontal: 10,
    height: 40,
    MinWidth: 100,
    marginHorizontal: 4,
    borderRadius: 19,
    justifyContent: 'center',
  },
  btnfiltroSelecionado: {
    backgroundColor: '#F6E6CD',
  },
  textobtnfitro: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
  },
  textobtnfitroSelecionado: {
    color: '#E26A05',
  },
  telainferior: {
    backgroundColor: '#E26A05',
    width: '100%',
    height: '13%',
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  octInf: {
    width: 25,
    height: 25,
    transform: [{ rotate: '90deg' }],
    left: '40%',
    bottom: '10%',
    top: '0%',
    position: 'absolute',
    tintColor: 'white',
  },
  carrinho: {
    resizeMode: 'Center',
    padding: 10,
    left: '5%',
    bottom: '25%',
    position: 'absolute',
    paddingTop: 12,
    backgroundColor: '#E26A05',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
  },
  menu: {
    flex: 1,
    backgroundColor: '#262B2A',
    padding: '5%',
    paddingTop: 60,
    position: 'relative',
    marginRight: '10%',
    width: width * 1.01,
  },
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeText: {
    width: 23,
    height: 23,
  },
  nomeUser: {
    fontSize: 23,
    fontWeight: '800',
    color: 'white',
    textTransform: 'uppercase',
  },
  btnMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#E26A05',
    borderRadius: 25,
    paddingVertical: 10,
    marginVertical: '4%',
    marginHorizontal: '4%',
  },
  btnLgt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#545353',
    position: 'absolute',
    bottom: -60,
    borderRadius: 22,
    paddingVertical: 9,
    marginHorizontal: '4%',
  },
  textoBotaoLog: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 5,
    flexShrink: 1,
  },
  iconOpt: {
    width: 30,
    height: 30,
    marginHorizontal: 0,
    tintColor: 'white',
  },
});

export default Content;

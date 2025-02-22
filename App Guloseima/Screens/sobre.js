import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SobreScreen = () => {
  const navigation = useNavigation();
  const navigateToCardapio = () => {
    navigation.navigate('Cardapio');
  };

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
          source={require('../assets/TituloSobre.png')}
          style={styles.title}
        />
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>

      <ScrollView style={styles.tela}>
        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP}>GULOSEIMA</Text>
          <Text style={styles.txtcardP}>
            GULOSEIMA - Gestão Unificada de Lanches Online com Sistema
            Eletrônico de Interação Móvel e Atendimento.
          </Text>
          <Text style={styles.txtcard}>
            GULOSEIMA é o projeto de Trabalho de Conclusão de Curso (TCC)
            desenvolvido pelos alunos do 3º ano do curso de Desenvolvimento de
            Sistemas (3°DS) com o propósito de aprimorar os serviços da cantina
            da escola. O projeto consiste na criação de um aplicativo móvel que
            permite aos estudantes realizar compras dos produtos oferecidos pela
            cantina de forma prática e conveniente. Além disso, o aplicativo
            também inclui ferramentas de apagamento para melhorar o controle de
            vendas, contribuindo para uma gestão mais eficiente do
            estabelecimento.
          </Text>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.imgsobre}
          />
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>REDE SOCIAL GULOSEIMA</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/guloseima_etec/')
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/174/174855.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#8333b4', fontSize: 18 }}>
              INSTAGRAM
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '80%',
            height: 1,
            backgroundColor: 'black',
            marginTop: '10%',
            marginLeft: '10%',
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            fontWeight: '800',
            paddingVertical: 25,
          }}>
          DESENVOLVEDORES
        </Text>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Ágatha Pereira Lemes</Text>
          <Text style={styles.txtcardP2}>Desenvolvedora e pesquisadora da monografia</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://x.com/agathhaO')
            }>
            <Text
              style={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                fontSize: 22,
                color: 'white',
                marginLeft: 1,
                paddingHorizontal: '3%',
                borderRadius: 6,
              }}>
              𝕏
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>André Luiz Bueno</Text>
          <Text style={styles.txtcardP2}>
            Programador e Modelador do Banco de Dados
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://wa.me/+5519978291038'
              )
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20, }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3536/3536445.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#29A71A', fontSize: 18 }}>
              WHATSAPP
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Filipe Guilherme</Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor da monografia do TCC
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://wa.me/+5519998429605'
              )
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20,}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3536/3536445.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#29A71A', fontSize: 18 }}>
              WHATSAPP
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Gabriel Henrique de Souza</Text>
          <Text style={styles.txtcardP2}>
            Programador e Modelador do Banco de Dados
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://x.com/gabrielsouza0_0?t=XcsEhdGaOQslUJG0zHIuhg&s=08')
            }>
            <Text
              style={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                fontSize: 22,
                color: 'white',
                marginLeft: 1,
                paddingHorizontal: '3%',
                borderRadius: 6,
              }}>
              𝕏
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>
            Gabriel Henrique Marques de Almeida
          </Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor da monografia do TCC
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://m.facebook.com/profile.php?id=100004352739744'
              )
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/733/733547.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#1877F2', fontSize: 18 }}>
              FACEBOOK
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Guilherme Marinho Ritir</Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor de PHP/CSS do site do administrador
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://twitter.com/Utsukushi_otoko')
            }>
            <Text
              style={{
                fontWeight: 'bold',
                backgroundColor: 'black',
                fontSize: 22,
                color: 'white',
                marginLeft: 1,
                paddingHorizontal: '3%',
                borderRadius: 6,
              }}>
              𝕏
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>João Paulo Gomes</Text>
          <Text style={styles.txtcardP2}>Desenvolvedor BACK-END do APP Mobile</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/jo%C3%A3o-paulo-gomes-1bb088255?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
              )
            }>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontWeight: '900',
                  color: '#0077b5',
                  fontSize: 18,
                  paddingRight: 1,
                }}>
                LINKED
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#0077b5',
                  fontSize: 18,
                  color: 'white',
                  marginLeft: 1,
                  paddingHorizontal: '1%',
                  borderRadius: 4,
                }}>
                IN
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Leonardo Gali de Almeida</Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor de PHP/CSS do site do administrador
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/leogali.almeida')
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/174/174855.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#E1306C', fontSize: 18 }}>
              INSTAGRAM
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Luís Gustavo Barbosa Oliveira</Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor e modelador de Banco de Dados com MySQL
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/gu.luis015/')
            } style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/174/174855.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#8333b4', fontSize: 18 }}>
              INSTAGRAM
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>
            Pedro Henrique Cavenaghi dos Santos
          </Text>
          <Text style={styles.txtcardP2}>Desenvolvedor de protótipos</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/pedro._.cavenaghi/')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/1384/1384063.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#f77737', fontSize: 18 }}>
              INSTAGRAM
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPrincipal}>
          <Text style={styles.titleCP2}>Renato Henrique Rodrigues</Text>
          <Text style={styles.txtcardP2}>Desenvolvedor BACK-END do APP Mobile</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/in/renato-rodrigues-31b18b2a5/'
              )
            }>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontWeight: '900',
                  color: '#0077b5',
                  fontSize: 18,
                  paddingRight: 1,
                }}>
                LINKED
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#0077b5',
                  fontSize: 18,
                  color: 'white',
                  marginLeft: 1,
                  paddingHorizontal: '1%',
                  borderRadius: 4,
                }}>
                IN
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '88%',
            margin: '6%',
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '5%',
            shadowColor: '#000',
            shadowOffset: {
              width: 5,
              height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            marginBottom: '15%',
          }}>
          <Text style={styles.titleCP2}>Samuel Santos Oliveira</Text>
          <Text style={styles.txtcardP2}>
            Desenvolvedor FRONT-END do APP Mobile
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@SamukaOliveira7796')}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3128/3128307.png',
              }}
            />
            <Text style={{ paddingLeft: 5, fontWeight: '900', color: '#F00', fontSize: 18 }}>
              YOUTUBE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SobreScreen;
const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#e3e3e3',
  },

  cardPrincipal: {
    width: '88%',
    margin: '6%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1%',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleCP: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    paddingVertical: 20,
    color: '#E26A05',
  },
  txtcardP: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'justify',
  },
  txtcard: {
    fontSize: 18,
    textAlign: 'justify',
    marginVertical: 10,
  },
  imgsobre: {
    marginTop: 10,
    width: '70%',
    height: 200,
  },
  titleCP2: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    paddingBottom: 20,
  },
  txtcardP2: {

    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    paddingBottom: '5%',
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
    width: '28%',
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
});

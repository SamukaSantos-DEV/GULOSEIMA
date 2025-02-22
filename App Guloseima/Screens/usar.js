import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isAuthenticated } from '../autent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ComoUsarScreen = () => {
  const navigation = useNavigation();

  

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mnsuperios}>
        <TouchableOpacity style={styles.menuButton} onPress={navigation.goBack}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10255/10255585.png',
            }}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/TituloUsar.png')}
          style={styles.title}
        />
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
      </View>

      <View style={styles.tela}>
        <Text style={styles.titleCP}>PASSO A PASSO</Text>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: 'black',
            marginVertical: 22,
          }}
        />

        <ScrollView>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>1° Passo - Cadastro/ Login</Text>
            <Text style={styles.txtcard2}>
              Faça um cadastro digitando seus dados nos campos, se já houver
              feito cadastro, basta clicar em já tenho conta e fazer login. Caso
              você tenha esquecido sua senha, basta clicar em 'esqueci minha
              senha' e fazer a confirmação necessária para a redefinição de
              senha.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>
              2° Passo - Autenticando (Opcional)
            </Text>
            <Text style={styles.txtcard2}>
              Ao fazer cadastro, será requisitado um código pelo seu e-mail
              ou número de telefone cadastrado, qua ao ser digitado, liberará o
              acesso ao aplicativo.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>3° Passo - Cardápio</Text>
            <Text style={styles.txtcard2}>
              Ao concluir o processo de login, você chegará a tela de cardápio,
              onde poderá visualizar todos os produtos disponíveis na cantina.
              Na parte superior da tela há um menu onde conterá um botão que ao
              clicá-lo abrirá um menu que conterá todas as telas do aplicativo
              que é possível navegá-las. Voltando a tela principal há um campo
              de pesquisa e botões de filtro pra cada categoria de pedido. Logo
              abaixo nos cards é possível adicionar os pedidos desejados no
              carrinho. O menu inferior é possível deixar oculto clicando na
              seta apontada para baixo, ou deixar visível ao clicar no carrinho,
              nesse menu há 2 botões que pode te redirecionar para meus pedidos
              ou para o carrinho, basta clicar no seu respectivo botão.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>4° Passo - Minha conta</Text>
            <Text style={styles.txtcard2}>
              Pode ser acessada pelo menu na tela de cardápio clicando na opção
              'minha conta' ou clicando no nome de usuário exibida na mesma.
              Nessa tela pode-se ver as informações do usuário, navegar para
              outras telas e logo abaixo atualizar suas informações apenas
              digitando nos campos de texto e será salvo automaticamente. Nos
              botões abaixo é possível redefinir sua senha, ativar a
              autenticação de dois fatores na conta, sair da conta que será
              redirecionado a tela de login, e também excluir a conta.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>5° Passo - Carrinho</Text>
            <Text style={styles.txtcard2}>
              Para acessar essa tela, basta adicionar um produto que será
              redirecionado automaticamente, pode-se acessar pelo menu lateral
              ou o menu inferior. É possível visualizar e remover os pedidos que
              estão no carrinho, e ao clicar em 'finalizar' abrirá um pop-up
              contendo o pedido e mostrará todos os
              produtos a ser pago. Todos os pedidos exibidos no carrinho serão
              comprados ao clicar em 'finalizar'.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>6° Passo - Meus pedidos</Text>
            <Text style={styles.txtcard2}>
              Para abri-la, pode se clicar em 'meus pedidos' tanto no menu
              lateral ou no menu inferior. Nela mostrará todos os pedidos já
              pagos e as informações do mesmo. Ao clicar num pedido, abrirá um
              pop-up que conterá um QR-code para ser mostrado na cantina que
              será lido e entregue o pedido.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>7° Passo - Como usar</Text>
            <Text style={styles.txtcard2}>
              Será redirecionado para essa mesma tela aqui.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>8° Passo - Sobre</Text>
            <Text style={styles.txtcard2}>
              Pode ser acessada pelo menu lateral na tela de cardápio. Nessa
              tela haverá um resumo do nosso projeto e um pouco de informações
              sobre cada um dos representantes desse projeto, há um botão em cor
              destaque para cada desenvolvedor que será redirecionado para o perfil
              dessa pessoa.
            </Text>
          </View>
          <View style={styles.cardPrincipal}>
            <Text style={styles.txtcard}>9° Passo - Sugestão/Feedback</Text>
            <Text style={styles.txtcard2}>
              Pode ser acessada pelo menu lateral na tela de cardápio. Em ambas
              as telas haverá um campo de texto que poderá ser digitado
              livremente tanto uma sugestão quanto um feedback e enviado a nossa
              equipe que será lida posteriormente e analisada por nós.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ComoUsarScreen;
const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#e3e3e3',
    padding: '6%',
  },

  cardPrincipal: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  titleCP: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
  txtcard: {
    fontSize: 20,
    fontWeight: '800',
  },
  txtcard2: {
    fontSize: 17,
    fontWeight: '400',
    marginTop: '3%',
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
    left: '31%',
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

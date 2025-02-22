import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';


import LoginScreen from './Screens/login.js';
import CadastroScreen from './Screens/cadastro.js';
import CardapioScreen from './Screens/cardapio.js';
import MeusPedidosScreen from './Screens/meuspedidos.js';
import MinhaContaScreen from './Screens/minhaconta.js';
import SobreScreen from './Screens/sobre.js';
import CarrinhoScreen from './Screens/carrinho.js';
import ComoUsarScreen from './Screens/usar.js';
import SplashScreen from './Screens/splash.js';
import AutenticarScreen from './Screens/autenticar.js';
import RedefinirScreen from './Screens/redefinirSenha.js';
import NovaScreen from './Screens/novaSenha.js';
import FeedbackScreen from './Screens/feedback.js';
import SugestaoScreen from './Screens/sugestao.js';
import MudarSeScreen from './Screens/mudarSenha.js';
import ExcluirContaScreen from './Screens/excluirConta.js';
import MudarDados from './Screens/redefinirDados.js';
import MudarEmailScreen from './Screens/mudarEmail.js';
import MudarNomeScreen from './Screens/mudarNome.js';
import RecuperarScreen from './Screens/recuperar.js';


import { LogBox } from 'react-native';
if (__DEV__) {LogBox.ignoreAllLogs(true);}


const Stack = createStackNavigator();
const App = () => {
  return (
    
      <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerMode: 'none',
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          >       
            <Stack.Screen name="Splash" component={SplashScreen} />       
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />        
            <Stack.Screen name="Cardapio" component={CardapioScreen} />     
            <Stack.Screen name="Pedidos" component={MeusPedidosScreen} /> 
            <Stack.Screen name="Conta" component={MinhaContaScreen} />
            <Stack.Screen name="Sobre" component={SobreScreen} />
            <Stack.Screen name="Carrinho" component={CarrinhoScreen} />        
            <Stack.Screen name="ComoUsar" component={ComoUsarScreen} />            
            <Stack.Screen name="Autenticar" component={AutenticarScreen} />                       
            <Stack.Screen name="RedefinirSenha" component={RedefinirScreen} />                     
            <Stack.Screen name="NovaSenha" component={NovaScreen} />            
            <Stack.Screen name="Feedback" component={FeedbackScreen} />            
            <Stack.Screen name="Sugestao" component={SugestaoScreen} />
            <Stack.Screen name="MudarSenha" component={MudarSeScreen} />
            <Stack.Screen name="ExcluirConta" component={ExcluirContaScreen} />
            <Stack.Screen name="MudarDados" component={MudarDados} />
            <Stack.Screen name="MudarEmail" component={MudarEmailScreen} />
            <Stack.Screen name="MudarNome" component={MudarNomeScreen} />
            <Stack.Screen name="Recuperar" component={RecuperarScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;

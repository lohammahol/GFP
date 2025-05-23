import React, { useState, useEffect, useLayoutEffect} from 'react';
import  {View, Text, FlatList, Image, TouchableOpacity, RefreshControl} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPreto, corPrincipal } from '../styles/Estilos';
import {enderecoServidor} from '../utils';

export default function categorias({navigation}) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [atualizando, setAtualizando] = useState(false)

    useEffect(() => {
        buscarUsuarioLogado()
    }, [])

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    }

    useEffect(() => {
        buscarUsuarioLogado();
    }, [])

    //Exucuta essa função quando o usuario é alterado
    useEffect(() => {
        buscarDadosAPI();
    }, [usuario])

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
        if (usuarioLogado){
            setUsuario(JSON.parse(usuarioLogado))
        }else{
            navigation.navigate('Login')
        }
    }

    const botaoExcluir = async(id) => {
        try{
            
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`
                }
            });

            if (resposta.ok){
                buscarDadosAPI();
            }
            
        }catch(error){
            console.error('Erro ao Excluir:', error)
        }
    }

    const exibirItemLista = ({item}) => {
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                <View style={{
                    backgroundColor: item.cor, 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10
                }}>
                    <MaterialIcons name={item.icone} size={20} style={corPreto} />
                </View>
                <View style={Estilos.textContainer}>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                    <Text>0,00</Text>
                </View>
                 <MaterialIcons name='edit' size={24} color={corPrincipal}/>


                <MaterialIcons name='delete' size={24} color={corPrincipal} 
                    onPress={() => botaoExcluir(item.id_categoria)}
                />
            </TouchableOpacity>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
                    <MaterialIcons name='add' size={28} color='#fff' style={{marginRight: 15}} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <FlatList 
                    data={dadosLista}
                    renderItem={exibirItemLista}
                    keyExtractor={(item) => item.id_categoria}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={buscarDadosAPI}
                            colors={[corPrincipal]}
                        />
                    }
                />
            </View>
        </View>
    )
}
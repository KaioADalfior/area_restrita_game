import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChatStorage } from '../constants/ChatData'; 

interface Chat {
  id: string;
  name: string;
  lastMsg: string;
  unread: number;
  online: boolean;
  time: string; // Adicionado para o estilo WhatsApp
}

export default function HomeScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const eddyLastMsg = ChatStorage.eddyMessages[ChatStorage.eddyMessages.length - 1].text;
      const eddyTime = ChatStorage.eddyMessages[ChatStorage.eddyMessages.length - 1].time;
      
      const timerEddy = setTimeout(() => {
        setChats(prev => {
          const eddyChat = {
            id: '1',
            name: 'Eddy Dalton',
            lastMsg: eddyLastMsg,
            unread: ChatStorage.eddyFinalized ? 0 : 1,
            online: !ChatStorage.isEddyOffline,
            time: eddyTime,
          };
          return [eddyChat];
        });
      }, 1000);

      if (ChatStorage.eddyFinalized) {
        const timerPerola = setTimeout(() => {
          setChats(prev => {
            if (prev.find(c => c.id === '2')) return prev;
            return [...prev, {
              id: '2',
              name: 'Pérola Sant',
              lastMsg: 'Você viu o grupo?',
              unread: 1,
              online: true,
              time: 'Agora',
            }];
          });
        }, 5000);
        return () => { clearTimeout(timerEddy); clearTimeout(timerPerola); };
      }

      return () => clearTimeout(timerEddy);
    }, [])
  );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => {
        if (item.id === '1') {
          ChatStorage.eddyFinalized = true; 
          router.push('/chats/chat_eddy');
        } else {
          router.push('/chats/chat_perola');
        }
      }}
    >
      <View style={styles.avatarCircle}>
        {item.id === '1' ? (
          <Image 
            source={require('../../assets/images/eddy.png')} 
            style={styles.avatarImage} 
          />
        ) : (
          <View style={styles.placeholderAvatar}>
             <Ionicons name="person" size={32} color="#bfc9d2" />
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>{item.time}</Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho estilo App de Mensagens moderno */}
      <View style={styles.mainHeader}>
        <Text style={styles.headerAppTitle}>Mensagens</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="camera-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList 
        data={chats} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
        contentContainerStyle={styles.listContent} 
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header Style
  mainHeader: {
    backgroundColor: '#075e54', // Verde clássico, mas mais profundo
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerAppTitle: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    marginLeft: 15,
  },

  listContent: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 85, // Alinha o separador com o início do texto
  },

  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#e9edef', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    overflow: 'hidden',
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#111b21',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#667781',
    fontFamily: 'Poppins',
  },
  chatTimeUnread: {
    color: '#25d366',
    fontFamily: 'Poppins-Bold',
  },

  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: 14,
    color: '#667781',
    fontFamily: 'Poppins',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25d366', // Verde vibrante de notificação
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  }
});
import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Image, ImageBackground 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChatStorage } from '../constants/ChatData';

const DIALOGUE_TREE: any = {
  start: {
    options: [
      { text: "Bom dia! Quem é você?", nextNode: "node_identidade" },
      { text: "Como conseguiu meu número?", nextNode: "node_numero" }
    ]
  },
  node_identidade: { 
    response: "Eu sou um velho amigo... ou talvez um novo problema.", 
    options: [{ text: "O que quer de mim?", nextNode: "node_fim" }] 
  },
  node_numero: { 
    response: "Isso não importa agora. O tempo está acabando.", 
    options: [{ text: "Como assim?", nextNode: "node_fim" }] 
  },
  node_fim: { 
    response: "Tenho que ir. Não confie na Pérola.", 
    isTerminal: true 
  }
};

export default function ChatEddyScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState(ChatStorage.eddyMessages);
  const [isOffline, setIsOffline] = useState(ChatStorage.isEddyOffline);
  const [currentNode, setCurrentNode] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    ChatStorage.eddyMessages = messages;
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const handleChoice = (option: any) => {
    setShowOptions(false);
    ChatStorage.eddyFinalized = true;

    const playerMsg = { 
      id: Math.random().toString(), 
      text: option.text, 
      sender: 'player', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, playerMsg]);
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const nextData = DIALOGUE_TREE[option.nextNode];
        if (nextData) {
          const eddyMsg = { 
            id: Math.random().toString(), 
            text: nextData.response, 
            sender: 'eddy', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          };
          setMessages(prev => [...prev, eddyMsg]);
          if (nextData.isTerminal) {
            setIsOffline(true);
            ChatStorage.isEddyOffline = true;
          }
          setCurrentNode(option.nextNode);
        }
      }, 3000);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Image source={require('../../assets/images/eddy.png')} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>Eddy Dalton</Text>
              <Text style={styles.headerStatus}>{isOffline ? 'offline' : 'online'}</Text>
            </View>
          </View>
        ),
        headerStyle: { backgroundColor: '#075e54' }, 
        headerTintColor: '#fff',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerIcons}>
            <TouchableOpacity><Ionicons name="videocam" size={22} color="#fff" style={{marginRight: 15}}/></TouchableOpacity>
            <TouchableOpacity><Ionicons name="call" size={20} color="#fff" style={{marginRight: 10}}/></TouchableOpacity>
            <TouchableOpacity><Ionicons name="ellipsis-vertical" size={20} color="#fff" /></TouchableOpacity>
          </View>
        ),
      }} />

      <ImageBackground 
        // source={require('../../assets/images/chat-bg.png')} // Se tiver um wallpaper leve, use aqui
        style={styles.backgroundImage}
      >
        <ScrollView 
          ref={scrollRef} 
          contentContainerStyle={styles.chatContent}
        >
          {messages.map(msg => (
            <View key={msg.id} style={[styles.messageWrapper, msg.sender === 'player' ? styles.wrapperSent : styles.wrapperReceived]}>
              <View style={[styles.bubble, msg.sender === 'player' ? styles.bubbleS : styles.bubbleR]}>
                <Text style={styles.messageText}>{msg.text}</Text>
                <View style={styles.msgFooter}>
                  <Text style={styles.timeText}>{msg.time}</Text>
                  {msg.sender === 'player' && <Ionicons name="checkmark-done" size={16} color="#4fc3f7" style={{marginLeft: 3}} />}
                </View>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.wrapperReceived}>
              <View style={[styles.bubble, styles.bubbleR]}>
                <ActivityIndicator size="small" color="#667781" />
              </View>
            </View>
          )}

          {isOffline && (
            <View style={styles.offlineBox}>
              <Text style={styles.offlineText}>EDDY DALTON ESTÁ OFFLINE</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>

      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.inputArea, (isTyping || isOffline) && { opacity: 0.6 }]} 
          onPress={() => !isTyping && !isOffline && setShowOptions(true)}
          disabled={isTyping || isOffline}
        >
          <Ionicons name="happy-outline" size={24} color="#667781" />
          <View style={styles.fakeInput}>
            <Text style={styles.placeholder}>
              {isOffline ? "Usuário offline" : "Mensagem"}
            </Text>
          </View>
          <Ionicons name="attach" size={24} color="#667781" style={{transform: [{rotate: '45deg'}]}} />
          <Ionicons name="camera" size={24} color="#667781" style={{marginLeft: 10}} />
        </TouchableOpacity>
        
        <View style={styles.micCircle}>
           <Ionicons name={isTyping || isOffline ? "mic" : "send"} size={22} color="#fff" />
        </View>
      </View>

      <Modal visible={showOptions} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowOptions(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Escolha uma resposta</Text>
          {DIALOGUE_TREE[currentNode]?.options?.map((opt: any, i: number) => (
            <TouchableOpacity key={i} style={styles.optBtn} onPress={() => handleChoice(opt)}>
              <Text style={styles.optText}>{opt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5ddd5' },
  backgroundImage: { flex: 1 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  headerName: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 16 },
  headerStatus: { color: '#fff', fontSize: 11, opacity: 0.8 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginLeft: -10 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  chatContent: { padding: 10, paddingBottom: 20 },
  messageWrapper: { marginBottom: 4, width: '100%' },
  wrapperSent: { alignItems: 'flex-end' },
  wrapperReceived: { alignItems: 'flex-start' },
  
  bubble: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, maxWidth: '85%', elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 1 },
  bubbleR: { backgroundColor: '#fff', borderTopLeftRadius: 0 },
  bubbleS: { backgroundColor: '#dcf8c6', borderTopRightRadius: 0 },
  
  messageText: { fontSize: 15, color: '#111b21', fontFamily: 'Poppins' },
  msgFooter: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 2 },
  timeText: { fontSize: 10, color: '#667781' },

  offlineBox: { alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10, marginVertical: 20, elevation: 2 },
  offlineText: { color: '#667781', fontSize: 11, letterSpacing: 1, fontFamily: 'Poppins-Bold' },

  footer: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'transparent' },
  inputArea: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 12, height: 48 },
  fakeInput: { flex: 1, marginHorizontal: 8 },
  placeholder: { color: '#667781', fontSize: 16 },
  micCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#075e54', justifyContent: 'center', alignItems: 'center', marginLeft: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitle: { fontFamily: 'Poppins-Bold', fontSize: 14, marginBottom: 15, color: '#667781', textAlign: 'center' },
  optBtn: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 10 },
  optText: { fontFamily: 'Poppins', fontSize: 15, color: '#075e54', textAlign: 'center' }
});
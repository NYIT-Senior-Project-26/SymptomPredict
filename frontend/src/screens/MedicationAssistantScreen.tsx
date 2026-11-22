import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MedicationAssistant'>;
};

type Message = { role: 'user' | 'assistant'; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    text: 'Hi! I\'m your Medication Assistant. I can help you understand drug interactions, dosing questions, and OTC recommendations.\n\nYour current medications: Lisinopril · Metformin · Vitamin D3\n\nWhat would you like to know?',
  },
];

const QUICK_QUESTIONS = [
  'Can I take Tylenol with Lisinopril?',
  'What should I avoid with Metformin?',
  'Is it safe to drink alcohol on my meds?',
  'When should I go to the ER?',
];

const MOCK_RESPONSES: Record<string, string> = {
  default: 'That\'s a great question! Based on your medication profile, I\'d recommend consulting with your pharmacist for the most accurate guidance specific to your situation. They can account for your full medication list and health history.',
  tylenol: 'Acetaminophen (Tylenol) has no known interaction with Lisinopril, so it\'s usually the safer choice for pain or fever. Don\'t go over the daily maximum on the label.\n\n⚠️ Avoid ibuprofen and naproxen — they can raise blood pressure and strain your kidneys.',
  metformin: 'With Metformin, avoid:\n• Excessive alcohol (raises lactic acidosis risk)\n• Contrast dye before imaging tests (notify your doctor)\n• Skipping meals (increases hypoglycemia risk)\n\nSources: RxList · openFDA',
};

export default function MedicationAssistantScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);

    setTimeout(() => {
      const lowerMsg = msg.toLowerCase();
      let response = MOCK_RESPONSES.default;
      if (lowerMsg.includes('tylenol') || lowerMsg.includes('acetaminophen')) {
        response = MOCK_RESPONSES.tylenol;
      } else if (lowerMsg.includes('metformin')) {
        response = MOCK_RESPONSES.metformin;
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Medication Assistant</Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>AI · Online</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View key={i} style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              {msg.role === 'assistant' && (
                <View style={styles.assistantAvatar}>
                  <Text style={styles.assistantAvatarText}>💊</Text>
                </View>
              )}
              <View style={[styles.bubbleContent, msg.role === 'user' ? styles.bubbleContentUser : styles.bubbleContentAssistant]}>
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.bubbleTextUser]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.quickSection}>
            <Text style={styles.quickTitle}>Tap a quick question:</Text>
            {QUICK_QUESTIONS.map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => sendMessage(q)}>
                <Text style={styles.quickBtnText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Ask about your medications..."
            placeholderTextColor="#B0BDB8"
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={() => sendMessage()}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12 },
  backText: { fontSize: 16, color: '#1A7A5E', fontWeight: '500' },
  headerCenter: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: '#1A2B25' },
  onlineIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#1A7A5E' },
  onlineText: { fontSize: 12, color: '#6B7C76' },
  chatScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, gap: 8 },
  bubbleUser: { flexDirection: 'row-reverse' },
  bubbleAssistant: { flexDirection: 'row' },
  assistantAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center',
  },
  assistantAvatarText: { fontSize: 16 },
  bubbleContent: { maxWidth: '75%', borderRadius: 16, padding: 12 },
  bubbleContentUser: { backgroundColor: '#1A7A5E', borderBottomRightRadius: 4 },
  bubbleContentAssistant: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E8EFEC' },
  bubbleText: { fontSize: 14, color: '#1A2B25', lineHeight: 20 },
  bubbleTextUser: { color: '#FFFFFF' },
  quickSection: { marginTop: 4 },
  quickTitle: { fontSize: 12, color: '#B0BDB8', marginBottom: 8, textAlign: 'center' },
  quickBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E8EFEC', marginBottom: 6,
  },
  quickBtnText: { fontSize: 13, color: '#1A7A5E', fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#E8EFEC', alignItems: 'flex-end', gap: 8,
    backgroundColor: '#FFFFFF',
  },
  inputField: {
    flex: 1, borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100,
    backgroundColor: '#F8FFFE', color: '#1A2B25',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A7A5E', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#B0C4BC' },
  sendBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});

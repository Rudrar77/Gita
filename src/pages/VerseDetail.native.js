import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

const speakTranslation = async (text, lang) => {
  if (Capacitor.getPlatform() === 'web') {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'english' ? 'en-US' : 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  } else {
    await TextToSpeech.speak({
      text,
      lang: lang === 'english' ? 'en-US' : 'hi-IN',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
    });
  }
};

const VerseDetail = ({ verse }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>श्लोक</Text>
        <Text style={styles.shloka}>{verse.Shloka}</Text>
        {/* Language Toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: selectedLanguage === 'hindi' ? '#c2410c' : '#fff',
              borderColor: '#c2410c',
              borderWidth: 1,
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 18,
              marginRight: 8,
            }}
            onPress={() => setSelectedLanguage('hindi')}
          >
            <Text style={{ color: selectedLanguage === 'hindi' ? '#fff' : '#c2410c', fontWeight: 'bold', fontSize: 16 }}>हिंदी</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: selectedLanguage === 'english' ? '#c2410c' : '#fff',
              borderColor: '#c2410c',
              borderWidth: 1,
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 18,
            }}
            onPress={() => setSelectedLanguage('english')}
          >
            <Text style={{ color: selectedLanguage === 'english' ? '#fff' : '#c2410c', fontWeight: 'bold', fontSize: 16 }}>English</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.meaningHeading}>विवरण</Text>
        <Text style={styles.meaning}>
          {selectedLanguage === 'hindi' ? verse.HinMeaning : verse.EngMeaning}
        </Text>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => speakTranslation(selectedLanguage === 'hindi' ? verse.HinMeaning : verse.EngMeaning, selectedLanguage)}
        >
          <Text style={styles.audioButtonText}>🔊 सुनें</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fdf6ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 247, 230, 0.98)',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#a85d1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#a85d1a',
    textAlign: 'center',
    letterSpacing: 1,
  },
  shloka: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: 'Noto Sans Devanagari', // If available
    color: '#6b1e1e',
    textAlign: 'center',
    lineHeight: 32,
  },
  meaningHeading: {
    fontSize: 18,
    color: '#c2410c',
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  meaning: {
    fontSize: 17,
    marginBottom: 18,
    color: '#3d2c1e',
    textAlign: 'center',
    lineHeight: 26,
  },
  audioButton: {
    backgroundColor: '#c2410c',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#a85d1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default VerseDetail; 
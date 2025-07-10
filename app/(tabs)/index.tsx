import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

type HistoryEntry = {
  expression: string;
  result: string;
};

export default function App() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = (value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        const evalResult = eval(input).toString();
        setResult(evalResult);
        setHistory([{ expression: input, result: evalResult }, ...history]);
      } catch {
        setResult('Error');
      }
    } else if (value === 'Del') {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons: string[][] = [
    ['C', '/', '*', 'Del'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.'],
  ];

  const renderButton = (value: string, key: string) => {
    const isOperator = ['/', '*', '-', '+', '=', 'C', 'Del'].includes(value);
    const buttonStyle = isOperator ? theme.operatorButton : theme.button;

    return (
      <Pressable
        key={key}
        onPress={() => handlePress(value)}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: buttonStyle,
            shadowColor: theme.shadow,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>{value}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: theme.text }]}> Calculator</Text>
        <Switch
          value={!darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
          thumbColor={darkMode ? '#f4f3f4' : '#333'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.dateTimeBox}>
        <Text style={{ color: theme.text, fontSize: 14, opacity: 0.6 }}>{currentTime}</Text>
      </View>

      <View style={[styles.display, { backgroundColor: theme.displayBackground }]}>
        <Text style={[styles.inputText, { color: theme.text }]}>{input || '0'}</Text>
        <Text style={[styles.resultText, { color: theme.result }]}>{result}</Text>
      </View>

      <ScrollView style={styles.historyBox}>
        {history.length === 0 && (
          <Text style={{ color: theme.text, opacity: 0.4, fontSize: 14, textAlign: 'center' }}>
            No history yet
          </Text>
        )}
        {history.map((entry, index) => (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutUp}
            key={`history-${index}`}
            style={styles.historyItem}
          >
            <Text style={{ color: theme.text, opacity: 0.7 }}>
              {entry.expression} = {entry.result}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {buttons.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((btn, j) => renderButton(btn, `btn-${i}-${j}`))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Themes
const darkTheme = {
  background: '#1c1c1e',
  text: '#fefefe',
  button: '#2c2c2e',
  operatorButton: '#5e5ce6',
  result: '#50fa7b',
  shadow: '#000',
  displayBackground: 'rgba(255, 255, 255, 0.05)',
};

const lightTheme = {
  background: '#fdfdfd',
  text: '#1e1e1e',
  button: '#eeeeee',
  operatorButton: '#ffb74d',
  result: '#388e3c',
  shadow: '#ccc',
  displayBackground: '#ffffffcc',
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dateTimeBox: {
    alignItems: 'center',
    marginBottom: 6,
  },
  display: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    minHeight: 110,
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inputText: {
    fontSize: 34,
    textAlign: 'right',
    fontWeight: '300',
  },
  resultText: {
    fontSize: 26,
    textAlign: 'right',
    fontWeight: '600',
    marginTop: 6,
  },
  historyBox: {
    maxHeight: 120,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  historyItem: {
    marginBottom: 6,
  },
  buttonContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '600',
  },
});

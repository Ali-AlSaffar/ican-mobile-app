import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#126DB6', // Your ICAN blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FCFCFC',
    fontSize: 16,
  },
});

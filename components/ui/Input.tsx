import { StyleSheet, TextInput } from 'react-native';

type InputProps = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export default function Input({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
}: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    textAlign: 'right', // RTL for Arabic
  },
});

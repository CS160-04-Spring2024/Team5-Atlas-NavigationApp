import {useState} from 'react'
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {colorTheme, screenHeight} from '../Home_Page'

const PinOverlayInput = ({
  isVisible = false,
  onCancel,
  onSubmit,
  coordinates = [],
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    onCancel()
  }
  const handleSubmit = () => {
    onSubmit(title, description, coordinates)
    setTitle('')
    setDescription('')
  }
  return (
    <Modal transparent={false} visible={isVisible} animationType='slide'>
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          opacity: 0.8,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            height: '50%',
            width: '90%',
            position: 'absolute',
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text style={styles.title}>Create Pin</Text>
          <TextInput
            placeholder='Title'
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.input}
          />
          <TextInput
            multiline={true}
            placeholder='Description'
            value={description}
            onChangeText={text => setDescription(text)}
            style={styles.descInput}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: 'red'}}
              onPress={handleCancel}>
              <Text style={{fontWeight: 'bold'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: colorTheme}}
              onPress={handleSubmit}>
              <Text style={{fontWeight: 'bold'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: screenHeight / 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  input: {
    width: '80%',
    height: screenHeight / 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  descInput: {
    width: '80%',
    height: screenHeight / 8,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
  },
})

export default PinOverlayInput
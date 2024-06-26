import {useState} from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '@firebase/auth'
import {FIREBASE_APP, FIREBASE_AUTH} from '../FirebaseConfig'
import {
  query,
  collection,
  getFirestore,
  setDoc,
  doc,
  getDocs,
  where,
} from '@firebase/firestore'
import FastImage from 'react-native-fast-image'

const screenHeight = Dimensions.get('window').height

export const queryName = async (name: string) => {
  const db = getFirestore(FIREBASE_APP)
  try {
    const friendRequestsCollection = collection(db, 'users')
    const q = query(friendRequestsCollection, where('name', '==', name))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.size > 0) {
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}
const CreateAccount = ({navigation}) => {
  //TEXTFIELD SETTERS

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  //TEXTFIELD SETTERS
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH
  const db = getFirestore(FIREBASE_APP)

  //Link to firebase

  //add user input data to DB for later access
  const addUserData = async (userName: string, userEmail: string) => {
    try {
      console.log('Before Firestore operation')
      const data = {
        name: userName,
        email: userEmail.toLowerCase(),
      }
      //document name will be email input, within the user's collection
      const userDocRef = doc(collection(db, 'users'), userEmail.toLowerCase()) //reference to document in firebase
      await setDoc(userDocRef, data) //adding data to document path
    } catch (error) {
      console.error('Error adding data:', error)
    }
  }

  //Sign up handler
  const signUp = async () => {
    if (
      name === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      Alert.alert('Fill all fields')
      return
    }
    if (await queryName(name)) {
      Alert.alert('Username Already Exists')
      return
    }
    // Checks prior to authentication
    setEmail(email.trim())
    if (!email.includes('@') || email === '') {
      Alert.alert('Invalid Email')
      return
    }
    if (password.length < 6) {
      Alert.alert('Password is too short')
      return
    }
    if (!password.includes('!' || '@' || '$' || '%')) {
      Alert.alert(
        `Password does not include one of the following: '!', '@', '$', or '%'`,
      )
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match')
      return
    }
    //If all cases are confirmed
    setLoading(true)
    try {
      //add user to auth system
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      //send user email verification to confirm account
      await sendEmailVerification(user)
      Alert.alert('Check your email')

      //add user's data to DB
      await addUserData(name, email)
      // navigation.navigate('LoginScreen')
    } catch (error) {
      console.log(email)
      Alert.alert(
        'Something went wrong. Double check that you entered a valid email address.',
      )
      console.log(error)
    } finally {
      setLoading(false)
      return
    }
  }

  return (
    <ScrollView scrollEnabled={false}>
      <View style={styles.TitleView}>
        <View style={{flex: 0.25}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login')
            }}>
            <FastImage
              source={require('../assets/back_arrow.png')}
              style={{width: 40, height: 28}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.Center}>
          <Text style={styles.title}>ATLAS</Text>
        </View>
        <View style={{flex: 0.25}} />
      </View>
      <View style={styles.CreateAccountStyle}>
        <Text style={styles.header}>Create an Account</Text>
      </View>
      <View style={styles.TextFieldViewStyle}>
        <TextInput
          style={styles.input}
          placeholder='Username'
          placeholderTextColor={colorTheme}
          onChangeText={newText => setName(newText)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor={colorTheme}
          keyboardType='email-address'
          onChangeText={newText => setEmail(newText)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          onChangeText={newText => setPassword(newText)}
          textContentType={'oneTimeCode'}
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          placeholderTextColor={colorTheme}
          secureTextEntry
          onChangeText={newText => setConfirmPassword(newText)}
          textContentType={'oneTimeCode'}
        />
      </View>

      <View style={styles.TextFieldViewStyle}>
        {loading ? (
          <ActivityIndicator size={'large'} color='#0000ff' />
        ) : (
          <>
            <TouchableOpacity
              onPress={signUp}
              style={styles.createAccountButton}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const colorTheme = '#4192ab'
//Custom styling option
const styles = StyleSheet.create({
  Center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  CreateAccountStyle: {
    marginTop: screenHeight / 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextFieldViewStyle: {
    marginTop: screenHeight / 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    flexDirection: 'row',
    padding: screenHeight / 18,
  },
  title: {
    fontSize: screenHeight / 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  header: {
    fontSize: screenHeight / 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colorTheme,
  },
  subText: {
    fontSize: screenHeight / 60,
    color: colorTheme,
  },
  input: {
    width: '80%',
    height: screenHeight / 16,
    borderWidth: 1,
    borderColor: colorTheme,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  createAccountButton: {
    width: '80%',
    height: screenHeight / 18,
    backgroundColor: colorTheme,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: screenHeight / 24,
  },
})

export default CreateAccount

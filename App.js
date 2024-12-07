import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';

// What is useState?
// useState is a hook that allows you to add state to your functional components
import { useState, useEffect } from 'react';

// What is database.js?
// database.js is a file that contains the functions to interact with the database
import { loginUser, registerUser } from './utils/database';

// What is AsyncStorage?
// AsyncStorage is a simple, unencrypted, asynchronous, persistent, key-value storage system that is global to the app.
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePassword from './components/ChangePassword';

export default function App() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false);

    // what is useEffect?
    // this is a hook that runs when the component is mounted
    useEffect(() => {
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem('isLoggedIn')
        if (status === 'true') {
            setIsLoggedIn(true)
        }
    }

    const handleSubmit = async () => {
        if (isLogin && (!username || !password)) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        if (!isLogin && (!username || !password || !email)) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        try {
            console.log(username, password);
            if (isLogin) {
                console.log('login');
                const response = await loginUser(username, password)
                console.log(response)
                if (response.success) {
                    await AsyncStorage.setItem('isLoggedIn', 'true')
                    setIsLoggedIn(true)
                    Alert.alert('Success', 'Logged in successfully')
                } else {
                    console.log(response);
                    Alert.alert('Error', response.message || 'Invalid credentials')
                }
            } else {
                console.log('register');
                const response = await registerUser(username, password, email)
                if (response.success) {
                    Alert.alert('Success', 'Registration successful')
                    setIsLogin(true)
                } else {
                    Alert.alert('Error', response.message || 'Registration failed')
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message)
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn')
        setIsLoggedIn(false)
        setUsername('')
        setPassword('')
    }

    // will this run?
    // yes, it will run if isLoggedIn is true
    // this is a conditional rendering
    if (isLoggedIn) {
        if (showChangePassword) {
            return (
                <SafeAreaView style={styles.container}>
                    <ChangePassword
                        username={username}
                        onBack={() => setShowChangePassword(false)}
                    />
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loggedInContainer}>
                    <Image
                        source={require('./assets/avatar.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeTitle}>
                        Welcome, {username}!
                    </Text>

                    <TouchableOpacity
                        style={styles.changePasswordButton}
                        onPress={() => setShowChangePassword(true)}
                    >
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }


    // will this run?
    // yes, it will run if isLoggedIn is false
    // this is a conditional rendering
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    <Image
                        source={require('./assets/icon.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isLogin
                            ? 'Please sign in to continue'
                            : 'Please fill in the form to continue'}
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={isLogin ? 'Email' : 'Username'}
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                        {!isLogin && (
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholderTextColor="#666"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin
                                ? 'New user? Create an account'
                                : 'Already have an account? Sign in'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}


// styles is an object that contains the styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  changePasswordButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

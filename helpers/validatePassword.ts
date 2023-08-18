export const validatePassword = async (password: string) => {
    const SecureStore = require('expo-secure-store');
    const session = await SecureStore.getItemAsync('scanpay_session');

    if(!session) {
        throw new Error('Session not found');
    }

    const data = JSON.parse(session);

    if(data.password !== password) throw new Error('Invalid password');

    return true
}
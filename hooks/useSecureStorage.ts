export const useSecureStorage = () => {
    const SecureStore = require('expo-secure-store');
    async function setItem(key: string, value: string) {
        return SecureStore.setItemAsync(key, value);
    }

    async function getItem(key: string) {
        return SecureStore.getItemAsync(key);
    }

    async function removeItem(key: string) {
        return SecureStore.deleteItemAsync(key);
    }

    async function isSecureStorageEnabled() {
        return SecureStore.isAvailableAsync();
    }

    return {
        setItem,
        getItem,
        removeItem,
        isSecureStorageEnabled,
    }
}
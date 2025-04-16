// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage" // <-- importe o Storage

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Ativar persistência offline (para melhorar a experiência do usuário e reduzir erros de conexão)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Múltiplas abas abertas, persistência só pode ser ativada em uma aba por vez
      console.warn('Persistência do Firestore não pôde ser ativada: múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      // O navegador atual não suporta os recursos necessários
      console.warn('Persistência do Firestore não é suportada neste navegador');
    }
  });

// Aqui instanciamos e exportamos o Storage
export const storage = getStorage(app)

export { db, auth };

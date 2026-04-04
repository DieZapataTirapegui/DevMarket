import { createContext, useContext, useState } from "react";

type Lang = "es" | "en";

interface Translations {
  nav: {
    home: string;
    products: string;
    cart: string;
    orders: string;
    login: string;
    register: string;
    logout: string;
  };
}

const translations: Record<Lang, Translations> = {
  es: {
    nav: {
      home: "Inicio",
      products: "Productos",
      cart: "Carrito",
      orders: "Pedidos",
      login: "Ingresar",
      register: "Registrarse",
      logout: "Salir",
    },
  },
  en: {
    nav: {
      home: "Home",
      products: "Products",
      cart: "Cart",
      orders: "Orders",
      login: "Login",
      register: "Sign up",
      logout: "Logout",
    },
  },
};

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType>({} as LangContextType);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
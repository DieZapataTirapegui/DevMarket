import { createContext, useContext, useState } from "react";

export type Lang = "es" | "en" | "ja";

export interface Translations {
  nav: {
    home: string;
    products: string;
    cart: string;
    orders: string;
    login: string;
    register: string;
    logout: string;
  };
  home: {
    badge: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    subtitle: string;
    cta: string;
    ctaRegister: string;
    statsProducts: string;
    statsCategories: string;
    statsSafe: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    categoriesViewAll: string;
    cat1: string;
    cat2: string;
    cat3: string;
    cat4: string;
    catCount1: string;
    catCount2: string;
    catCount3: string;
    catCount4: string;
    ctaFinalTitle: string;
    ctaFinalDesc: string;
    ctaFinalBtn: string;
  };
  products: {
    title: string;
    loading: string;
    found: string;
    foundPlural: string;
    searchPlaceholder: string;
    allCategories: string;
    sortBy: string;
    sortAsc: string;
    sortDesc: string;
    errorMsg: string;
    emptyMsg: string;
    clearFilters: string;
  };
  productDetail: {
    back: string;
    addToCart: string;
    adding: string;
    added: string;
    loginRequired: string;
    loginLink: string;
    notFound: string;
    backToProducts: string;
  };
  cart: {
    title: string;
    product: string;
    products: string;
    summary: string;
    total: string;
    checkout: string;
    processing: string;
    keepShopping: string;
    remove: string;
    emptyTitle: string;
    emptyDesc: string;
    viewProducts: string;
    loginTitle: string;
    loginDesc: string;
    login: string;
    successTitle: string;
    successDesc: string;
  };
  orders: {
    title: string;
    order: string;
    orders: string;
    orderNum: string;
    item: string;
    items: string;
    total: string;
    emptyTitle: string;
    emptyDesc: string;
    browseProducts: string;
    loginTitle: string;
    loginDesc: string;
    login: string;
    errorMsg: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
    noAccount: string;
    registerLink: string;
    errorDefault: string;
  };
  register: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPlaceholder: string;
    submit: string;
    submitting: string;
    hasAccount: string;
    loginLink: string;
    errorDefault: string;
    errorPasswordMatch: string;
    errorPasswordLength: string;
    strengthLabel: string;
    strengthWeak: string;
    strengthFair: string;
    strengthGood: string;
    strengthStrong: string;
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
    home: {
      badge: "El marketplace para desarrolladores",
      title1: "Todo lo que",
      titleHighlight: "necesitas",
      title2: ", en un solo lugar",
      subtitle: "Explora miles de productos, agrega al carrito y recibe en tu puerta. Simple, rápido y seguro.",
      cta: "Ver productos",
      ctaRegister: "Crear cuenta gratis",
      statsProducts: "Productos",
      statsCategories: "Categorías",
      statsSafe: "Seguro",
      feature1Title: "Rápido y simple",
      feature1Desc: "Compra en segundos, sin complicaciones.",
      feature2Title: "Pagos seguros",
      feature2Desc: "Tu información siempre protegida.",
      feature3Title: "Envío express",
      feature3Desc: "Recibe tu pedido donde estés.",
      categoriesTitle: "Explora por categoría",
      categoriesSubtitle: "Encuentra lo que buscas",
      categoriesViewAll: "Ver todo",
      cat1: "Electrónica",
      cat2: "Ropa hombre",
      cat3: "Joyería",
      cat4: "Ropa mujer",
      catCount1: "5 productos",
      catCount2: "4 productos",
      catCount3: "4 productos",
      catCount4: "6 productos",
      ctaFinalTitle: "¿Listo para empezar?",
      ctaFinalDesc: "Crea tu cuenta gratis y empieza a comprar hoy mismo.",
      ctaFinalBtn: "Comenzar ahora",
    },
    products: {
      title: "Productos",
      loading: "Cargando...",
      found: "producto encontrado",
      foundPlural: "productos encontrados",
      searchPlaceholder: "Buscar productos...",
      allCategories: "Todas las categorías",
      sortBy: "Ordenar por",
      sortAsc: "Precio: menor a mayor",
      sortDesc: "Precio: mayor a menor",
      errorMsg: "No se pudieron cargar los productos. Verifica que el backend esté funcionando.",
      emptyMsg: "No se encontraron productos para tu búsqueda.",
      clearFilters: "Limpiar filtros",
    },
    productDetail: {
      back: "Volver",
      addToCart: "Agregar al carrito",
      adding: "Agregando...",
      added: "¡Agregado al carrito!",
      loginRequired: "Necesitas",
      loginLink: "iniciar sesión",
      notFound: "Producto no encontrado.",
      backToProducts: "Volver a productos",
    },
    cart: {
      title: "Carrito",
      product: "producto",
      products: "productos",
      summary: "Resumen",
      total: "Total",
      checkout: "Finalizar compra",
      processing: "Procesando...",
      keepShopping: "Seguir comprando",
      remove: "Eliminar",
      emptyTitle: "Tu carrito está vacío",
      emptyDesc: "Agrega productos para empezar",
      viewProducts: "Ver productos",
      loginTitle: "Tu carrito te espera",
      loginDesc: "Inicia sesión para ver tus productos",
      login: "Ingresar",
      successTitle: "¡Pedido realizado!",
      successDesc: "Redirigiendo a tus pedidos...",
    },
    orders: {
      title: "Mis pedidos",
      order: "pedido",
      orders: "pedidos",
      orderNum: "Pedido",
      item: "producto",
      items: "productos",
      total: "Total",
      emptyTitle: "No tienes pedidos aún",
      emptyDesc: "Cuando realices una compra, aparecerá aquí.",
      browseProducts: "Ver productos",
      loginTitle: "Inicia sesión para ver tus pedidos",
      loginDesc: "Aquí encontrarás el historial de tus compras.",
      login: "Ingresar",
      errorMsg: "No se pudieron cargar los pedidos.",
    },
    login: {
      title: "Bienvenido de vuelta",
      subtitle: "Inicia sesión en tu cuenta de",
      email: "Email",
      password: "Contraseña",
      emailPlaceholder: "tu@email.com",
      passwordPlaceholder: "••••••••",
      submit: "Ingresar",
      submitting: "Ingresando...",
      noAccount: "¿No tienes cuenta?",
      registerLink: "Regístrate",
      errorDefault: "Credenciales incorrectas. Intenta de nuevo.",
    },
    register: {
      title: "Crear cuenta",
      subtitle: "Empieza a comprar en",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      emailPlaceholder: "tu@email.com",
      passwordPlaceholder: "••••••••",
      confirmPlaceholder: "••••••••",
      submit: "Crear cuenta",
      submitting: "Creando cuenta...",
      hasAccount: "¿Ya tienes cuenta?",
      loginLink: "Inicia sesión",
      errorDefault: "Error al registrarse. Intenta de nuevo.",
      errorPasswordMatch: "Las contraseñas no coinciden.",
      errorPasswordLength: "La contraseña debe tener al menos 6 caracteres.",
      strengthLabel: "Fuerza:",
      strengthWeak: "Débil",
      strengthFair: "Regular",
      strengthGood: "Buena",
      strengthStrong: "Fuerte",
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
    home: {
      badge: "The marketplace for developers",
      title1: "Everything you",
      titleHighlight: "need",
      title2: ", in one place",
      subtitle: "Explore thousands of products, add to cart and receive at your door. Simple, fast and secure.",
      cta: "Browse products",
      ctaRegister: "Create free account",
      statsProducts: "Products",
      statsCategories: "Categories",
      statsSafe: "Secure",
      feature1Title: "Fast & simple",
      feature1Desc: "Buy in seconds, no hassle.",
      feature2Title: "Secure payments",
      feature2Desc: "Your info always protected.",
      feature3Title: "Express shipping",
      feature3Desc: "Get your order wherever you are.",
      categoriesTitle: "Browse by category",
      categoriesSubtitle: "Find what you're looking for",
      categoriesViewAll: "View all",
      cat1: "Electronics",
      cat2: "Men's clothing",
      cat3: "Jewelry",
      cat4: "Women's clothing",
      catCount1: "5 products",
      catCount2: "4 products",
      catCount3: "4 products",
      catCount4: "6 products",
      ctaFinalTitle: "Ready to start?",
      ctaFinalDesc: "Create your free account and start shopping today.",
      ctaFinalBtn: "Get started",
    },
    products: {
      title: "Products",
      loading: "Loading...",
      found: "product found",
      foundPlural: "products found",
      searchPlaceholder: "Search products...",
      allCategories: "All categories",
      sortBy: "Sort by",
      sortAsc: "Price: low to high",
      sortDesc: "Price: high to low",
      errorMsg: "Couldn't load products. Make sure the backend is running.",
      emptyMsg: "No products found for your search.",
      clearFilters: "Clear filters",
    },
    productDetail: {
      back: "Back",
      addToCart: "Add to cart",
      adding: "Adding...",
      added: "Added to cart!",
      loginRequired: "You need to",
      loginLink: "log in",
      notFound: "Product not found.",
      backToProducts: "Back to products",
    },
    cart: {
      title: "Cart",
      product: "product",
      products: "products",
      summary: "Summary",
      total: "Total",
      checkout: "Checkout",
      processing: "Processing...",
      keepShopping: "Keep shopping",
      remove: "Remove",
      emptyTitle: "Your cart is empty",
      emptyDesc: "Add products to get started",
      viewProducts: "Browse products",
      loginTitle: "Your cart is waiting",
      loginDesc: "Log in to see your products",
      login: "Log in",
      successTitle: "Order placed!",
      successDesc: "Redirecting to your orders...",
    },
    orders: {
      title: "My orders",
      order: "order",
      orders: "orders",
      orderNum: "Order",
      item: "item",
      items: "items",
      total: "Total",
      emptyTitle: "No orders yet",
      emptyDesc: "When you make a purchase, it will appear here.",
      browseProducts: "Browse products",
      loginTitle: "Log in to see your orders",
      loginDesc: "Your purchase history will appear here.",
      login: "Log in",
      errorMsg: "Could not load orders.",
    },
    login: {
      title: "Welcome back",
      subtitle: "Log in to your account at",
      email: "Email",
      password: "Password",
      emailPlaceholder: "you@email.com",
      passwordPlaceholder: "••••••••",
      submit: "Log in",
      submitting: "Logging in...",
      noAccount: "Don't have an account?",
      registerLink: "Sign up",
      errorDefault: "Wrong credentials. Please try again.",
    },
    register: {
      title: "Create account",
      subtitle: "Start shopping at",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      emailPlaceholder: "you@email.com",
      passwordPlaceholder: "••••••••",
      confirmPlaceholder: "••••••••",
      submit: "Create account",
      submitting: "Creating account...",
      hasAccount: "Already have an account?",
      loginLink: "Log in",
      errorDefault: "Error signing up. Please try again.",
      errorPasswordMatch: "Passwords don't match.",
      errorPasswordLength: "Password must be at least 6 characters.",
      strengthLabel: "Strength:",
      strengthWeak: "Weak",
      strengthFair: "Fair",
      strengthGood: "Good",
      strengthStrong: "Strong",
    },
  },

  ja: {
    nav: {
      home: "ホーム",
      products: "商品",
      cart: "カート",
      orders: "注文",
      login: "ログイン",
      register: "登録",
      logout: "ログアウト",
    },
    home: {
      badge: "開発者のためのマーケット",
      title1: "必要なものが",
      titleHighlight: "すべて",
      title2: "、一か所に",
      subtitle: "何千もの商品を探して、カートに追加して、ドアまで届けてもらいましょう。シンプル、迅速、安全。",
      cta: "商品を見る",
      ctaRegister: "無料アカウント作成",
      statsProducts: "商品",
      statsCategories: "カテゴリー",
      statsSafe: "安全",
      feature1Title: "速くてシンプル",
      feature1Desc: "数秒で購入、手間なし。",
      feature2Title: "安全な支払い",
      feature2Desc: "情報は常に保護されています。",
      feature3Title: "速達配送",
      feature3Desc: "どこでも注文を受け取れます。",
      categoriesTitle: "カテゴリーで探す",
      categoriesSubtitle: "お探しのものを見つけましょう",
      categoriesViewAll: "すべて見る",
      cat1: "電子機器",
      cat2: "メンズ服",
      cat3: "ジュエリー",
      cat4: "レディース服",
      catCount1: "5商品",
      catCount2: "4商品",
      catCount3: "4商品",
      catCount4: "6商品",
      ctaFinalTitle: "始める準備はできましたか？",
      ctaFinalDesc: "無料アカウントを作成して今日から購入を始めましょう。",
      ctaFinalBtn: "今すぐ始める",
    },
    products: {
      title: "商品",
      loading: "読み込み中...",
      found: "件の商品が見つかりました",
      foundPlural: "件の商品が見つかりました",
      searchPlaceholder: "商品を検索...",
      allCategories: "すべてのカテゴリー",
      sortBy: "並び替え",
      sortAsc: "価格：安い順",
      sortDesc: "価格：高い順",
      errorMsg: "商品を読み込めませんでした。バックエンドが起動しているか確認してください。",
      emptyMsg: "検索結果が見つかりませんでした。",
      clearFilters: "フィルターをクリア",
    },
    productDetail: {
      back: "戻る",
      addToCart: "カートに追加",
      adding: "追加中...",
      added: "カートに追加しました！",
      loginRequired: "カートに追加するには",
      loginLink: "ログインが必要です",
      notFound: "商品が見つかりません。",
      backToProducts: "商品一覧に戻る",
    },
    cart: {
      title: "カート",
      product: "商品",
      products: "商品",
      summary: "注文概要",
      total: "合計",
      checkout: "購入手続きへ",
      processing: "処理中...",
      keepShopping: "買い物を続ける",
      remove: "削除",
      emptyTitle: "カートは空です",
      emptyDesc: "商品を追加してください",
      viewProducts: "商品を見る",
      loginTitle: "カートが待っています",
      loginDesc: "ログインして商品を確認してください",
      login: "ログイン",
      successTitle: "注文完了！",
      successDesc: "注文ページに移動します...",
    },
    orders: {
      title: "注文履歴",
      order: "件の注文",
      orders: "件の注文",
      orderNum: "注文",
      item: "商品",
      items: "商品",
      total: "合計",
      emptyTitle: "注文がまだありません",
      emptyDesc: "購入すると、ここに表示されます。",
      browseProducts: "商品を見る",
      loginTitle: "ログインして注文を確認",
      loginDesc: "購入履歴がここに表示されます。",
      login: "ログイン",
      errorMsg: "注文を読み込めませんでした。",
    },
    login: {
      title: "おかえりなさい",
      subtitle: "アカウントにログイン",
      email: "メールアドレス",
      password: "パスワード",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "••••••••",
      submit: "ログイン",
      submitting: "ログイン中...",
      noAccount: "アカウントをお持ちでないですか？",
      registerLink: "登録する",
      errorDefault: "認証情報が正しくありません。もう一度お試しください。",
    },
    register: {
      title: "アカウント作成",
      subtitle: "ショッピングを始めましょう",
      email: "メールアドレス",
      password: "パスワード",
      confirmPassword: "パスワードの確認",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "••••••••",
      confirmPlaceholder: "••••••••",
      submit: "アカウント作成",
      submitting: "作成中...",
      hasAccount: "すでにアカウントをお持ちですか？",
      loginLink: "ログイン",
      errorDefault: "登録エラー。もう一度お試しください。",
      errorPasswordMatch: "パスワードが一致しません。",
      errorPasswordLength: "パスワードは6文字以上必要です。",
      strengthLabel: "強度：",
      strengthWeak: "弱い",
      strengthFair: "普通",
      strengthGood: "良い",
      strengthStrong: "強い",
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
  const toggleLang = () =>
    setLang((l) => (l === "es" ? "en" : l === "en" ? "ja" : "es"));

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
/**
 * MysticFate - 订阅+内购支付集成模块
 * Subscription & In-App Purchase Module
 * 
 * 功能：
 * 1. Credit购买流程
 * 2. 订阅方案管理
 * 3. 支付状态跟踪
 * 4. React Native IAP预留接口
 */

// ==================== 配置 ====================

const PAYMENT_CONFIG = {
  // 支付配置
  payments: {
    enabled: true,
    currency: 'USD',
    locale: 'en_US'
  },
  
  // Credit套餐
  creditPackages: [
    {
      id: 'credits_starter',
      name: 'Starter',
      credits: 30,
      price: 1.99,
      priceDisplay: '$1.99',
      perCredit: '$0.066',
      features: ['30 Credits', 'Basic Readings', 'Standard Support']
    },
    {
      id: 'credits_popular',
      name: 'Popular',
      credits: 100,
      price: 4.99,
      priceDisplay: '$4.99',
      perCredit: '$0.050',
      popular: true,
      badge: 'Best Value',
      features: ['100 Credits', 'Priority Support', 'Exclusive Content']
    },
    {
      id: 'credits_premium',
      name: 'Premium',
      credits: 250,
      price: 9.99,
      priceDisplay: '$9.99',
      perCredit: '$0.040',
      features: ['250 Credits', 'Priority Support', 'Exclusive Features', 'Early Access']
    }
  ],
  
  // 订阅方案
  subscriptions: [
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      price: 14.99,
      priceDisplay: '$14.99/month',
      interval: 'month',
      features: [
        'Unlimited AI Readings',
        'Daily Personalized Whispers',
        'Exclusive Pro Features',
        'Priority Support',
        'No Ads'
      ]
    },
    {
      id: 'pro_yearly',
      name: 'Pro Yearly',
      price: 99.99,
      priceDisplay: '$99.99/year',
      interval: 'year',
      savings: '40%',
      badge: 'Save 40%',
      features: [
        'Everything in Pro Monthly',
        '2 Months Free',
        'Lifetime Pro Badge',
        'VIP Support'
      ]
    }
  ],
  
  // 商品价格映射（用于React Native IAP）
  products: {
    // Credit packages
    'credits_starter': { type: 'inapp', price: 1.99, credits: 30 },
    'credits_popular': { type: 'inapp', price: 4.99, credits: 100 },
    'credits_premium': { type: 'inapp', price: 9.99, credits: 250 },
    // Subscriptions
    'pro_monthly': { type: 'subs', price: 14.99, interval: 'month' },
    'pro_yearly': { type: 'subs', price: 99.99, interval: 'year' }
  }
};

// ==================== 支付管理器 ====================

class PaymentManager {
  constructor() {
    this.credits = 30; // 默认30积分
    this.subscription = null;
    this.listeners = [];
    
    // 加载保存的状态
    this.loadState();
  }
  
  /**
   * 加载保存的支付状态
   */
  loadState() {
    try {
      const savedCredits = localStorage.getItem('mystic_credits');
      const savedSub = localStorage.getItem('mystic_subscription');
      
      if (savedCredits) {
        this.credits = parseInt(savedCredits, 10);
      }
      
      if (savedSub) {
        this.subscription = JSON.parse(savedSub);
      }
    } catch (e) {
      console.error('Error loading payment state:', e);
    }
  }
  
  /**
   * 保存支付状态
   */
  saveState() {
    try {
      localStorage.setItem('mystic_credits', this.credits.toString());
      if (this.subscription) {
        localStorage.setItem('mystic_subscription', JSON.stringify(this.subscription));
      }
    } catch (e) {
      console.error('Error saving payment state:', e);
    }
  }
  
  /**
   * 获取当前积分
   */
  getCredits() {
    return this.credits;
  }
  
  /**
   * 消耗积分
   */
  spendCredits(amount) {
    if (this.credits >= amount) {
      this.credits -= amount;
      this.saveState();
      this.notifyListeners('creditChange', { credits: this.credits });
      return true;
    }
    return false;
  }
  
  /**
   * 添加积分
   */
  addCredits(amount) {
    this.credits += amount;
    this.saveState();
    this.notifyListeners('creditChange', { credits: this.credits });
  }
  
  /**
   * 获取订阅状态
   */
  getSubscription() {
    return this.subscription;
  }
  
  /**
   * 是否为Pro用户
   */
  isPro() {
    if (!this.subscription) return false;
    return this.subscription.active && new Date() < new Date(this.subscription.expiry);
  }
  
  /**
   * 购买Credits
   */
  async purchaseCredits(packageId) {
    const pkg = PAYMENT_CONFIG.creditPackages.find(p => p.id === packageId);
    if (!pkg) {
      throw new Error('Invalid package');
    }
    
    // 检测平台
    if (this.isReactNative()) {
      return this.purchaseCreditsReactNative(packageId, pkg);
    } else if (this.isWebPlatform()) {
      return this.purchaseCreditsWeb(packageId, pkg);
    } else {
      // 模拟购买（Demo模式）
      return this.simulatePurchase(pkg);
    }
  }
  
  /**
   * 订阅Pro
   */
  async subscribe(subId) {
    const sub = PAYMENT_CONFIG.subscriptions.find(s => s.id === subId);
    if (!sub) {
      throw new Error('Invalid subscription');
    }
    
    if (this.isReactNative()) {
      return this.subscribeReactNative(subId, sub);
    } else if (this.isWebPlatform()) {
      return this.subscribeWeb(subId, sub);
    } else {
      // 模拟订阅（Demo模式）
      return this.simulateSubscription(sub);
    }
  }
  
  /**
   * 取消订阅
   */
  async cancelSubscription() {
    if (!this.subscription) return;
    
    if (this.isReactNative()) {
      // 调用React Native取消订阅
      // await reactNativeModule.cancelSubscription();
    }
    
    // 记录取消
    this.subscription.cancelled = true;
    this.saveState();
    this.notifyListeners('subscriptionChange', { subscription: this.subscription });
  }
  
  /**
   * 检测React Native环境
   */
  isReactNative() {
    return typeof window.ReactNativeWebView !== 'undefined' ||
           typeof window.nativeBridge !== 'undefined' ||
           navigator.userAgent.includes('ReactNative');
  }
  
  /**
   * 检测Web平台
   */
  isWebPlatform() {
    return typeof window !== 'undefined' && !this.isReactNative();
  }
  
  // ============ React Native IAP ============
  
  async purchaseCreditsReactNative(packageId, pkg) {
    // React Native IAP预留接口
    return new Promise((resolve, reject) => {
      // 示例：调用React Native原生模块
      // window.Purchases.purchasePackage(packageId, (result) => {
      //   if (result.success) {
      //     this.addCredits(pkg.credits);
      //     resolve(result);
      //   } else {
      //     reject(new Error(result.error));
      //   }
      // });
      
      // Demo模式
      console.log('React Native IAP: Purchasing', packageId);
      setTimeout(() => {
        this.addCredits(pkg.credits);
        resolve({ success: true, credits: pkg.credits });
      }, 1000);
    });
  }
  
  async subscribeReactNative(subId, sub) {
    return new Promise((resolve, reject) => {
      // window.Purchases.subscribe(subId, (result) => {
      //   if (result.success) {
      //     this.activateSubscription(sub);
      //     resolve(result);
      //   } else {
      //     reject(new Error(result.error));
      //   }
      // });
      
      console.log('React Native IAP: Subscribing to', subId);
      setTimeout(() => {
        this.activateSubscription(sub);
        resolve({ success: true, subscription: sub });
      }, 1000);
    });
  }
  
  // ============ Web平台支付 ============
  
  async purchaseCreditsWeb(packageId, pkg) {
    // Web平台预留支付接口
    // 实际实现需要接入Stripe/PayPal等
    
    console.log('Web Payment: Purchasing', packageId);
    
    // Demo模式 - 模拟支付
    return this.simulatePurchase(pkg);
  }
  
  async subscribeWeb(subId, sub) {
    console.log('Web Payment: Subscribing to', subId);
    return this.simulateSubscription(sub);
  }
  
  // ============ 模拟购买（Demo模式） ============
  
  simulatePurchase(pkg) {
    return new Promise((resolve) => {
      console.log(`[Demo] Simulating purchase: ${pkg.name} for ${pkg.priceDisplay}`);
      
      // 模拟支付延迟
      setTimeout(() => {
        this.addCredits(pkg.credits);
        this.notifyListeners('purchaseSuccess', { package: pkg, credits: pkg.credits });
        resolve({
          success: true,
          credits: pkg.credits,
          totalCredits: this.credits,
          message: `Successfully purchased ${pkg.credits} credits!`
        });
      }, 1500);
    });
  }
  
  simulateSubscription(sub) {
    return new Promise((resolve) => {
      console.log(`[Demo] Simulating subscription: ${sub.name} for ${sub.priceDisplay}`);
      
      setTimeout(() => {
        this.activateSubscription(sub);
        this.notifyListeners('subscribeSuccess', { subscription: sub });
        resolve({
          success: true,
          subscription: sub,
          message: `Successfully subscribed to ${sub.name}!`
        });
      }, 1500);
    });
  }
  
  activateSubscription(sub) {
    const now = new Date();
    const expiry = new Date(now);
    
    if (sub.interval === 'month') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else if (sub.interval === 'year') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }
    
    this.subscription = {
      id: sub.id,
      name: sub.name,
      active: true,
      startDate: now.toISOString(),
      expiry: expiry.toISOString(),
      cancelled: false
    };
    
    this.saveState();
    this.notifyListeners('subscriptionChange', { subscription: this.subscription });
  }
  
  // ============ 事件监听 ============
  
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }
  
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error('Error in payment listener:', e);
      }
    });
  }
}

// ==================== UI组件 ====================

/**
 * 显示Credit购买弹窗
 */
function showCreditPurchaseModal() {
  // 如果已有modal，先移除
  const existing = document.getElementById('credit-purchase-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'credit-purchase-modal';
  modal.className = 'payment-modal';
  
  const packagesHTML = PAYMENT_CONFIG.creditPackages.map(pkg => `
    <div class="credit-package ${pkg.popular ? 'popular' : ''}" 
         data-id="${pkg.id}"
         onclick="handleCreditPurchase('${pkg.id}')">
      ${pkg.badge ? `<div class="package-badge">${pkg.badge}</div>` : ''}
      <div class="package-header">
        <div class="package-name">${pkg.name}</div>
        <div class="package-credits">${pkg.credits} Credits</div>
      </div>
      <div class="package-price">${pkg.priceDisplay}</div>
      <div class="package-per">${pkg.perCredit}/credit</div>
    </div>
  `).join('');
  
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeCreditPurchaseModal()"></div>
    <div class="modal-container">
      <div class="modal-header">
        <h2>Get More Credits</h2>
        <button class="close-btn" onclick="closeCreditPurchaseModal()">×</button>
      </div>
      
      <div class="modal-body">
        <div class="credits-info">
          <span class="current-credits">Current: <strong id="modal-credits-display">${paymentManager.getCredits()}</strong> Credits</span>
        </div>
        
        <div class="packages-grid">
          ${packagesHTML}
        </div>
      </div>
      
      <div class="modal-footer">
        <p class="payment-note">Secure payment powered by Google Play</p>
        <button class="link-btn" onclick="Compliance.showPaymentInfo()">View pricing details</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 监听积分变化
  paymentManager.addListener((event, data) => {
    if (event === 'creditChange') {
      const display = document.getElementById('modal-credits-display');
      if (display) {
        display.textContent = data.credits;
      }
    }
  });
  
  // 添加样式
  addPaymentStyles();
}

/**
 * 显示订阅弹窗
 */
function showSubscriptionModal() {
  const existing = document.getElementById('subscription-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'subscription-modal';
  modal.className = 'payment-modal';
  
  const subsHTML = PAYMENT_CONFIG.subscriptions.map(sub => `
    <div class="subscription-option ${sub.savings ? 'highlight' : ''}"
         data-id="${sub.id}"
         onclick="handleSubscription('${sub.id}')">
      ${sub.badge ? `<div class="sub-badge">${sub.badge}</div>` : ''}
      <div class="sub-name">${sub.name}</div>
      <div class="sub-price">${sub.priceDisplay}</div>
      <ul class="sub-features">
        ${sub.features.map(f => `<li>✓ ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeSubscriptionModal()"></div>
    <div class="modal-container">
      <div class="modal-header">
        <h2>Upgrade to Pro</h2>
        <button class="close-btn" onclick="closeSubscriptionModal()">×</button>
      </div>
      
      <div class="modal-body">
        <div class="pro-banner">
          <span class="pro-icon">◇</span>
          <div class="pro-text">
            <strong>Pro Membership</strong>
            <span>Unlimited readings & exclusive features</span>
          </div>
        </div>
        
        <div class="subscriptions-list">
          ${subsHTML}
        </div>
      </div>
      
      <div class="modal-footer">
        <p class="payment-note">Cancel anytime. Auto-renews until cancelled.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  addPaymentStyles();
}

/**
 * 处理Credit购买
 */
async function handleCreditPurchase(packageId) {
  const pkg = PAYMENT_CONFIG.creditPackages.find(p => p.id === packageId);
  if (!pkg) return;
  
  // 显示加载状态
  const pkgEl = document.querySelector(`.credit-package[data-id="${packageId}"]`);
  if (pkgEl) {
    pkgEl.classList.add('loading');
  }
  
  try {
    const result = await paymentManager.purchaseCredits(packageId);
    
    if (result.success) {
      showToast(`✨ ${pkg.credits} Credits added! Total: ${result.totalCredits}`);
      
      // 更新显示
      updateCreditsDisplay();
      
      // 2秒后关闭modal
      setTimeout(() => {
        closeCreditPurchaseModal();
      }, 2000);
    }
  } catch (error) {
    showToast('❌ Purchase failed. Please try again.');
    console.error('Purchase error:', error);
  } finally {
    if (pkgEl) {
      pkgEl.classList.remove('loading');
    }
  }
}

/**
 * 处理订阅
 */
async function handleSubscription(subId) {
  const sub = PAYMENT_CONFIG.subscriptions.find(s => s.id === subId);
  if (!sub) return;
  
  const subEl = document.querySelector(`.subscription-option[data-id="${subId}"]`);
  if (subEl) {
    subEl.classList.add('loading');
  }
  
  try {
    const result = await paymentManager.subscribe(subId);
    
    if (result.success) {
      showToast(`✨ Welcome to Pro! Enjoy unlimited access.`);
      
      setTimeout(() => {
        closeSubscriptionModal();
        // 更新UI显示Pro状态
        updateProStatus();
      }, 2000);
    }
  } catch (error) {
    showToast('❌ Subscription failed. Please try again.');
    console.error('Subscription error:', error);
  } finally {
    if (subEl) {
      subEl.classList.remove('loading');
    }
  }
}

/**
 * 关闭Credit购买弹窗
 */
function closeCreditPurchaseModal() {
  const modal = document.getElementById('credit-purchase-modal');
  if (modal) modal.remove();
}

/**
 * 关闭订阅弹窗
 */
function closeSubscriptionModal() {
  const modal = document.getElementById('subscription-modal');
  if (modal) modal.remove();
}

/**
 * 更新积分显示
 */
function updateCreditsDisplay() {
  const creditBadge = document.getElementById('credit-count');
  if (creditBadge) {
    creditBadge.textContent = paymentManager.getCredits();
  }
}

/**
 * 更新Pro状态显示
 */
function updateProStatus() {
  const isPro = paymentManager.isPro();
  const proBadge = document.getElementById('pro-badge');
  
  if (isPro && proBadge) {
    proBadge.style.display = 'inline-flex';
  }
}

/**
 * 购买Credits（快捷函数）
 */
async function purchaseCredits(amount, price) {
  const pkg = PAYMENT_CONFIG.creditPackages.find(p => p.credits === amount);
  if (pkg) {
    return handleCreditPurchase(pkg.id);
  }
  showToast('Package not found');
}

/**
 * 显示Toast提示
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'payment-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== 样式 ====================

function addPaymentStyles() {
  if (document.getElementById('payment-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'payment-styles';
  styles.textContent = `
    .payment-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .payment-modal .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
    }
    
    .payment-modal .modal-container {
      position: relative;
      width: 90%;
      max-width: 400px;
      max-height: 90vh;
      background: #14141F;
      border: 1px solid #C9A96E;
      border-radius: 20px;
      overflow: hidden;
    }
    
    .payment-modal .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(201, 169, 110, 0.2);
    }
    
    .payment-modal .modal-header h2 {
      font-family: 'Cinzel', serif;
      font-size: 1.3rem;
      color: #C9A96E;
      margin: 0;
    }
    
    .payment-modal .close-btn {
      background: none;
      border: none;
      color: #7A7572;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    
    .payment-modal .close-btn:hover {
      color: #E8E4DF;
    }
    
    .payment-modal .modal-body {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .payment-modal .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(201, 169, 110, 0.2);
      text-align: center;
    }
    
    .credits-info {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .current-credits {
      color: #7A7572;
      font-size: 0.9rem;
    }
    
    .current-credits strong {
      color: #8B5CF6;
    }
    
    .packages-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .credit-package {
      background: #0A0A0F;
      border: 1px solid #7A7572;
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }
    
    .credit-package:hover {
      border-color: #C9A96E;
      transform: translateY(-2px);
    }
    
    .credit-package.popular {
      border-color: #C9A96E;
      background: linear-gradient(135deg, rgba(201, 169, 110, 0.1), transparent);
    }
    
    .credit-package.loading {
      opacity: 0.7;
      pointer-events: none;
    }
    
    .credit-package.loading::after {
      content: 'Processing...';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #C9A96E;
    }
    
    .package-badge {
      position: absolute;
      top: -8px;
      right: 12px;
      background: #C9A96E;
      color: #0A0A0F;
      font-size: 0.65rem;
      padding: 4px 8px;
      border-radius: 8px;
      font-weight: bold;
    }
    
    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .package-name {
      font-family: 'Cinzel', serif;
      color: #E8E4DF;
    }
    
    .package-credits {
      color: #8B5CF6;
      font-weight: bold;
    }
    
    .package-price {
      color: #C9A96E;
      font-size: 1.3rem;
      font-weight: bold;
    }
    
    .package-per {
      color: #7A7572;
      font-size: 0.8rem;
    }
    
    .pro-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
      border: 1px solid #8B5CF6;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }
    
    .pro-icon {
      font-size: 2rem;
      color: #8B5CF6;
    }
    
    .pro-text {
      display: flex;
      flex-direction: column;
    }
    
    .pro-text strong {
      color: #E8E4DF;
    }
    
    .pro-text span {
      color: #7A7572;
      font-size: 0.85rem;
    }
    
    .subscriptions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .subscription-option {
      background: #0A0A0F;
      border: 1px solid #7A7572;
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
    }
    
    .subscription-option:hover {
      border-color: #8B5CF6;
    }
    
    .subscription-option.highlight {
      border-color: #8B5CF6;
    }
    
    .subscription-option.loading {
      opacity: 0.7;
    }
    
    .sub-badge {
      position: absolute;
      top: -8px;
      right: 12px;
      background: #8B5CF6;
      color: white;
      font-size: 0.65rem;
      padding: 4px 8px;
      border-radius: 8px;
      font-weight: bold;
    }
    
    .sub-name {
      font-family: 'Cinzel', serif;
      color: #E8E4DF;
      margin-bottom: 4px;
    }
    
    .sub-price {
      color: #8B5CF6;
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 12px;
    }
    
    .sub-features {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sub-features li {
      color: #7A7572;
      font-size: 0.85rem;
      padding: 4px 0;
    }
    
    .payment-note {
      color: #7A7572;
      font-size: 0.8rem;
      margin: 0;
    }
    
    .link-btn {
      background: none;
      border: none;
      color: #C9A96E;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: underline;
      margin-top: 8px;
    }
    
    .link-btn:hover {
      color: #E8E4DF;
    }
    
    .payment-toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #14141F;
      border: 1px solid #C9A96E;
      border-radius: 12px;
      padding: 14px 28px;
      color: #E8E4DF;
      font-size: 0.95rem;
      opacity: 0;
      transition: all 0.3s;
      z-index: 10000;
      white-space: nowrap;
    }
    
    .payment-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  
  document.head.appendChild(styles);
}

// ==================== 初始化 ====================

let paymentManager;

if (typeof window !== 'undefined') {
  // 初始化支付管理器
  paymentManager = new PaymentManager();
  
  // 导出
  window.PaymentManager = PaymentManager;
  window.paymentManager = paymentManager;
  window.showCreditPurchaseModal = showCreditPurchaseModal;
  window.showSubscriptionModal = showSubscriptionModal;
  window.purchaseCredits = purchaseCredits;
  window.PAYMENT_CONFIG = PAYMENT_CONFIG;
}

console.log('✅ Payment Module loaded - 订阅+内购支付集成模块已加载');

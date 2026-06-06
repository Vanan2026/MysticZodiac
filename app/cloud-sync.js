/**
 * Mystic Fate - Cloud Sync Module
 * Direct Supabase REST API sync for credits & user data
 * 
 * Device identified by UUID (crypto.randomUUID)
 * Uses Supabase anon key for API access (RLS disabled tables)
 * 
 * Tables: user_profiles (credits, name, birth info)
 */

const CloudSync = {
  initialized: false,
  deviceId: null,
  SUPABASE_URL: 'https://tgggebljhvpxgaehsnvq.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ2dlYmxqaHZweGdhZWhzbnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk1ODIsImV4cCI6MjA5NjIzNTU4Mn0.PgAh22rq8olZXSdMWxTzsFhKj5x1dJc-PlL9HSNMZ5U',

  init() {
    if (this.initialized) return;
    this.deviceId = localStorage.getItem('mystic_device_id');
    if (!this.deviceId) {
      this.deviceId = crypto.randomUUID();
      localStorage.setItem('mystic_device_id', this.deviceId);
    }
    this.initialized = true;
  },

  /** Sync pull: cloud → localStorage */
  async pullCredits() {
    this.init();
    try {
      const res = await fetch(
        `${this.SUPABASE_URL}/rest/v1/user_profiles?device_id=eq.${this.deviceId}&select=credits,name`,
        {
          headers: {
            'apikey': this.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
            'Accept': 'application/json',
          },
        }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      if (rows && rows.length > 0) {
        const cloudCredits = parseInt(rows[0].credits, 10);
        const localCredits = parseInt(localStorage.getItem('mystic_credits') || '8', 10);
        // 取 cloud 值，避免本地离线消费后因 max 导致积分膨胀
        localStorage.setItem('mystic_credits', cloudCredits.toString());
        // Notify payment module if loaded
        if (window.paymentManager && typeof window.paymentManager.notifyCreditsUpdate === 'function') {
          window.paymentManager.notifyCreditsUpdate(maxCredits);
        }
        return maxCredits;
      }
    } catch (e) {
      console.warn('[CloudSync] pull failed:', e);
    }
    return null;
  },

  /** Sync push: localStorage → cloud (upsert) */
  async pushCredits(credits) {
    this.init();
    try {
      // Upsert via POST
      const body = {
        device_id: this.deviceId,
        credits: parseInt(credits, 10) || 0,
        updated_at: new Date().toISOString(),
      };
      await fetch(`${this.SUPABASE_URL}/rest/v1/user_profiles`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.warn('[CloudSync] push failed:', e);
    }
  },

  /** Full sync: pull then reconcile */
  async syncAll() {
    await this.pullCredits();
  },
};

// Auto-init on load
CloudSync.init();
/**
 * MysticFate - 社交分享卡片生成器
 * Social Share Card Generator
 * 
 * 生成3种分享卡片：
 * 1. Destiny Card（命盘身份卡）
 * 2. Daily Whisper Card（每日天机卡）
 * 3. Soulmate Card（命定之缘卡）
 */

// ==================== 配置 ====================

const SHARE_CARD_CONFIG = {
  width: 540,
  height: 960,
  padding: 24,
  
  colors: {
    voidBlack: '#0A0A0F',
    nightVeil: '#14141F',
    parchment: '#E8E4DF',
    ash: '#7A7572',
    imperialGold: '#C9A96E',
    agedGold: '#8B7355',
    purpleStar: '#8B5CF6',
    huaLu: '#5B8C5A',
    huaQuan: '#C45B3E',
    huaKe: '#4A7B9D',
    huaJi: '#8B2252'
  },
  
  // 五行主题色
  elementColors: {
    wood: { primary: '#5B8C5A', secondary: '#3D5C3D', gradient: 'linear-gradient(135deg, #5B8C5A 0%, #3D5C3D 100%)' },
    fire: { primary: '#C45B3E', secondary: '#8B3A2B', gradient: 'linear-gradient(135deg, #C45B3E 0%, #8B3A2B 100%)' },
    earth: { primary: '#B8860B', secondary: '#8B6914', gradient: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)' },
    metal: { primary: '#C0C0C0', secondary: '#8B8B8B', gradient: 'linear-gradient(135deg, #C0C0C0 0%, #8B8B8B 100%)' },
    water: { primary: '#4A7B9D', secondary: '#2A4A5D', gradient: 'linear-gradient(135deg, #4A7B9D 0%, #2A4A5D 100%)' }
  }
};

// ==================== 分享卡片类 ====================

class ShareCardGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.config = SHARE_CARD_CONFIG;
  }
  
  /**
   * 初始化Canvas
   */
  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.ctx = this.canvas.getContext('2d');
  }
  
  /**
   * 绘制背景
   */
  drawBackground(gradient = null) {
    const ctx = this.ctx;
    
    if (gradient) {
      const bgGradient = ctx.createLinearGradient(0, 0, 0, this.config.height);
      bgGradient.addColorStop(0, gradient.start);
      bgGradient.addColorStop(1, gradient.end);
      ctx.fillStyle = bgGradient;
    } else {
      ctx.fillStyle = this.config.colors.voidBlack;
    }
    
    ctx.fillRect(0, 0, this.config.width, this.config.height);
  }
  
  /**
   * 绘制星尘背景
   */
  drawStarfield() {
    const ctx = this.ctx;
    const starCount = 80;
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * this.config.width;
      const y = Math.random() * this.config.height;
      const radius = Math.random() * 1.5;
      const opacity = Math.random() * 0.5 + 0.2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${opacity})`;
      ctx.fill();
    }
  }
  
  /**
   * 绘制阴阳图
   */
  drawYinYang(x, y, size) {
    const ctx = this.ctx;
    const centerX = x;
    const centerY = y;
    const radius = size / 2;
    
    // 外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.config.colors.imperialGold;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 半圆 - 阳（白）
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius/2, radius/2, 0, Math.PI, false);
    ctx.fillStyle = this.config.colors.imperialGold;
    ctx.fill();
    
    // 半圆 - 阴（黑）
    ctx.beginPath();
    ctx.arc(centerX, centerY + radius/2, radius/2, 0, Math.PI, true);
    ctx.fillStyle = this.config.colors.purpleStar;
    ctx.fill();
    
    // 阴阳鱼眼
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius/2, radius/6, 0, Math.PI * 2);
    ctx.fillStyle = this.config.colors.purpleStar;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY + radius/2, radius/6, 0, Math.PI * 2);
    ctx.fillStyle = this.config.colors.imperialGold;
    ctx.fill();
  }
  
  /**
   * 绘制文本 - 居中
   */
  drawTextCentered(text, y, fontSize, color, fontFamily = 'Georgia') {
    const ctx = this.ctx;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, this.config.width / 2, y);
  }
  
  /**
   * 绘制边框装饰
   */
  drawBorderDecoration() {
    const ctx = this.ctx;
    const padding = this.config.padding;
    const borderWidth = 2;
    
    ctx.strokeStyle = this.config.colors.imperialGold;
    ctx.lineWidth = borderWidth;
    
    // 四个角的装饰
    const cornerSize = 30;
    
    // 左上角
    ctx.beginPath();
    ctx.moveTo(padding, padding + cornerSize);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + cornerSize, padding);
    ctx.stroke();
    
    // 右上角
    ctx.beginPath();
    ctx.moveTo(this.config.width - padding - cornerSize, padding);
    ctx.lineTo(this.config.width - padding, padding);
    ctx.lineTo(this.config.width - padding, padding + cornerSize);
    ctx.stroke();
    
    // 左下角
    ctx.beginPath();
    ctx.moveTo(padding, this.config.height - padding - cornerSize);
    ctx.lineTo(padding, this.config.height - padding);
    ctx.lineTo(padding + cornerSize, this.config.height - padding);
    ctx.stroke();
    
    // 右下角
    ctx.beginPath();
    ctx.moveTo(this.config.width - padding - cornerSize, this.config.height - padding);
    ctx.lineTo(this.config.width - padding, this.config.height - padding);
    ctx.lineTo(this.config.width - padding, this.config.height - padding - cornerSize);
    ctx.stroke();
  }
  
  /**
   * 绘制底部Logo
   */
  drawLogo(y) {
    const ctx = this.ctx;
    const centerX = this.config.width / 2;
    
    // Logo文字
    ctx.font = '16px Georgia';
    ctx.fillStyle = this.config.colors.agedGold;
    ctx.textAlign = 'center';
    ctx.fillText('MYSTIC FATE', centerX, y);
    
    ctx.font = '12px Georgia';
    ctx.fillStyle = this.config.colors.ash;
    ctx.fillText('紫微斗数 • 东方命理', centerX, y + 20);
  }
}

// ==================== 卡片生成器 ====================

/**
 * 生成命盘身份卡（Destiny Card）
 */
function generateDestinyCard(userData) {
  const generator = new ShareCardGenerator();
  generator.initCanvas();
  
  const ctx = generator.ctx;
  const config = generator.config;
  const { name, zodiac, element, mainStar, bureau, quote } = userData;
  
  // 获取五行主题色
  const elementTheme = config.elementColors[element.toLowerCase()] || config.elementColors.water;
  
  // 绘制背景
  generator.drawBackground({ start: config.colors.voidBlack, end: elementTheme.secondary });
  generator.drawStarfield();
  
  // 顶部装饰线
  ctx.beginPath();
  ctx.moveTo(config.width / 2 - 80, 60);
  ctx.lineTo(config.width / 2 + 80, 60);
  ctx.strokeStyle = config.colors.imperialGold;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 标题
  generator.drawTextCentered('✦ MYSTIC FATE ✦', 90, 20, config.colors.imperialGold);
  
  // 阴阳图
  generator.drawYinYang(config.width / 2, 180, 80);
  
  // 分隔线
  ctx.beginPath();
  ctx.moveTo(config.width / 2 - 100, 260);
  ctx.lineTo(config.width / 2 + 100, 260);
  ctx.strokeStyle = config.colors.imperialGold;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 用户名
  generator.drawTextCentered(name || 'Seeker', 300, 28, config.colors.parchment, 'Georgia');
  
  // 主星信息
  generator.drawTextCentered(`◈ ${mainStar || 'Celestial Star'} Destiny`, 340, 18, config.colors.purpleStar);
  
  // 五行局
  generator.drawTextCentered(`${bureau || element} Bureau`, 365, 14, config.colors.ash);
  
  // 生肖
  const zodiacName = zodiac ? zodiac.charAt(0).toUpperCase() + zodiac.slice(1) : 'Cosmic';
  generator.drawTextCentered(`${zodiacName} Year Energy`, 395, 14, config.colors.agedGold);
  
  // 引用语
  ctx.beginPath();
  ctx.moveTo(80, 450);
  ctx.lineTo(config.width - 80, 450);
  ctx.strokeStyle = `${config.colors.imperialGold}33`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.font = 'italic 16px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  
  // 分行显示引用
  const quoteText = quote || 'The stars have written your story.';
  const maxWidth = config.width - 100;
  generator.wrapText(quoteText, config.width / 2, 490, maxWidth, 22);
  
  // 四化图例
  ctx.font = '12px Georgia';
  ctx.textAlign = 'center';
  
  const sihuaY = 580;
  const sihuaItems = [
    { label: 'Lu', color: config.colors.huaLu },
    { label: 'Quan', color: config.colors.huaQuan },
    { label: 'Ke', color: config.colors.huaKe },
    { label: 'Ji', color: config.colors.huaJi }
  ];
  
  const startX = config.width / 2 - 80;
  sihuaItems.forEach((item, i) => {
    const x = startX + i * 55;
    ctx.beginPath();
    ctx.arc(x, sihuaY, 8, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.fillStyle = config.colors.parchment;
    ctx.fillText(item.label, x, sihuaY + 25);
  });
  
  // 装饰边框
  generator.drawBorderDecoration();
  
  // Logo
  generator.drawLogo(config.height - 80);
  
  // 生成图片并返回
  return generator.canvas.toDataURL('image/png');
}

/**
 * 生成每日天机卡（Daily Whisper Card）
 */
function generateDailyWhisperCard(data) {
  const generator = new ShareCardGenerator();
  generator.initCanvas();
  
  const ctx = generator.ctx;
  const config = generator.config;
  const { name, whisper, date, luckyDo, luckyDont, direction, element } = data;
  
  // 获取五行主题色
  const elementTheme = config.elementColors[element?.toLowerCase()] || config.elementColors.water;
  
  // 绘制背景
  generator.drawBackground({ start: elementTheme.secondary, end: config.colors.voidBlack });
  generator.drawStarfield();
  
  // 月相装饰
  ctx.beginPath();
  ctx.arc(config.width - 80, 80, 40, 0, Math.PI * 2);
  ctx.fillStyle = `${config.colors.imperialGold}22`;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(config.width - 70, 70, 30, 0, Math.PI * 2);
  ctx.fillStyle = config.colors.imperialGold;
  ctx.globalAlpha = 0.8;
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // 标题
  generator.drawTextCentered("Today's Whisper", 80, 14, config.colors.ash);
  
  // 日期
  generator.drawTextCentered(date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 105, 12, config.colors.agedGold);
  
  // 分隔装饰
  ctx.beginPath();
  ctx.moveTo(config.width / 2 - 60, 135);
  ctx.lineTo(config.width / 2 + 60, 135);
  ctx.strokeStyle = config.colors.imperialGold;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 天机内容
  ctx.font = 'italic 20px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  generator.wrapText(`"${whisper || 'The stars are aligning for you...'}"`, config.width / 2, 180, config.width - 80, 28);
  
  // 来源
  generator.drawTextCentered('— From your Destiny Palace —', 240, 12, config.colors.agedGold);
  
  // Do/Don't 区域
  const boxY = 280;
  const boxWidth = (config.width - 60) / 2 - 10;
  
  // Do框
  ctx.fillStyle = `${config.colors.huaLu}33`;
  ctx.strokeStyle = config.colors.huaLu;
  ctx.lineWidth = 1;
  roundRect(ctx, 20, boxY, boxWidth, 180, 8, true, true);
  
  ctx.font = 'bold 14px Georgia';
  ctx.fillStyle = config.colors.huaLu;
  ctx.textAlign = 'center';
  ctx.fillText('✦ DO', 20 + boxWidth / 2, boxY + 30);
  
  ctx.font = '13px Georgia';
  ctx.fillStyle = config.colors.parchment;
  const doItems = (luckyDo || ['Speak your truth', 'Trust your instincts', 'Take initiative']).slice(0, 4);
  doItems.forEach((item, i) => {
    ctx.fillText(`✦ ${item}`, 20 + boxWidth / 2, boxY + 60 + i * 28);
  });
  
  // Don't框
  ctx.fillStyle = `${config.colors.huaJi}33`;
  ctx.strokeStyle = config.colors.huaJi;
  roundRect(ctx, config.width / 2 + 10, boxY, boxWidth, 180, 8, true, true);
  
  ctx.font = 'bold 14px Georgia';
  ctx.fillStyle = config.colors.huaJi;
  ctx.textAlign = 'center';
  ctx.fillText('✦ DON\'T', config.width / 2 + 10 + boxWidth / 2, boxY + 30);
  
  ctx.font = '13px Georgia';
  ctx.fillStyle = config.colors.parchment;
  const dontItems = (luckyDont || ['Rush decisions', 'Hide your feelings', 'Play it safe']).slice(0, 4);
  dontItems.forEach((item, i) => {
    ctx.fillText(`✦ ${item}`, config.width / 2 + 10 + boxWidth / 2, boxY + 60 + i * 28);
  });
  
  // 幸运元素
  generator.drawTextCentered('Lucky Elements', 510, 12, config.colors.ash);
  
  ctx.font = '13px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  ctx.fillText(`Direction: ${direction || 'East'}  •  Element: ${element || 'Wood'}`, config.width / 2, 535);
  
  // 用户名
  generator.drawTextCentered(`— ${name || 'Seeker'} —`, 570, 14, config.colors.imperialGold);
  
  // Logo
  generator.drawLogo(config.height - 60);
  
  return generator.canvas.toDataURL('image/png');
}

/**
 * 生成命定之缘卡（Soulmate Card）
 */
function generateSoulmateCard(data) {
  const generator = new ShareCardGenerator();
  generator.initCanvas();
  
  const ctx = generator.ctx;
  const config = generator.config;
  const { userName, partnerArchetype, partnerElement, traits, timing } = data;
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
  gradient.addColorStop(0, `${config.colors.purpleStar}44`);
  gradient.addColorStop(1, config.colors.voidBlack);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);
  
  generator.drawStarfield();
  
  // 标题
  generator.drawTextCentered('✦ Soulmate Portrait ✦', 70, 16, config.colors.imperialGold);
  
  // 分隔线
  ctx.beginPath();
  ctx.moveTo(config.width / 2 - 60, 100);
  ctx.lineTo(config.width / 2 + 60, 100);
  ctx.strokeStyle = config.colors.imperialGold;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 关系图腾（两个重叠的圆）
  const centerX = config.width / 2;
  const centerY = 180;
  
  ctx.beginPath();
  ctx.arc(centerX - 30, centerY, 50, 0, Math.PI * 2);
  ctx.fillStyle = `${config.colors.imperialGold}44`;
  ctx.fill();
  ctx.strokeStyle = config.colors.imperialGold;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX + 30, centerY, 50, 0, Math.PI * 2);
  ctx.fillStyle = `${config.colors.purpleStar}44`;
  ctx.fill();
  ctx.strokeStyle = config.colors.purpleStar;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 交集
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
  ctx.fillStyle = config.colors.imperialGold;
  ctx.fill();
  
  // 伴侣画像
  generator.drawTextCentered("The Universe Has Written...", 260, 14, config.colors.ash);
  
  ctx.font = 'bold 22px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  ctx.fillText(partnerArchetype || 'A Soul Who Completes You', config.width / 2, 295);
  
  // 元素
  ctx.font = '14px Georgia';
  ctx.fillStyle = config.colors.purpleStar;
  ctx.fillText(`${partnerElement || 'Cosmic'} Energy Partner`, config.width / 2, 325);
  
  // 特质
  ctx.beginPath();
  ctx.moveTo(40, 360);
  ctx.lineTo(config.width - 40, 360);
  ctx.strokeStyle = `${config.colors.imperialGold}33`;
  ctx.stroke();
  
  generator.drawTextCentered('Their Essence', 385, 12, config.colors.ash);
  
  ctx.font = '14px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  const traitList = (traits || ['Charming', 'Wise', 'Passionate', 'Devoted']).slice(0, 4);
  generator.wrapText(traitList.join(' • '), config.width / 2, 415, config.width - 80, 20);
  
  // 相遇时机
  ctx.beginPath();
  ctx.moveTo(40, 470);
  ctx.lineTo(config.width - 40, 470);
  ctx.strokeStyle = `${config.colors.imperialGold}33`;
  ctx.stroke();
  
  generator.drawTextCentered('When You\'ll Meet', 495, 12, config.colors.ash);
  
  ctx.font = 'italic 15px Georgia';
  ctx.fillStyle = config.colors.parchment;
  ctx.textAlign = 'center';
  generator.wrapText(timing || 'When the stars align and destiny calls...', config.width / 2, 525, config.width - 80, 22);
  
  // 用户名
  generator.drawTextCentered(`— ${userName || 'Seeker'}'s Cosmic Map —`, 600, 14, config.colors.imperialGold);
  
  // Logo
  generator.drawLogo(config.height - 60);
  
  return generator.canvas.toDataURL('image/png');
}

/**
 * 辅助函数：绘制圆角矩形
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * 辅助函数：自动换行文本
 */
ShareCardGenerator.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {
  const ctx = this.ctx;
  const words = text.split(' ');
  let line = '';
  let posY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, posY);
      line = words[n] + ' ';
      posY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, posY);
};

// ==================== 下载和分享功能 ====================

/**
 * 下载分享卡片
 */
function downloadShareCard(dataUrl, filename = 'mystic-zodiac-share.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * 分享到社交平台
 */
async function shareToSocial(platform, dataUrl, shareText) {
  if (navigator.share) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'mystic-zodiac-share.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'Mystic Fate',
        text: shareText || 'Check out my cosmic blueprint!',
        files: [file]
      });
      return true;
    } catch (err) {
      console.log('Share cancelled or failed:', err);
      return false;
    }
  }
  
  // Fallback: 下载图片
  downloadShareCard(dataUrl);
  return true;
}

/**
 * 生成并分享命盘身份卡
 */
function shareDestinyCard(userData) {
  const cardData = generateDestinyCard(userData);
  const shareText = `${userData.name}'s cosmic blueprint: ${userData.mainStar} Destiny • ${userData.bureau || userData.element} Bureau`;
  return { cardData, shareText };
}

/**
 * 生成并分享每日天机卡
 */
function shareDailyWhisper(data) {
  const cardData = generateDailyWhisperCard(data);
  const shareText = `Today's whisper from the stars: "${data.whisper}"`;
  return { cardData, shareText };
}

/**
 * 生成并分享命定之缘卡
 */
function shareSoulmateCard(data) {
  const cardData = generateSoulmateCard(data);
  const shareText = `The stars have revealed my soulmate archetype: ${data.partnerArchetype}`;
  return { cardData, shareText };
}

// ==================== 导出 ====================

if (typeof window !== 'undefined') {
  window.ShareCardGenerator = ShareCardGenerator;
  window.generateDestinyCard = generateDestinyCard;
  window.generateDailyWhisperCard = generateDailyWhisperCard;
  window.generateSoulmateCard = generateSoulmateCard;
  window.downloadShareCard = downloadShareCard;
  window.shareToSocial = shareToSocial;
  window.shareDestinyCard = shareDestinyCard;
  window.shareDailyWhisper = shareDailyWhisper;
  window.shareSoulmateCard = shareSoulmateCard;
}

console.log('✅ Share Card Generator loaded - 社交分享卡片生成器已加载');

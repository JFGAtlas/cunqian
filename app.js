// Initialize Lucide icons on load
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initTickerFluctuations();
    initLedMarquee();
    initChatroom();
    initCardFormatter();
    initPresets();
    initCanvasCoins();
});

/* ==========================================================================
   1. Ticker Fluctuations & Interactive Animations
   ========================================================================== */
function initTickerFluctuations() {
    const tickerItems = [
        { id: 'leek-index', label: '韭菜大盘指数', val: -99.98, unit: '%', icon: 'trending-down', color: 'text-danger' },
        { id: 'escape-prob', label: '行长跑路概率', val: 99.9, unit: '%', icon: 'trending-up', color: 'text-warning' },
        { id: 'reserve-rate', label: '备付准备金率', val: 0.0000, unit: '%', icon: 'shield-alert', color: 'text-info' },
        { id: 'offshore-asset', label: '离岸空壳资产', val: 888.8, unit: 'B', prefix: '$', icon: 'dollar-sign', color: 'text-success' },
        { id: 'coffee-rate', label: '经理咖啡消耗率', val: 180, unit: '%', icon: 'coffee', color: 'text-warning' }
    ];

    // Periodically fluctuate values to make it look "alive"
    setInterval(() => {
        tickerItems.forEach(item => {
            if (item.id === 'leek-index') {
                item.val = -99.90 - Math.random() * 0.09;
            } else if (item.id === 'escape-prob') {
                item.val = 99.8 + Math.random() * 0.2;
                if (item.val > 100) item.val = 100;
            } else if (item.id === 'coffee-rate') {
                item.val += Math.floor(Math.random() * 5) - 2;
            }
        });
        updateTickerHTML(tickerItems);
    }, 4000);
}

function updateTickerHTML(items) {
    const container = document.getElementById('ticker-content');
    if (!container) return;

    container.innerHTML = items.map(item => {
        let valStr = '';
        if (item.id === 'leek-index') {
            valStr = item.val.toFixed(4) + item.unit;
        } else if (item.id === 'escape-prob') {
            valStr = item.val.toFixed(2) + item.unit + (item.val >= 99.95 ? ' 紧急告警' : ' 持续向好');
        } else if (item.id === 'reserve-rate') {
            valStr = item.val.toFixed(6) + item.unit;
        } else if (item.id === 'offshore-asset') {
            valStr = item.prefix + item.val.toFixed(1) + item.unit;
        } else {
            valStr = '+' + item.val + item.unit;
        }

        return `
            <span class="ticker-item">
                <i data-lucide="${item.icon}" class="${item.color}"></i> 
                ${item.label}: <strong>${valStr}</strong>
            </span>
        `;
    }).join('');

    lucide.createIcons();
}

/* ==========================================================================
   2. Horizontal LED Marquee Logic
   ========================================================================== */
let marqueeData = [
    "神秘富豪王总刚刚存入 88,888,888 元（备注：用来给小区野猫买进口鱼罐头）",
    "背锅部门张经理存入 50,000 元（备注：背着老婆存的私房钱，求保密！）",
    "热心市民李先生存入 0.50 元（备注：试一下这水有多深，行长别卷）",
    "宇宙神秘玩家存入 1,000,000,000 越南盾（备注：瞬间体验千亿富翁的快感）",
    "大厂高P程序猿存入 99,999.99 元（备注：防脱发救急基金，稳健第一）",
    "著名网红阿强存入 200,000 元（备注：存完发个朋友圈，假装自己理财有道）",
    "行长小舅子存入 -2,000,000 元（备注：系统跑路演练，一切正常不用慌）",
    "无名韭菜存入 100 元（备注：梦想还是有的，万一行长良心发现给退了呢）"
];

function initLedMarquee() {
    const marquee = document.getElementById('led-marquee');
    if (!marquee) return;

    // Render original and duplicates to ensure continuous scrolling
    function renderMarqueeItems() {
        let content = marqueeData.map(msg => `
            <span class="led-msg">
                <i data-lucide="bell" style="width:14px;height:14px;color:#f59e0b;"></i>
                ${msg}
            </span>
        `).join('');
        
        // Double it to enable continuous wrapping
        marquee.innerHTML = content + content;
        lucide.createIcons();
    }

    renderMarqueeItems();

    // JavaScript continuous scroll
    let position = 0;
    const speed = 0.8; // pixels per frame

    function scroll() {
        position -= speed;
        const firstHalfWidth = marquee.scrollWidth / 2;
        if (Math.abs(position) >= firstHalfWidth) {
            position = 0; // seamless reset
        }
        marquee.style.transform = `translate3d(${position}px, 0, 0)`;
        requestAnimationFrame(scroll);
    }

    // Start scroll after layout renders
    setTimeout(scroll, 100);
}

function appendToMarquee(message) {
    marqueeData.unshift(message); // Put user's transaction at the beginning
    if (marqueeData.length > 20) {
        marqueeData.pop(); // limit size
    }
    // Re-render
    const marquee = document.getElementById('led-marquee');
    if (!marquee) return;
    
    let content = marqueeData.map(msg => `
        <span class="led-msg">
            <i data-lucide="bell" style="width:14px;height:14px;color:#f59e0b;"></i>
            ${msg}
        </span>
    `).join('');
    marquee.innerHTML = content + content;
    lucide.createIcons();
}

/* ==========================================================================
   3. Card Formatter & Presets
   ========================================================================== */
function initCardFormatter() {
    const cardInput = document.getElementById('card-number');
    const cardTip = document.getElementById('card-tip');

    if (!cardInput || !cardTip) return;

    cardInput.addEventListener('input', (e) => {
        // Strip everything except digits
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as XXXX XXXX XXXX XXXX XXX
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;

        // Feedback tip
        const digitCount = value.length;
        if (digitCount === 0) {
            cardTip.textContent = "请输入 16-19 位有效银行卡号进行“超度”";
            cardTip.className = "validation-tip";
        } else if (digitCount < 16) {
            cardTip.textContent = `⚠️ 卡号太短 (当前 ${digitCount} 位)，行长无法起飞`;
            cardTip.className = "validation-tip error";
        } else if (digitCount >= 16 && digitCount <= 19) {
            cardTip.textContent = "✅ 卡号格式完美！本行理财大门已向您敞开";
            cardTip.className = "validation-tip success";
        } else {
            cardTip.textContent = `⚠️ 卡号超出 (当前 ${digitCount} 位)，印钞机快冒烟了！`;
            cardTip.className = "validation-tip error";
        }
    });
}

function initPresets() {
    const amountInput = document.getElementById('deposit-amount');
    const presets = document.querySelectorAll('.preset-btn');

    if (!amountInput) return;

    presets.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value');
            if (val === 'allin') {
                // Generate a funny massive all-in number
                const randomAllIn = Math.floor(500000 + Math.random() * 95000000);
                amountInput.value = randomAllIn + '.88';
                // Trigger a screen shake just for the fun of it
                const card = document.querySelector('.card-deposit');
                card.style.animation = 'allin-shake 0.4s ease';
                setTimeout(() => card.style.animation = '', 400);
            } else {
                amountInput.value = val;
            }
            amountInput.focus();
        });
    });
}

// Add simple shake dynamic for All-In action
const style = document.createElement('style');
style.innerHTML = `
@keyframes allin-shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-8px) rotate(-1deg); }
    50% { transform: translateX(6px) rotate(1deg); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(style);

/* ==========================================================================
   4. Chatroom Simulating Bot Chat
   ========================================================================== */
const botDatabase = [
    { sender: "保洁阿姨", content: "刚扫地在垃圾桶里捡到行长的机票存根，行长今晚去马尔代夫，大家知道啥意思吗？" },
    { sender: "资深维权人", content: "有没有人组织个维权群？我存了3块5毛钱，现在吃不下饭睡不着觉。" },
    { sender: "保安张大爷", content: "别存了别存了！我刚才看到好几台印钞机搬出了行长办公室，换成了咖啡机。" },
    { sender: "隔壁柜台王美眉", content: "存款送精致塑料盆哦！目前塑料盆已经断货，送完即止（下辈子补发）。" },
    { sender: "理财经理(小丽)", content: "大家不要信谣传谣！本行资金链极为安全，刚才的系统故障纯属行长拔错插头。" },
    { sender: "神秘散户", content: "这利息每天200%真的是真的吗？我把结婚基金都梭哈进去了！" },
    { sender: "精明大叔", content: "我存了一亿，账户上的数字直线上升！虽然提不出来，但每天看着资产数字我就觉得很爽。" },
    { sender: "系统通知", content: "[系统通知] 鉴于提现人数过多，物理光缆已被老鼠咬断，修复预计需要 800 年。" },
    { sender: "天真小明", content: "这银行叫‘貔貅’，貔貅不是只进不出吗？等等... 好像有什么不对劲？" },
    { sender: "金融巨鳄", content: "存入 1,000,000,000 的瞬间，我感觉财富已经被净化了，四大皆空，阿弥陀佛。" }
];

const smartReplies = [
    { keywords: ["提现", "取钱", "取款", "拿钱"], replies: [
        "取钱？我们银行只在梦里开通了提现通道。",
        "兄弟，提现功能正在内部封闭测试，你可以先去排队，目前前面还有14亿人。",
        "行长说了，提现可以，需要瑞士银行、美联储以及保安张大爷三方联签确认。",
        "别提了，我刚才去柜台问，柜员直接给了我一个拥抱并祝我好运。"
    ]},
    { keywords: ["利息", "赚钱", "收益", "理财"], replies: [
        "理财理得好，明年街上跑！看好你的本金哦！",
        "本行特推理财：‘本金超度计划’，100%返还空气币！",
        "利息是按秒计算的，虽然取不出来，但是数字是真的在跳！",
        "这里利息虽然高，但本金已经和空气融为一体了。"
    ]},
    { keywords: ["卡号", "密码", "安全"], replies: [
        "把密码发出来我帮你保管，绝对不会存进数据库（真的，信我）。",
        "本行安全评级高大上，物理断网保存，连网线都没插，黑客都偷不走！",
        "卡号随便输，本行后台的垃圾回收机制（Garbage Collection）很敬业，0.1秒就清理干净。"
    ]},
    { keywords: ["跑路", "行长", "倒闭", "骗子"], replies: [
        "胡说！行长只是去海外考察避税群岛的沙滩质量了！",
        "辟谣！行长没跑，只是私人飞机刚好今天起飞而已。",
        "保安大爷已经把门锁了，他说这是为了防止外面的人来分钱。",
        "怎么能叫骗呢？这叫‘财富的互联网深度重组’。"
    ]}
];

function initChatroom() {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    if (!chatMessages || !chatForm || !chatInput) return;

    // Load initial gag messages
    const initialMsgs = [
        { sender: "理财经理(小美)", content: "欢迎各位新韭菜！本行支持24小时随时存款，存款即送‘金牌储户’专属表情包！", isBot: true },
        { sender: "保安张大爷", content: "行长刚才打包行李了，我问他是不是去度假，他笑而不语送了我一箱方便面。", isBot: true },
        { sender: "维权群主", content: "有没有存了五毛以上的？来这边登记一下，准备下辈子起诉本行。", isBot: true }
    ];

    initialMsgs.forEach(msg => appendChatMessage(msg.sender, msg.content, msg.isBot ? 'bot' : 'self'));

    // Handle user send message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        appendChatMessage("您 (尊贵储户)", text, 'self');
        chatInput.value = '';

        // Bot reaction check
        setTimeout(() => {
            handleBotSmartReply(text);
        }, 1200 + Math.random() * 800);
    });

    // Schedule random robot chats to keep chat room alive
    setInterval(() => {
        const rand = botDatabase[Math.floor(Math.random() * botDatabase.length)];
        const type = rand.sender === "系统通知" ? "system" : "bot";
        appendChatMessage(rand.sender, rand.content, type);
    }, 9000);
}

function appendChatMessage(sender, content, type = 'bot') {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    msgDiv.innerHTML = `
        <div class="msg-meta">${sender} &bull; ${time}</div>
        <div class="msg-bubble">${content}</div>
    `;

    chatMessages.appendChild(msgDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleBotSmartReply(userText) {
    let replyText = "";
    
    // Search keywords
    for (let rule of smartReplies) {
        const matches = rule.keywords.some(keyword => userText.toLowerCase().includes(keyword));
        if (matches) {
            replyText = rule.replies[Math.floor(Math.random() * rule.replies.length)];
            break;
        }
    }

    // Default reply if no keyword matches
    if (!replyText) {
        const defaultReplies = [
            "卧槽，大佬出手就是不凡！牛逼！",
            "又来一个送本金的，行长今晚又能多开两瓶拉菲了。",
            "楼上的大佬，求带飞！等理财回本了请我吃麻辣烫！",
            "稳住！只要我们存得够快，亏损就追不上我们！",
            "虽然看不懂，但感觉你在下一盘大棋。",
            "存完感觉整个人都升华了对吧？四大皆空。"
        ];
        replyText = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }

    const botNames = ["吃瓜群众", "韭菜三号", "理财小秘书", "路过的键盘侠", "保洁阿姨", "保安张大爷"];
    const randomName = botNames[Math.floor(Math.random() * botNames.length)];
    
    appendChatMessage(randomName, replyText, 'bot');
}

/* ==========================================================================
   5. Deposit Action & dramatic modal flow
   ========================================================================== */
const depositForm = document.getElementById('deposit-form');
const loadingModal = document.getElementById('loading-modal');
const successModal = document.getElementById('success-modal');

if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cardNum = document.getElementById('card-number').value.replace(/\s/g, '');
        const amountVal = parseFloat(document.getElementById('deposit-amount').value);

        if (cardNum.length < 16) {
            alert('⚠️ 卡号长度不符！请重新输入 (行长说这卡太短刷不出跑路机票)。');
            return;
        }

        // Show loading progress modal
        showLoadingProcess(cardNum, amountVal);
    });
}

function showLoadingProcess(cardNum, amount) {
    loadingModal.classList.add('active');
    
    const progressFill = document.getElementById('progress-fill');
    const loadingTitle = document.getElementById('loading-title');
    
    // Reset steps
    const steps = [
        document.getElementById('step-0'),
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    steps.forEach((step, idx) => {
        if (idx === 0) {
            step.className = "step-item active";
            step.innerHTML = `<i data-lucide="circle-dashed" class="icon-spin"></i> ${getStepText(idx)}`;
        } else {
            step.className = "step-item";
            step.innerHTML = `<i data-lucide="circle" class="icon-pending"></i> ${getStepText(idx)}`;
        }
    });
    lucide.createIcons();

    let currentStep = 0;
    progressFill.style.width = '0%';

    const stepInterval = 1300; // time per step
    
    const interval = setInterval(() => {
        // Complete current step
        const prevStep = steps[currentStep];
        prevStep.className = "step-item completed";
        prevStep.innerHTML = `<i data-lucide="check-circle" class="text-success"></i> ${getStepText(currentStep)}`;
        
        currentStep++;
        
        // Progress bar percentage
        const progressPercentage = (currentStep / steps.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        if (currentStep < steps.length) {
            // Activate next step
            const nextStep = steps[currentStep];
            nextStep.className = "step-item active";
            nextStep.innerHTML = `<i data-lucide="circle-dashed" class="icon-spin"></i> ${getStepText(currentStep)}`;
            loadingTitle.textContent = getLoadingTitle(currentStep);
        } else {
            // All steps finished
            clearInterval(interval);
            setTimeout(() => {
                loadingModal.classList.remove('active');
                showSuccessReceipt(cardNum, amount);
            }, 800);
        }
        lucide.createIcons();
    }, stepInterval);
}

function getStepText(stepIdx) {
    const textArr = [
        "连接瑞士苏黎世地下金库...",
        "正在将钞票折成精美纸飞机...",
        "汇率锁定：人民币 1:1 兑换空气币...",
        "正在为行长配置海外避税群岛别墅..."
    ];
    return textArr[stepIdx];
}

function getLoadingTitle(stepIdx) {
    const titles = [
        "正在建立安全存款通道...",
        "正在打包本金进行物流输送...",
        "正在进行高纬度加密交易...",
        "正在为高管划拨跑路基金..."
    ];
    return titles[stepIdx];
}

function showSuccessReceipt(cardNum, amount) {
    // Format card number to show only prefix and suffix
    const maskedCard = cardNum.substring(0, 4) + " **** **** " + cardNum.substring(cardNum.length - 4);
    const formattedAmount = amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('receipt-card-num').textContent = maskedCard;
    document.getElementById('receipt-amount').textContent = `¥ ${formattedAmount}`;
    document.getElementById('receipt-aircoin').textContent = `${formattedAmount} AC`;
    
    // Activate success modal
    successModal.classList.add('active');
    
    // Play funny cash sound
    try {
        const sound = document.getElementById('sound-coins');
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio autoplay blocked by browser policy"));
    } catch(err) {
        console.log("Audio play error", err);
    }

    // Trigger golden rain particles
    startCoinRain();

    // Log this event to the horizontal marquee marqueeData
    const funnyNames = ["张大仙", "王铁柱", "李二狗", "赵铁牛", "陈大翠", "神秘巨擘"];
    const randName = funnyNames[Math.floor(Math.random() * funnyNames.length)];
    const gagMsg = `热烈庆祝：尊贵储户(${randName})刚刚成功存款 ${formattedAmount} 元！行长致以诚挚敬意并买了一杯手冲咖啡！`;
    appendToMarquee(gagMsg);
}

// Receipt Button event listeners
document.getElementById('btn-again').addEventListener('click', () => {
    successModal.classList.remove('active');
    stopCoinRain();
    // Reset Form
    document.getElementById('deposit-form').reset();
    document.getElementById('card-tip').textContent = "请输入 16-19 位有效银行卡号进行“超度”";
    document.getElementById('card-tip').className = "validation-tip";
});

document.getElementById('btn-print').addEventListener('click', () => {
    alert("⚠️ 提示：凭证下载插件已被行长连夜带去海外避税。请使用手机截屏保存，或者打印后贴在床头，每天拜三拜以保佑本金！");
});


/* ==========================================================================
   6. Coin Rain Canvas Particle Effect
   ========================================================================== */
let coinCanvas, ctx;
let animationFrameId = null;
let coins = [];

function initCanvasCoins() {
    coinCanvas = document.getElementById('coin-canvas');
    if (!coinCanvas) return;
    ctx = coinCanvas.getContext('2d');
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

function resizeCanvas() {
    if (coinCanvas) {
        coinCanvas.width = window.innerWidth;
        coinCanvas.height = window.innerHeight;
    }
}

class Coin {
    constructor() {
        this.reset();
        this.y = -Math.random() * 200 - 50; // spawn offscreen
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -50;
        this.size = Math.random() * 15 + 10; // radius
        this.speedY = Math.random() * 5 + 4;
        this.speedX = Math.random() * 4 - 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.type = Math.random() > 0.45 ? 'coin' : 'bill'; // coin or bill
        this.color = this.type === 'coin' ? '#D4AF37' : '#10b981';
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > window.innerHeight + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (this.type === 'coin') {
            // Draw Gold Coin
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#D4AF37';
            ctx.shadowColor = 'rgba(212,175,55,0.6)';
            ctx.shadowBlur = 8;
            ctx.fill();

            // Inner circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = '#F3E5AB';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Dollar/CNY Sign
            ctx.fillStyle = '#F3E5AB';
            ctx.font = `bold ${this.size * 0.9}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('¥', 0, 0);
        } else {
            // Draw Paper Bill (Green)
            const width = this.size * 2.2;
            const height = this.size * 1.1;
            
            ctx.beginPath();
            ctx.rect(-width / 2, -height / 2, width, height);
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = 'rgba(16,185,129,0.5)';
            ctx.shadowBlur = 8;
            ctx.fill();
            
            // border
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4);

            // Center circle
            ctx.beginPath();
            ctx.arc(0, 0, height * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = '#a7f3d0';
            ctx.fill();
            
            // CNY sign in center of bill
            ctx.fillStyle = '#065f46';
            ctx.font = `bold ${height * 0.5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('¥', 0, 0);
        }

        ctx.restore();
    }
}

function startCoinRain() {
    if (animationFrameId) return; // already running
    
    // Spawn particles
    coins = [];
    for (let i = 0; i < 60; i++) {
        coins.push(new Coin());
    }

    function animate() {
        ctx.clearRect(0, 0, coinCanvas.width, coinCanvas.height);
        coins.forEach(coin => {
            coin.update();
            coin.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    // Auto fadeout after 6 seconds to save system CPU resources
    setTimeout(() => {
        stopCoinRain();
    }, 7000);
}

function stopCoinRain() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (ctx) {
        ctx.clearRect(0, 0, coinCanvas.width, coinCanvas.height);
    }
}

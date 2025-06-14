// ---- SOUND FUNCTION ----
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play();
  } catch (e) {}
}

// ---- Welcome Popup Function ----
function showWelcomePopup(username) {
  const old = document.getElementById('welcome-popup');
  if (old) old.remove();
  const popup = document.createElement('div');
  popup.className = 'welcome-popup';
  popup.id = 'welcome-popup';
  popup.innerHTML = `
    <span class="welcome-emoji">🎉</span>
    <div style="font-size:2.3rem;font-weight:bold;letter-spacing:1px;text-shadow:0 0 18px #00fff7cc;">Welcome</div>
    <div style="font-size:1.3rem;margin-top:8px;letter-spacing:0.5px;">
      <span style="color:#ffff00;text-shadow:0 0 8px #ff0;">${username}</span>!
    </div>
    <div style="margin-top:18px;font-size:1.1rem;opacity:0.8;">Enjoy the Mystery Box Game 🚀</div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add('hide');
    setTimeout(() => popup.remove(), 600);
  }, 2500);
}

// ---- Toast Notification ----
function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = 1;
  setTimeout(() => { toast.style.opacity = 0; }, 1800);
}

// ---- Shake Animation ----
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'shakeAnim 0.4s';
  el.addEventListener('animationend', () => {
    el.style.animation = '';
  }, { once: true });
}

// ---- Generic Modal Open/Close ----
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function hideModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ---- LOGIN & REGISTER LOGIC ----
document.addEventListener('DOMContentLoaded', () => {
  // ----- Login/Register -----
  const loginPage = document.getElementById('login-page');
  const gamePage = document.getElementById('game-page');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const loginError = document.getElementById('login-error');

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      playSound('sounds/click.wav');
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      if (username && password) {
        try {
          const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (data.success) {
            loginPage.style.display = 'none';
            gamePage.style.display = 'block';
            setTimeout(() => {
              showWelcomePopup(username);
              showToast('Welcome, ' + username + '!');
            }, 400);
          } else {
            loginError.textContent = "Login Failed: " + (data.error || "Unknown error");
            shakeElement(loginError);
          }
        } catch (err) {
          loginError.textContent = "Server से connect नहीं हो पाया!";
          shakeElement(loginError);
        }
      } else {
        loginError.textContent = "Username और Password दोनों भरें!";
        shakeElement(loginError);
      }
    });
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      playSound('sounds/click.wav');
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      if (username && password) {
        try {
          const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (data.success) {
            loginError.textContent = "Registration Success! अब login करें।";
            showToast('Registration Success!');
          } else {
            loginError.textContent = "Registration Failed: " + (data.error || "Unknown error");
            shakeElement(loginError);
          }
        } catch (err) {
          loginError.textContent = "Server से connect नहीं हो पाया!";
          shakeElement(loginError);
        }
      } else {
        loginError.textContent = "Username और Password दोनों भरें!";
        shakeElement(loginError);
      }
    });
  }

  // ---- WALLET STATE ----
  let walletAmount = 5100;
  let totalWinnings = 0;
  let totalBoxes = 0;

  // ---- WALLET PANEL LOGIC ----
  function animateWalletAmtPremium(element) {
    element.classList.add('wallet-anim');
    setTimeout(() => element.classList.remove('wallet-anim'), 600);
  }
  function updateWalletUI() {
    const walletAmountSpan = document.getElementById('wallet-amount');
    const totalWinningsSpan = document.getElementById('total-winnings');
    const totalBoxesSpan = document.getElementById('total-boxes');
    if (walletAmountSpan) {
      walletAmountSpan.textContent = walletAmount;
      animateWalletAmtPremium(walletAmountSpan);
    }
    if (totalWinningsSpan) {
      totalWinningsSpan.textContent = totalWinnings;
      animateWalletAmtPremium(totalWinningsSpan);
    }
    if (totalBoxesSpan) {
      totalBoxesSpan.textContent = totalBoxes;
      animateWalletAmtPremium(totalBoxesSpan);
    }
  }

  // ---- BET LOGIC ----
  const boxes = document.querySelectorAll('.box');
  const openBtn = document.querySelector('.open-btn');
  const betSlider = document.getElementById('bet-slider');
  const betAmountInput = document.getElementById('bet-amount');
  let selectedAmount = 10;

  if (betSlider && betAmountInput) {
    betSlider.addEventListener('input', () => {
      betAmountInput.value = betSlider.value;
      selectedAmount = parseInt(betSlider.value);
    });
    betAmountInput.addEventListener('input', () => {
      let val = parseInt(betAmountInput.value) || 10;
      if (val < 10) val = 10;
      if (val > 5000) val = 5000;
      betAmountInput.value = val;
      betSlider.value = val;
      selectedAmount = val;
    });
  }

  let boxOpening = false;
  if (boxes) {
    boxes.forEach(box => {
      box.addEventListener('click', () => {
        if (boxOpening) return;
        playSound('sounds/click.wav');
        openMysteryBox(box);
      });
    });
  }
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (boxOpening) return;
      playSound('sounds/click.wav');
      boxes.forEach(box => {
        box.classList.remove('opening');
        box.querySelector('.reward-anim').classList.add('hidden');
        box.style.transform = 'scale(1)';
        box.style.filter = 'drop-shadow(0 0 15px #ff00ff)';
      });
      const randomIndex = Math.floor(Math.random() * boxes.length);
      const selectedBox = boxes[randomIndex];
      selectedBox.style.transform = 'scale(1.3)';
      selectedBox.style.filter = 'drop-shadow(0 0 30px #00ffcc)';
      openMysteryBox(selectedBox);
    });
  }

  function openMysteryBox(box) {
    if (boxOpening) return;
    boxOpening = true;
    playSound('sounds/open.mp3');
    if (walletAmount < selectedAmount) {
      showWinningMessage('❌ वॉलेट में पैसे कम हैं!', walletAmount);
      shakeElement(document.querySelector('.bet-amount-ui'));
      boxOpening = false;
      return;
    }
    walletAmount -= selectedAmount;
    const reward = getMysteryReward(selectedAmount);
    walletAmount += reward;
    totalBoxes += 1;
    totalWinnings += reward;
    updateWalletUI();
    box.classList.add('opening');
    const rewardDiv = box.querySelector('.reward-anim');
    rewardDiv.classList.remove('hidden');
    if (reward === 0) {
      rewardDiv.innerHTML = '💨';
    } else {
      rewardDiv.innerHTML = `<span style="font-size:2.2rem;">🪙</span> <span style="font-weight:bold;font-size:1.5rem;">+₹${reward}</span>`;
    }
    setTimeout(() => {
      showWinningMessage(reward, walletAmount);
      setTimeout(() => {
        box.classList.remove('opening');
        rewardDiv.classList.add('hidden');
        boxOpening = false;
      }, 1000);
    }, 900);
  }

  // Mystery reward logic (rarity + chance)
  function getMysteryReward(bet) {
    const roll = Math.random();
    if (roll < 0.65) {
      return 0;
    } else if (roll < 0.9) {
      let min = Math.floor(bet * 1);
      let max = Math.floor(bet * 1.7);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else if (roll < 0.99) {
      let min = Math.floor(bet * 2);
      let max = Math.floor(bet * 3);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      return bet * 10;
    }
  }

  function showWinningMessage(reward, walletAmount) {
    const msgDiv = document.getElementById('winning-message');
    if (typeof reward === "string") {
      msgDiv.innerHTML = `<span style="color:#ff8080;">${reward}</span>`;
      showToast('Insufficient Balance!');
    } else if (reward === 0) {
      msgDiv.innerHTML = `<span style="color:#ff8080;">😔 Better luck next time!</span><br><span style="font-size:1.1rem;opacity:0.8;">वॉलेट बैलेंस: ₹${walletAmount}</span>`;
      showToast('Try Again!');
    } else if (reward >= selectedAmount * 10) {
      msgDiv.innerHTML = `💎 <span style="color:#00fff7;font-size:2.2rem;">SUPER JACKPOT!</span> 💎<br>आपने <span style="color:#ffff00;">₹${reward}</span> जीता!<br><span style="font-size:1.1rem;opacity:0.8;">Wallet: ₹${walletAmount}</span>`;
      showToast('💎 SUPER JACKPOT! +₹' + reward);
    } else if (reward >= selectedAmount * 2) {
      msgDiv.innerHTML = `🎉 <span style="color:#00ffcc;">RARE WIN!</span> 🎉<br>आपको <span style="color:#ffff00;">₹${reward}</span> मिला!<br><span style="font-size:1.1rem;opacity:0.8;">Wallet: ₹${walletAmount}</span>`;
      showToast('RARE WIN! +₹' + reward);
    } else {
      msgDiv.innerHTML = `🎁 आपको <span style="color:#ffff00;">₹${reward}</span> का इनाम मिला!<br><span style="font-size:1.1rem;opacity:0.8;">अब वॉलेट: ₹${walletAmount}</span>`;
      showToast('Congratulations! You Won ₹' + reward);
    }
    msgDiv.classList.remove('hidden');
    msgDiv.classList.add('show');
    setTimeout(() => {
      msgDiv.classList.remove('show');
      setTimeout(() => {
        msgDiv.classList.add('hidden');
      }, 300);
    }, 2000);
  }
  updateWalletUI();

  // ---- SETTINGS PAGE LOGIC ----
  const settingsIcon = document.getElementById('settings-icon');
  const settingsPage = document.getElementById('settings-page');
  const logoutBtn = document.getElementById('logout-btn');
  const depositBtn = document.getElementById('deposit-btn');
  const withdrawBtn = document.getElementById('withdraw-btn');
  const forgotBtn = document.getElementById('forgot-btn');
  const custcareBtn = document.getElementById('custcare-btn');
  const changeDpInput = document.getElementById('change-dp');
  const userDp = document.getElementById('user-dp');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  if (settingsIcon) {
    settingsIcon.addEventListener('click', () => {
      playSound('sounds/click.wav');
      settingsPage.style.display = 'flex';
    });
  }
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      settingsPage.style.display = 'none';
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      settingsPage.style.display = 'none';
      document.getElementById('game-page').style.display = 'none';
      document.getElementById('login-page').style.display = 'flex';
    });
  }

  // --------- MODERN DEPOSIT & WITHDRAW LOGIC START ---------

  // -- Deposit Modal Logic --
  const depositModal = document.getElementById('deposit-modal');
  const depositCloseBtn = document.getElementById('deposit-close-btn');
  const depositPayBtn = document.getElementById('deposit-pay-btn');
  const depositAmountInput = document.getElementById('deposit-amount');
  const depositAnim = document.getElementById('deposit-anim');

  if (depositBtn) {
    depositBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      depositAnim.innerHTML = '';
      depositAmountInput.value = 100;
      depositModal.classList.remove('hidden');
    });
  }
  if (depositCloseBtn) {
    depositCloseBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      depositModal.classList.add('hidden');
    });
  }
  if (depositPayBtn) {
    depositPayBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      let amt = parseInt(depositAmountInput.value) || 0;
      if (amt < 10 || amt > 10000) {
        depositAnim.innerHTML = `<span style="color:#ff8080;">Enter ₹10 - ₹10000</span>`;
        depositAmountInput.focus();
        return;
      }
      depositAnim.innerHTML = `<span style="font-size:2.3rem;animation:spinCoin 1.2s linear infinite;display:inline-block;">🪙</span>
      <div style="color:#00fff7;font-weight:bold;">Processing...</div>
      <div class="pay-anim-bar"></div>`;
      depositPayBtn.disabled = true;
      setTimeout(() => {
        walletAmount += amt;
        updateWalletUI();
        depositAnim.innerHTML = `<span style="font-size:2.2rem;">✅</span> <span style="color:#00ffcc;">₹${amt} Added!</span>`;
        showToast('₹' + amt + ' added to wallet!');
        depositPayBtn.disabled = false;
        setTimeout(() => {
          depositModal.classList.add('hidden');
          depositAnim.innerHTML = '';
        }, 1200);
      }, 1700);
    });
  }

  // -- Withdraw Modal Logic --
  const withdrawModal = document.getElementById('withdraw-modal');
  const withdrawCloseBtn = document.getElementById('withdraw-close-btn');
  const withdrawPayBtn = document.getElementById('withdraw-pay-btn');
  const withdrawAmountInput = document.getElementById('withdraw-amount');
  const withdrawUpiInput = document.getElementById('withdraw-upi');
  const withdrawAnim = document.getElementById('withdraw-anim');

  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      withdrawAnim.innerHTML = '';
      withdrawAmountInput.value = 100;
      withdrawUpiInput.value = '';
      withdrawModal.classList.remove('hidden');
    });
  }
  if (withdrawCloseBtn) {
    withdrawCloseBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      withdrawModal.classList.add('hidden');
    });
  }
  if (withdrawPayBtn) {
    withdrawPayBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      let amt = parseInt(withdrawAmountInput.value) || 0;
      let upi = withdrawUpiInput.value.trim();
      if (amt < 50 || amt > 10000) {
        withdrawAnim.innerHTML = `<span style="color:#ff8080;">Enter ₹50 - ₹10000</span>`;
        withdrawAmountInput.focus();
        return;
      }
      if (amt > walletAmount) {
        withdrawAnim.innerHTML = `<span style="color:#ff8080;">Insufficient Wallet Balance</span>`;
        withdrawAmountInput.focus();
        return;
      }
      if (!upi || !upi.includes('@') || upi.length < 7) {
        withdrawAnim.innerHTML = `<span style="color:#ff8080;">Enter valid UPI ID</span>`;
        withdrawUpiInput.focus();
        return;
      }
      withdrawAnim.innerHTML = `<span style="font-size:2.3rem;animation:spinCoin 1.2s linear infinite;display:inline-block;">🏦</span>
      <div style="color:#00fff7;font-weight:bold;">Processing...</div>
      <div class="pay-anim-bar"></div>`;
      withdrawPayBtn.disabled = true;
      setTimeout(() => {
        walletAmount -= amt;
        updateWalletUI();
        withdrawAnim.innerHTML = `<span style="font-size:2.2rem;">✅</span> <span style="color:#00ffcc;">₹${amt} Withdrawn!</span>
        <div style="font-size:.98rem;color:#fff;opacity:.8;">To UPI: <b>${upi}</b></div>`;
        showToast('₹' + amt + ' withdrawn!');
        withdrawPayBtn.disabled = false;
        setTimeout(() => {
          withdrawModal.classList.add('hidden');
          withdrawAnim.innerHTML = '';
        }, 1600);
      }, 1800);
    });
  }

  // --------- MODERN DEPOSIT & WITHDRAW LOGIC END ---------

  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Forgot Password feature coming soon!');
    });
  }
  if (custcareBtn) {
    custcareBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Customer Care: 1800-123-4567\nEmail: support@example.com');
    });
  }
  if (changeDpInput) {
    changeDpInput.addEventListener('change', function () {
      playSound('sounds/click.wav');
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          userDp.src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // ---- ACCOUNT PAGE LOGIC ----
  const accountBtn = document.getElementById('account-btn');
  const accountPage = document.getElementById('account-page');
  const closeAccountBtn = document.getElementById('close-account-btn');
  const transBtn = document.getElementById('trans-btn');
  const historyBtn = document.getElementById('history-btn');
  const notifBtn = document.getElementById('notif-btn');
  const langBtn = document.getElementById('lang-btn');
  const feedbackBtn = document.getElementById('feedback-btn');
  const aboutBtn = document.getElementById('about-btn');

  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      accountPage.style.display = 'flex';
    });
  }
  if (closeAccountBtn) {
    closeAccountBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      accountPage.style.display = 'none';
    });
  }
  if (transBtn) {
    transBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Transactions feature coming soon!');
    });
  }
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Game History feature coming soon!');
    });
  }
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('No new notifications!');
    });
  }
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Language selection coming soon!');
    });
  }
  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Feedback form coming soon!');
    });
  }
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      playSound('sounds/click.wav');
      alert('Mystery Box Game\nVersion 1.0\nCreated by You!');
    });
  }

  // ---- Terms & Refund Modal Logic (HD 3D Stylish, 50+ lines each) ----
  // Button IDs: terms-btn, refund-btn
  // Modal IDs: terms-modal, refund-modal
  // Close Btn IDs: terms-close-btn, refund-close-btn

  const termsBtn = document.getElementById('terms-btn');
  const termsModal = document.getElementById('terms-modal');
  const termsCloseBtn = document.getElementById('terms-close-btn');
  if (termsBtn && termsModal && termsCloseBtn) {
    termsBtn.onclick = () => {
      playSound('sounds/click.wav');
      termsModal.classList.remove('hidden');
    };
    termsCloseBtn.onclick = () => {
      playSound('sounds/click.wav');
      termsModal.classList.add('hidden');
    };
  }

  const refundBtn = document.getElementById('refund-btn');
  const refundModal = document.getElementById('refund-modal');
  const refundCloseBtn = document.getElementById('refund-close-btn');
  if (refundBtn && refundModal && refundCloseBtn) {
    refundBtn.onclick = () => {
      playSound('sounds/click.wav');
      refundModal.classList.remove('hidden');
    };
    refundCloseBtn.onclick = () => {
      playSound('sounds/click.wav');
      refundModal.classList.add('hidden');
    };
  }

  // ---- Animations Inject (only once) ----
  (function injectAnimStyles() {
    if (!document.getElementById('spinCoinAnim')) {
      const style = document.createElement('style');
      style.id = 'spinCoinAnim';
      style.innerHTML = `
      @keyframes spinCoin {
        0% { transform: rotateY(0deg);}
        100% { transform: rotateY(360deg);}
      }`;
      document.head.appendChild(style);
    }
    if (!document.getElementById('shake-anim-style')) {
      const style = document.createElement('style');
      style.id = 'shake-anim-style';
      style.innerHTML = `
      @keyframes shakeAnim {
        0% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
        100% { transform: translateX(0); }
      }
      .wallet-anim {
        color: #fff700 !important;
        text-shadow: 0 0 16px #ffff0099;
        animation: walletAmtFlash 0.5s cubic-bezier(.68,-0.55,.27,1.55);
      }
      @keyframes walletAmtFlash {
        0% { color: #00ffcc;}
        30% { color: #fff700;}
        75% { color: #00ffcc;}
        100% { color: #fff;}
      }
      .pay-anim-bar {
        width:100%; height: 9px; margin:10px 0 0 0; border-radius:7px;
        background: linear-gradient(90deg, #00fff7 40%, #fff 60%, #00ffcc 80%);
        background-size:250px 100%; animation:shimmerBar 1.2s linear infinite;
      }
      @keyframes shimmerBar {
        0%{background-position:-250px 0;}
        100%{background-position:250px 0;}
      }
      `;
      document.head.appendChild(style);
    }
  })();
});
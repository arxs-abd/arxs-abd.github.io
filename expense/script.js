class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDashboard();
        this.generateCalendar();
        this.setTodayAsSelected();
        this.loadExpensesForDate(this.selectedDate);
        
        // Set default date in form
        document.getElementById('expenseDate').valueAsDate = new Date();
    }

    bindEvents() {
        // Navigation
        document.getElementById('dashboardNav').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('dashboard');
        });
        
        document.getElementById('trackerNav').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('tracker');
        });
        
        document.getElementById('brandLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('dashboard');
        });

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.generateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.generateCalendar();
        });

        // Add expense
        document.getElementById('saveExpense').addEventListener('click', () => {
            this.saveExpense();
        });

        // Form validation
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExpense();
        });

        document.getElementById('expenseAmount').addEventListener('input', (e) => {
             let value = e.target.value.replace(/[^\d]/g, ''); 
            if (value) {
                value = this.formatRupiah(value);
            }
            e.target.value = value;
        })
    }

    formatRupiah(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    showPage(page) {
        document.querySelectorAll('.page-transition').forEach(el => {
            el.classList.remove('active');
        });
        
        document.getElementById(page + 'Page').classList.add('active');
        this.currentPage = page;
        
        if (page === 'dashboard') {
            this.updateDashboard();
        }
    }

    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month header
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const button = this.createDayButton(day, 'other-month', new Date(year, month - 1, day));
            calendarDays.appendChild(button);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const button = this.createDayButton(day, '', date);
            
            // Check if this is the selected date
            if (this.isSameDate(date, this.selectedDate)) {
                button.classList.add('selected');
            }
            
            calendarDays.appendChild(button);
        }

        // Next month days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const button = this.createDayButton(day, 'other-month', new Date(year, month + 1, day));
            calendarDays.appendChild(button);
        }
    }

    createDayButton(day, className, date) {
        const button = document.createElement('button');
        button.className = `calendar-day ${className}`;
        button.textContent = day;
        
        // Add expense data
        const dayExpenses = this.getExpensesForDate(date);
        if (dayExpenses.length > 0) {
            const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const badge = document.createElement('span');
            badge.className = 'expense-badge';
            badge.textContent = this.formatCurrency(total);
            button.appendChild(badge);
        }

        // Add click event
        if (!className.includes('other-month')) {
            button.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                button.classList.add('selected');
                this.selectedDate = new Date(date);
                this.loadExpensesForDate(date);
                this.updateDate(date);
            });
        }

        return button;
    }

    setTodayAsSelected() {
        const today = new Date();
        this.selectedDate = new Date(today);
        this.currentDate = new Date(today);
    }

    loadExpensesForDate(date) {
        const dateStr = this.formatDate(date);
        document.getElementById('selectedDate').textContent = dateStr;
        
        const dayExpenses = this.getExpensesForDate(date);
        const expenseList = document.getElementById('expenseList');
        
        if (dayExpenses.length === 0) {
            expenseList.innerHTML = `
                <div class="text-muted text-center py-4">
                    <i class="bi bi-inbox fs-2 mb-3 d-block"></i>
                    Tidak ada pengeluaran pada tanggal ini
                </div>
            `;
            return;
        }

        const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        expenseList.innerHTML = `
            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted">Total pengeluaran:</span>
                    <span class="h5 mb-0 expense-amount">${this.formatCurrency(total)}</span>
                </div>
                <hr>
            </div>
            ${dayExpenses.map(expense => `
                <div class="expense-item mb-3" id="expense-${expense.id}">
                    <div class="d-flex justify-content-between align-items-start p-3 border rounded shadow-sm">
                        <div>
                            <h6 class="mb-1">${expense.description}</h6>
                            <small class="text-muted">
                                <i class="bi bi-tag me-1"></i>${expense.category}
                            </small>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="expense-amount">${this.formatCurrency(expense.amount)}</span>
                            <button class="btn btn-link text-danger ms-3" onclick="expenseTracker.deleteExpense(${expense.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    getExpensesForDate(date) {
        const dateStr = date.toLocaleDateString('id-ID').split(' ')[0]; // Format tanggal lokal
        return this.expenses.filter(expense => expense.date === dateStr);
    }

    saveExpense() {
        const description = document.getElementById('expenseDescription').value;
        let amountStr = document.getElementById('expenseAmount').value.replace(/\./g, '');
        let amount = parseFloat(amountStr);
        const category = document.getElementById('expenseCategory').value;
        const date = document.getElementById('expenseDate').value;

        if (!description || !amount || !category || !date) {
            alert('Semua field harus diisi!');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount,
            category,
            date: new Date(date).toLocaleDateString('id-ID').split(' ')[0], 
            timestamp: new Date().toISOString()
        };

        this.expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(this.expenses));

        // Reset form
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').valueAsDate = new Date();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
        modal.hide();

        // Update displays
        this.generateCalendar();
        this.loadExpensesForDate(this.selectedDate);
        this.updateDashboard();

        // Show success message
        this.showToast('Expense berhasil ditambahkan!', 'success');
    }

    deleteExpense(id) {
        // Cari pengeluaran berdasarkan id
        const expenseIndex = this.expenses.findIndex(expense => expense.id === id);
        
        if (expenseIndex !== -1) {
            // Hapus pengeluaran
            this.expenses.splice(expenseIndex, 1);
            
            // Update localStorage
            localStorage.setItem('expenses', JSON.stringify(this.expenses));
            
            // Update displays
            this.generateCalendar();
            this.loadExpensesForDate(this.selectedDate);
            this.updateDashboard();
            
            // Tampilkan pesan sukses
            this.showToast('Pengeluaran berhasil dihapus!', 'danger');
        }
    }


    updateDashboard() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Calculate totals
        const totalExpense = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(this.swapDate(expense.date));
            return expenseDate >= thisMonth;
        });
        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const todayExpenses = this.getExpensesForDate(today);
        const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const avgDaily = this.expenses.length > 0 ? totalExpense / this.getUniqueDaysCount() : 0;

        // Update dashboard
        document.getElementById('totalExpense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('monthlyExpense').textContent = this.formatCurrency(monthlyTotal);
        document.getElementById('todayExpense').textContent = this.formatCurrency(todayTotal);
        document.getElementById('avgExpense').textContent = this.formatCurrency(avgDaily);

        // Update recent expenses
        this.updateRecentExpenses();
        this.updateTopCategories();
    }

    updateRecentExpenses() {
        const recent = [...this.expenses]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        const container = document.getElementById('recentExpenses');
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="text-muted text-center py-4">
                    <i class="bi bi-inbox fs-1 mb-3 d-block"></i>
                    Belum ada pengeluaran yang tercatat
                </div>
            `;
            return;
        }

        container.innerHTML = recent.map(expense => `
            <div class="expense-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${expense.description}</h6>
                        <small class="text-muted">
                            <i class="bi bi-tag me-1"></i>${expense.category} • ${this.formatDate(new Date(this.swapDate(expense.date)))}
                        </small>
                    </div>
                    <span class="expense-amount">${this.formatCurrency(expense.amount)}</span>
                </div>
            </div>
        `).join('');
    }

    updateTopCategories() {
        const categories = {};
        this.expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });

        const sortedCategories = Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const container = document.getElementById('topCategories');
        
        if (sortedCategories.length === 0) {
            container.innerHTML = `
                <div class="text-muted text-center py-4">
                    <i class="bi bi-tags fs-1 mb-3 d-block"></i>
                    Data belum tersedia
                </div>
            `;
            return;
        }

        const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
        
        container.innerHTML = sortedCategories.map(([category, amount]) => {
            const percentage = ((amount / total) * 100).toFixed(1);
            return `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>${category}</span>
                        <span class="text-muted">${percentage}%</span>
                    </div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-success" style="width: ${percentage}%"></div>
                    </div>
                    <small class="text-muted">${this.formatCurrency(amount)}</small>
                </div>
            `;
        }).join('');
    }

    getUniqueDaysCount() {
        const uniqueDays = new Set(this.expenses.map(expense => expense.date));
        return uniqueDays.size || 1;
    }

    isSameDate(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    formatDate(date) {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    swapDate(date) {
        const [d, m, y] = date.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    updateDate(dateStr) {
        const dt = new Date(dateStr);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        document.getElementById('expenseDate').value = `${yyyy}-${mm}-${dd}`;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // new ExpenseTracker();
    window.expenseTracker = new ExpenseTracker()
});

// Add some sample data for demonstration
if (!localStorage.getItem('expenses')) {
    const sampleExpenses = [
        {
            id: 1,
            description: 'Makan siang di warung',
            amount: 25000,
            category: 'Makanan',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        },
        {
            id: 2,
            description: 'Bensin motor',
            amount: 50000,
            category: 'Transportasi',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 3,
            description: 'Belanja groceries',
            amount: 150000,
            category: 'Belanja',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: 4,
            description: 'Nonton bioskop',
            amount: 75000,
            category: 'Hiburan',
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
            timestamp: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: 5,
            description: 'Kopi dan snack',
            amount: 35000,
            category: 'Makanan',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        }
    ];
    localStorage.setItem('expenses', JSON.stringify([]));
}
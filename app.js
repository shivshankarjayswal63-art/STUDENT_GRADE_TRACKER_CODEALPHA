// Student Grade Tracker Dashboard JavaScript

class StudentGradeTracker {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderStudentsTable();
    }

    setupEventListeners() {
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent();
        });
    }

    addStudent() {
        const name = document.getElementById('studentName').value.trim();
        const grade = parseFloat(document.getElementById('studentGrade').value);

        if (!name) {
            this.showToast('Student name cannot be empty', 'error');
            return;
        }

        if (isNaN(grade) || grade < 0 || grade > 100) {
            this.showToast('Grade must be between 0.0 and 100.0', 'error');
            return;
        }

        const student = {
            id: Date.now(),
            name: name,
            grade: grade
        };

        this.students.push(student);
        this.saveToLocalStorage();
        this.updateDashboard();
        this.renderStudentsTable();
        this.resetForm();
        this.showToast('Student added successfully!', 'success');
    }

    resetForm() {
        document.getElementById('studentForm').reset();
    }

    deleteStudent(id) {
        const index = this.students.findIndex(student => student.id === id);
        if (index !== -1) {
            const studentName = this.students[index].name;
            this.students.splice(index, 1);
            this.saveToLocalStorage();
            this.updateDashboard();
            this.renderStudentsTable();
            this.showToast(`Student "${studentName}" deleted successfully!`, 'success');
        }
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            const newName = prompt('Enter new name:', student.name);
            const newGrade = prompt('Enter new grade (0.0-100.0):', student.grade);

            if (newName && newName.trim() && newGrade !== null) {
                const grade = parseFloat(newGrade);
                if (!isNaN(grade) && grade >= 0 && grade <= 100) {
                    student.name = newName.trim();
                    student.grade = grade;
                    this.saveToLocalStorage();
                    this.updateDashboard();
                    this.renderStudentsTable();
                    this.showToast('Student updated successfully!', 'success');
                } else {
                    this.showToast('Invalid grade value', 'error');
                }
            }
        }
    }

    updateDashboard() {
        const totalStudents = this.students.length;
        document.getElementById('totalStudents').textContent = totalStudents;

        if (totalStudents === 0) {
            document.getElementById('averageGrade').textContent = '0.00';
            document.getElementById('highestGrade').textContent = '0.00';
            document.getElementById('lowestGrade').textContent = '0.00';
            return;
        }

        const grades = this.students.map(s => s.grade);
        const average = grades.reduce((sum, grade) => sum + grade, 0) / totalStudents;
        const highest = Math.max(...grades);
        const lowest = Math.min(...grades);

        document.getElementById('averageGrade').textContent = average.toFixed(2);
        document.getElementById('highestGrade').textContent = highest.toFixed(2);
        document.getElementById('lowestGrade').textContent = lowest.toFixed(2);
    }

    renderStudentsTable() {
        const tbody = document.getElementById('studentsTableBody');
        const noStudents = document.getElementById('noStudents');

        if (this.students.length === 0) {
            tbody.innerHTML = '';
            noStudents.style.display = 'block';
            return;
        }

        noStudents.style.display = 'none';
        tbody.innerHTML = this.students.map((student, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>
                    <span class="student-grade ${this.getGradeClass(student.grade)}">
                        ${student.grade.toFixed(1)}
                    </span>
                </td>
                <td>${this.getGradeStatus(student.grade)}</td>
                <td>
                    <button class="action-btn view-btn" onclick="tracker.viewPerformance(${student.id})">
                        <i class="fas fa-chart-line"></i> Performance
                    </button>
                    <button class="action-btn edit-btn" onclick="tracker.editStudent(${student.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="tracker.deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getGradeClass(grade) {
        if (grade >= 90) return 'grade-a';
        if (grade >= 80) return 'grade-b';
        if (grade >= 70) return 'grade-c';
        if (grade >= 60) return 'grade-d';
        return 'grade-f';
    }

    getGradeStatus(grade) {
        if (grade >= 90) return 'A';
        if (grade >= 80) return 'B';
        if (grade >= 70) return 'C';
        if (grade >= 60) return 'D';
        return 'F';
    }

    showStatistics() {
        if (this.students.length === 0) {
            this.showToast('No students to show statistics for', 'error');
            return;
        }

        this.updateModalStatistics();
        document.getElementById('statsModal').style.display = 'block';
    }

    updateModalStatistics() {
        const totalStudents = this.students.length;
        const grades = this.students.map(s => s.grade);
        const average = grades.reduce((sum, grade) => sum + grade, 0) / totalStudents;
        const highest = Math.max(...grades);
        const lowest = Math.min(...grades);
        const range = highest - lowest;

        document.getElementById('modalTotalStudents').textContent = totalStudents;
        document.getElementById('modalAverageGrade').textContent = average.toFixed(2);
        document.getElementById('modalHighestGrade').textContent = highest.toFixed(2);
        document.getElementById('modalLowestGrade').textContent = lowest.toFixed(2);
        document.getElementById('modalGradeRange').textContent = range.toFixed(2);

        // Update grade distribution
        this.updateGradeDistribution();
    }

    updateGradeDistribution() {
        const gradeRanges = {
            A: { min: 90, max: 100, count: 0, element: 'gradeA', countElement: 'countA' },
            B: { min: 80, max: 89, count: 0, element: 'gradeB', countElement: 'countB' },
            C: { min: 70, max: 79, count: 0, element: 'gradeC', countElement: 'countC' },
            D: { min: 60, max: 69, count: 0, element: 'gradeD', countElement: 'countD' },
            F: { min: 0, max: 59, count: 0, element: 'gradeF', countElement: 'countF' }
        };

        // Count students in each grade range
        this.students.forEach(student => {
            const grade = student.grade;
            for (const [letter, range] of Object.entries(gradeRanges)) {
                if (grade >= range.min && grade <= range.max) {
                    range.count++;
                    break;
                }
            }
        });

        // Update bars and counts
        const maxCount = Math.max(...Object.values(gradeRanges).map(r => r.count));
        
        Object.values(gradeRanges).forEach(range => {
            const barElement = document.getElementById(range.element);
            const countElement = document.getElementById(range.countElement);
            
            if (barElement && countElement) {
                const percentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0;
                barElement.style.width = `${percentage}%`;
                countElement.textContent = range.count;
            }
        });
    }

    exportData() {
        if (this.students.length === 0) {
            this.showToast('No data to export', 'error');
            return;
        }

        const csvContent = this.convertToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_grades.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.showToast('Data exported successfully!', 'success');
    }

    convertToCSV() {
        const headers = ['Name', 'Grade', 'Status'];
        const rows = this.students.map(student => [
            student.name,
            student.grade.toFixed(1),
            this.getGradeStatus(student.grade)
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    clearAllData() {
        if (this.students.length === 0) {
            this.showToast('No data to clear', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete all students? This action cannot be undone.')) {
            this.students = [];
            this.saveToLocalStorage();
            this.updateDashboard();
            this.renderStudentsTable();
            this.showToast('All data cleared successfully!', 'success');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    viewPerformance(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            this.showToast('Student not found', 'error');
            return;
        }

        this.showPerformanceModal(student);
    }

    showPerformanceModal(student) {
        // Update modal content
        document.getElementById('performanceStudentName').textContent = student.name;
        document.getElementById('performanceStudentGrade').textContent = `Current Grade: ${student.grade.toFixed(1)}`;

        // Generate performance data (simulated for demo)
        const performanceData = this.generatePerformanceData(student);
        
        // Update performance stats
        this.updatePerformanceStats(performanceData);
        
        // Create performance chart
        this.createPerformanceChart(performanceData);
        
        // Update analysis
        this.updatePerformanceAnalysis(student, performanceData);
        
        // Show modal
        document.getElementById('performanceModal').style.display = 'block';
    }

    generatePerformanceData(student) {
        // Simulate performance data over time
        const data = [];
        const currentGrade = student.grade;
        const baseGrade = Math.max(0, currentGrade - (Math.random() * 20 - 10));
        
        for (let i = 0; i < 10; i++) {
            const progress = i / 9; // 0 to 1
            const variation = (Math.random() - 0.5) * 10;
            const grade = baseGrade + (currentGrade - baseGrade) * progress + variation;
            data.push({
                week: i + 1,
                grade: Math.max(0, Math.min(100, grade))
            });
        }
        
        return data;
    }

    updatePerformanceStats(data) {
        const firstGrade = data[0].grade;
        const lastGrade = data[data.length - 1].grade;
        const improvement = lastGrade - firstGrade;
        
        // Determine trend
        let trend = 'Stable';
        if (improvement > 5) trend = 'Improving';
        else if (improvement < -5) trend = 'Declining';
        
        document.getElementById('gradeTrend').textContent = trend;
        document.getElementById('gradeImprovement').textContent = improvement.toFixed(1);
        
        // Color code the trend
        const trendElement = document.getElementById('gradeTrend');
        trendElement.style.color = improvement > 5 ? '#28a745' : improvement < -5 ? '#dc3545' : '#6c757d';
    }

    createPerformanceChart(data) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
        
        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => `Week ${d.week}`),
                datasets: [{
                    label: 'Grade Progress',
                    data: data.map(d => d.grade),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#667eea'
                    }
                }
            }
        });
    }

    updatePerformanceAnalysis(student, data) {
        const currentGrade = student.grade;
        const firstGrade = data[0].grade;
        const improvement = currentGrade - firstGrade;
        
        // Trend Analysis
        let trendText = 'Your performance has been stable throughout the period.';
        if (improvement > 5) {
            trendText = 'Excellent! You have shown consistent improvement in your grades.';
        } else if (improvement < -5) {
            trendText = 'Your grades have declined recently. Consider reviewing your study methods.';
        }
        document.getElementById('trendAnalysis').textContent = trendText;
        
        // Goal Analysis
        let goalText = 'You are performing at an average level.';
        if (currentGrade >= 90) {
            goalText = 'Outstanding performance! You are exceeding expectations.';
        } else if (currentGrade >= 80) {
            goalText = 'Good work! You are meeting your academic goals.';
        } else if (currentGrade >= 70) {
            goalText = 'You are on track. Focus on areas that need improvement.';
        } else {
            goalText = 'You need to work harder to reach your academic goals.';
        }
        document.getElementById('goalAnalysis').textContent = goalText;
        
        // Recommendations
        let recommendations = 'Keep up the good work and maintain your current study habits.';
        if (currentGrade < 70) {
            recommendations = 'Consider seeking additional help, reviewing study materials, and dedicating more time to challenging subjects.';
        } else if (currentGrade < 80) {
            recommendations = 'Focus on weak areas, practice regularly, and consider forming study groups.';
        } else if (currentGrade < 90) {
            recommendations = 'Excellent progress! Try to challenge yourself with advanced topics.';
        }
        document.getElementById('recommendations').textContent = recommendations;
    }
}

// Global functions for HTML onclick events
function showStatistics() {
    tracker.showStatistics();
}

function closeModal() {
    document.getElementById('statsModal').style.display = 'none';
}

function closePerformanceModal() {
    document.getElementById('performanceModal').style.display = 'none';
}

function exportData() {
    tracker.exportData();
}

function clearAllData() {
    tracker.clearAllData();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const statsModal = document.getElementById('statsModal');
    const performanceModal = document.getElementById('performanceModal');
    
    if (event.target === statsModal) {
        statsModal.style.display = 'none';
    }
    
    if (event.target === performanceModal) {
        performanceModal.style.display = 'none';
    }
}

// Initialize the application
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new StudentGradeTracker();
});
<?php
// Start session
session_start();

// Check if the user is logged in and is an L3 user
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'L3') {
    header("Location: login.php");
    exit();
}

// Include database connection
require_once 'db_connection.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard (L3)</title>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
     <link rel="stylesheet" href="dashL3.css">


    
</head>
<body>
    <!-- Bubbles Background -->
    <div class="bubbles" id="bubblesContainer"></div>

    <!-- Header -->
    <header>
        <div class="header-content">
            <!-- Toggle Button -->
            <div class="toggle-btn-container">
                <button class="toggle-btn" onclick="toggleSidebar()">☰</button>
            </div>
            
            <!-- Header Text -->
            <div class="header-text">
                <h1>Admin Dashboard (L3)</h1>
                <p>Welcome, <strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong>!</p>
            </div>
            
            <!-- Logo -->
            <div class="header-logo-container">
                <img src="slpa.png" alt="SLPA Logo" class="header-logo">
            </div>
        </div>
    </header>

    <!-- Sidebar Menu -->
    <div class="sidebar" id="sidebar">
        <a href="DashboardL3.php" class="active"><i class="fas fa-home"></i> Home</a>
        <a href="Manage_UsersL3.php"><i class="fas fa-users"></i> Manage Users</a>
        <a href="#" data-toggle="manageDivisionsMenu" onclick="toggleMenu('manageDivisionsMenu')">
            <span class="menu-item-with-arrow">
                <i class="fas fa-sitemap"></i> Manage Divisions
                <i class="fas fa-angle-right menu-arrow"></i>
            </span>
        </a>
        <div id="manageDivisionsMenu" class="menu-sub-items">
            <a href="Manage_DivisionsL3.php"><i class="fas fa-project-diagram"></i> Divisions</a>
            <a href="Add_Section.php"><i class="fas fa-layer-group"></i> Sections</a>
        </div>
        <a href="#" data-toggle="manageKPIsMenu" onclick="toggleMenu('manageKPIsMenu')">
            <span class="menu-item-with-arrow">
                <i class="fas fa-chart-line"></i> Manage KPIs
                <i class="fas fa-angle-right menu-arrow"></i>
            </span>
        </a>
        <div id="manageKPIsMenu" class="menu-sub-items">
            <a href="KPIs.php"><i class="fas fa-tasks"></i> Manage KPIs</a>
            <a href="#" data-toggle="otherMenu" onclick="toggleMenu('otherMenu')">
                <span class="menu-item-with-arrow">
                    <i class="fas fa-cogs"></i> Other
                    <i class="fas fa-angle-right menu-arrow"></i>
                </span>
            </a>
            <div id="otherMenu" class="menu-sub-items">
  <a href="emp_at.php"><i class="fas fa-calendar-check"></i> Employer Attendance</a>
            <a href="KPIs.php"><i class="fas fa-edit"></i>manage KPis</a>
            <a href="fomular.php"><i class="fas fa-calculator"></i> Formula</a>
            <a href="manage_questionL3.php"><i class="fas fa-edit"></i> Manage Questions</a>
            <a href="add_questions.php"><i class="fas fa-question-circle"></i> Add Questions</a>
            <a href="customize_formL3.php"><i class="fas fa-file-alt"></i> Customize Form</a>
            <a href="preview.php"><i class="fas fa-file-alt"></i> Preview Form</a>
            <a href="emp_f.php"><i class="fas fa-file-alt"></i> KPI Filling Form</a>
               

               

            </div>
        </div>
        <a href="Threshold_ManagementL3.php"><i class="fas fa-sliders-h"></i> Thresholds</a>
        <a href="Audit_LogsL3.php"><i class="fas fa-clipboard-list"></i> Audit Logs</a>
        <a href="Generate_ReportsL3.php"><i class="fas fa-chart-pie"></i> Reports</a>
        <a href="logout.php" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="container">
            <!-- Animated Welcome Box -->
            <div class="welcome-box">
                <i class="fas fa-tachometer-alt icon"></i>
                <h2>Welcome to the Admin Dashboard</h2>
                <p>This is the L3 admin dashboard. Use the sidebar to navigate through the available options.</p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Sri Lanka Ports Authority. All rights reserved.</p>
        <p>Contact: <a href="mailto:info@slpa.lk">info@slpa.lk</a> | Phone: +94 11 242 1200</p>
    </footer>


    <script src="dash.js"></script>
</body>
</html>
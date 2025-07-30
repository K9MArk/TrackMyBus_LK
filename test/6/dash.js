 // Generate 200 bubbles with random positions, sizes, and animation properties
        function generateBubbles() {
            const bubblesContainer = document.getElementById('bubblesContainer');
            
            for (let i = 0; i < 200; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                
                // Random size (1-10)
                const sizeClass = `size-${Math.floor(Math.random() * 10) + 1}`;
                bubble.classList.add(sizeClass);
                
                // Random position
                const leftPos = Math.random() * 100;
                bubble.style.left = `${leftPos}%`;
                
                // Random animation duration (10-20s)
                const duration = 10 + Math.random() * 10;
                bubble.style.animationDuration = `${duration}s`;
                
                // Random delay (0-5s)
                const delay = Math.random() * 5;
                bubble.style.animationDelay = `${delay}s`;
                
                // Random opacity (0.3-0.8)
                const opacity = 0.3 + Math.random() * 0.5;
                bubble.style.opacity = opacity;
                
                bubblesContainer.appendChild(bubble);
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        }

        function toggleMenu(menuId) {
            const menuItems = document.getElementById(menuId);
            menuItems.classList.toggle('active');
            
            // Find the parent menu item and toggle its active class
            const parentLink = document.querySelector(`a[data-toggle="${menuId}"]`);
            if (parentLink) {
                parentLink.classList.toggle('active');
            }
        }

        function hideMenuItems(event, menuId) {
            const menuItems = document.getElementById(menuId);
            if (!menuItems.contains(event.relatedTarget) && event.target !== menuItems) {
                menuItems.classList.remove('active');
                
                // Also remove active class from parent link
                const parentLink = document.querySelector(`a[data-toggle="${menuId}"]`);
                if (parentLink) {
                    parentLink.classList.remove('active');
                }
            }
        }

        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('active');
        }

        window.onload = function() {
            generateBubbles();
            
            const menuButtons = document.querySelectorAll('a[data-toggle]');
            menuButtons.forEach(button => {
                button.addEventListener('mouseleave', (event) => hideMenuItems(event, button.getAttribute('data-toggle')));
            });

            const sidebar = document.getElementById('sidebar');
            sidebar.addEventListener('mouseleave', closeSidebar);

            const subMenuLinks = document.querySelectorAll('.menu-sub-items');
            subMenuLinks.forEach(menu => {
                menu.addEventListener('mouseleave', (event) => {
                    menu.classList.remove('active');
                    // Also remove active class from parent link
                    const parentLink = document.querySelector(`a[data-toggle="${menu.id}"]`);
                    if (parentLink) {
                        parentLink.classList.remove('active');
                    }
                });
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', function(event) {
                const sidebar = document.getElementById('sidebar');
                const toggleBtn = document.querySelector('.toggle-btn');
                if (!sidebar.contains(event.target) && event.target !== toggleBtn) {
                    sidebar.classList.remove('active');
                }
            });
        };
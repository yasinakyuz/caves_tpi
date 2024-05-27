document.addEventListener('DOMContentLoaded', function() {
    // Header'ı yükle
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-include').innerHTML = data;

            // Tema seçimi ve uygulama
            const themeSelector = document.getElementById('theme-selector');
            if (themeSelector) {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    document.body.className = savedTheme;
                    themeSelector.value = savedTheme;
                }
                themeSelector.addEventListener('change', function() {
                    const selectedTheme = themeSelector.value;
                    document.body.className = selectedTheme;
                    localStorage.setItem('theme', selectedTheme);
                });
            }
        });
});
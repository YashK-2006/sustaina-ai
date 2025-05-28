// Main page script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main script loaded');
    
    // SDG colors mapping
    const sdgColors = {
        1: { main: '#E5243B', dark: '#C01031' },
        2: { main: '#DDA63A', dark: '#B78728' },
        3: { main: '#4C9F38', dark: '#3A7C2A' },
        4: { main: '#C5192D', dark: '#9E1424' },
        5: { main: '#FF3A21', dark: '#D42D19' },
        6: { main: '#26BDE2', dark: '#1E9BBB' },
        7: { main: '#FCC30B', dark: '#D9A609' },
        8: { main: '#A21942', dark: '#801334' },
        9: { main: '#FD6925', dark: '#DC571D' },
        10: { main: '#DD1367', dark: '#B10F53' },
        11: { main: '#FD9D24', dark: '#D9841D' },
        12: { main: '#BF8B2E', dark: '#9C7225' },
        13: { main: '#3F7E44', dark: '#2F6033' },
        14: { main: '#0A97D9', dark: '#0878AD' },
        15: { main: '#56C02B', dark: '#449D22' },
        16: { main: '#00689D', dark: '#00507A' },
        17: { main: '#19486A', dark: '#123552' }
    };

    // SDG titles and descriptions
    const sdgInfo = {
        1: { title: 'No Poverty', description: 'End poverty in all its forms everywhere' },
        2: { title: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition' },
        3: { title: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being for all' },
        4: { title: 'Quality Education', description: 'Ensure inclusive and equitable quality education' },
        5: { title: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls' },
        6: { title: 'Clean Water and Sanitation', description: 'Ensure availability and sustainable management of water' },
        7: { title: 'Affordable and Clean Energy', description: 'Ensure access to affordable, reliable, sustainable energy' },
        8: { title: 'Decent Work and Economic Growth', description: 'Promote sustained, inclusive economic growth' },
        9: { title: 'Industry, Innovation and Infrastructure', description: 'Build resilient infrastructure, promote industrialization' },
        10: { title: 'Reduced Inequalities', description: 'Reduce inequality within and among countries' },
        11: { title: 'Sustainable Cities and Communities', description: 'Make cities inclusive, safe, resilient and sustainable' },
        12: { title: 'Responsible Consumption and Production', description: 'Ensure sustainable consumption and production patterns' },
        13: { title: 'Climate Action', description: 'Take urgent action to combat climate change' },
        14: { title: 'Life Below Water', description: 'Conserve and sustainably use the oceans and marine resources' },
        15: { title: 'Life on Land', description: 'Protect, restore and promote sustainable use of ecosystems' },
        16: { title: 'Peace, Justice and Strong Institutions', description: 'Promote peaceful and inclusive societies for sustainable development' },
        17: { title: 'Partnerships for the Goals', description: 'Strengthen the means of implementation and revitalize partnerships' }
    };

    // Add click event to all SDG cards
    const sdgCards = document.querySelectorAll('.sdg-card');
    console.log(`Found ${sdgCards.length} SDG cards`);
    
    sdgCards.forEach(card => {
        card.addEventListener('click', function() {
            const sdgNumber = this.getAttribute('data-sdg');
            console.log(`Clicked on SDG ${sdgNumber}`);
            
            // Store SDG info in localStorage for the chat page
            localStorage.setItem('currentSDG', sdgNumber);
            localStorage.setItem('sdgTitle', sdgInfo[sdgNumber].title);
            localStorage.setItem('sdgDescription', sdgInfo[sdgNumber].description);
            localStorage.setItem('sdgColor', sdgColors[sdgNumber].main);
            localStorage.setItem('sdgColorDark', sdgColors[sdgNumber].dark);
            
            // Navigate to the chat page
            window.location.href = 'chatbot.html';
        });
    });

    // Add hover effect to show description
    sdgCards.forEach(card => {
        const sdgNumber = card.getAttribute('data-sdg');
        const iconColor = sdgColors[sdgNumber].main;
        
        // Set the icon background color
        const icon = card.querySelector('.sdg-icon');
        icon.style.backgroundColor = iconColor;
    });
});
// Create and initialize the network visualization
function createNetworkVisualization() {
    const width = document.getElementById('network-container').clientWidth;
    const height = 300;

    // Create SVG
    const svg = d3.select('#network-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Generate data
    const nodes = [
        { id: "center", type: "hub" },
        { id: "data1", type: "data" },
        { id: "data2", type: "data" },
        { id: "data3", type: "data" },
        { id: "data4", type: "data" },
        { id: "insight1", type: "insight" },
        { id: "insight2", type: "insight" },
        { id: "insight3", type: "insight" }
    ];

    const links = [
        { source: "data1", target: "center" },
        { source: "data2", target: "center" },
        { source: "data3", target: "center" },
        { source: "data4", target: "center" },
        { source: "center", target: "insight1" },
        { source: "center", target: "insight2" },
        { source: "center", target: "insight3" }
    ];

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(80))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(20));

    // Create links
    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .style("stroke", "#ffffff")
        .style("stroke-opacity", 0.6)
        .style("stroke-width", 2);

    // Create nodes
    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => d.type === "hub" ? 15 : 8)
        .style("fill", d => {
            switch(d.type) {
                case "hub": return "#3498DB";
                case "data": return "#E74C3C";
                case "insight": return "#2ECC71";
                default: return "#ffffff";
            }
        })
        .style("stroke", "#ffffff")
        .style("stroke-width", 2)
        .call(drag(simulation));

    // Add pulse animation to nodes
    node.filter(d => d.type === "data" || d.type === "insight")
        .append("animate")
        .attr("attributeName", "r")
        .attr("values", "8;10;8")
        .attr("dur", "2s")
        .attr("repeatCount", "indefinite");

    // Update positions on simulation tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Drag functionality
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}

// Initialize network visualization when the page loads
window.addEventListener('load', createNetworkVisualization);

// Recreate visualization on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('network-container');
    container.innerHTML = '';
    createNetworkVisualization();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animated counter function
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.round(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };

    updateCounter();
}

// Start counter animations when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(animateCounter);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats container
const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    observer.observe(statsContainer);
}

// Service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const service = card.getAttribute('data-service');
        card.style.background = `linear-gradient(45deg, var(--primary) 0%, var(--secondary) 100%)`;
        card.style.color = 'white';
        card.querySelector('h3').style.color = 'white';
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = 'white';
        card.style.color = 'var(--dark)';
        card.querySelector('h3').style.color = 'var(--primary)';
    });
});

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});
